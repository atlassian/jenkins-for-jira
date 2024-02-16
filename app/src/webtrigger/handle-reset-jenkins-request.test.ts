import * as atlassianJwt from 'atlassian-jwt';
import * as jwt from './jwt';
import { getAllJenkinsServers } from '../storage/get-all-jenkins-servers';
import { mockSingleJenkinsPipeline, testUuid } from '../storage/mockData';
import { disconnectJenkinsServer } from '../storage/disconnect-jenkins-server';
import { handleResetJenkinsRequest } from './handle-reset-jenkins-request';
import { deleteBuilds } from '../jira-client/delete-builds';
import { deleteDeployments } from '../jira-client/delete-deployments';
import * as getAllJenkinsServersModule from '../storage/get-all-jenkins-servers';
import {
	JwtVerificationFailedError,
	MissingCloudIdError,
	UnsupportedRequestTypeError
} from '../common/error';
import { Errors } from '../common/error-messages';

jest.mock('../storage/get-all-jenkins-servers');
jest.mock('../storage/disconnect-jenkins-server');
jest.mock('../jira-client/delete-builds');
jest.mock('../jira-client/delete-deployments');

const CLOUD_ID = '97eaf652-4b6e-46cf-80c2-d99327a63bc1';

jest.mock('atlassian-jwt', () => {
	return {
		__esModule: true,
		...jest.requireActual('atlassian-jwt')
	};
});

jest.mock('@forge/api', () => {
	return {
		__getRuntime: jest.fn()
	};
});

jest.mock('@forge/metrics', () => {
	const incr = jest.fn();
	const counter = jest.fn(() => ({ incr }));

	return {
		__esModule: true,
		default: {
			internalMetrics: {
				counter
			}
		},
		internalMetrics: {
			counter
		}
	};
});

describe('Reset Jenkins Server request suite', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const now = Date.now() / 1000; // Convert milliseconds to seconds
	const iat = now - 2; // Subtract 2 seconds

	// Mock verified claims data with the updated iat
	const verifiedClaims = {
		exp: now + 3600,
		aud: ['jenkins-forge-app'],
		iat,
		iss: 'jenkins-plugin',
		request_body_json: JSON.stringify({ requestType: 'ping' })
	};

	describe('Should handle errors', () => {
		it('Should throw a JwtVerificationFailedError when JWT cannot be verified', async () => {
			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			await handleResetJenkinsRequest(mockRequest, { installContext: 'some-install-context' });

			const jwtTokenValidationError = () => {
				throw new JwtVerificationFailedError(Errors.JWT_VERIFICATION_FAILED);
			};
			expect(jwtTokenValidationError).toThrow(JwtVerificationFailedError);
		});

		it('Should throw InvalidPayloadError if requestType is not resetJenkinsServer or deleteBuildsDeployments', async () => {
			jest.spyOn(atlassianJwt, 'getAlgorithm').mockReturnValue('HS256');
			jest.spyOn(atlassianJwt, 'decodeSymmetric').mockReturnValue(verifiedClaims);

			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			await handleResetJenkinsRequest(mockRequest, { installContext: CLOUD_ID });

			const unsupportedRequestTypeError = () => {
				throw new UnsupportedRequestTypeError(Errors.UNSUPPORTED_REQUEST_TYPE);
			};
			expect(unsupportedRequestTypeError).toThrow(UnsupportedRequestTypeError);
		});

		it('Should throw MissingCloudIdError if installContext has no CloudID', async () => {
			jest.spyOn(atlassianJwt, 'getAlgorithm').mockReturnValue('HS256');
			jest.spyOn(atlassianJwt, 'decodeSymmetric').mockReturnValue(verifiedClaims);
			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			// @ts-ignore
			await handleResetJenkinsRequest(mockRequest, { installContext: null });

			const missingCloudIdError = () => {
				throw new MissingCloudIdError(Errors.MISSING_CLOUD_ID);
			};
			expect(missingCloudIdError).toThrow(MissingCloudIdError);
		});

		it('Should throw MissingCloudIdError if installContext is not a string', async () => {
			jest.spyOn(atlassianJwt, 'getAlgorithm').mockReturnValue('HS256');
			jest.spyOn(atlassianJwt, 'decodeSymmetric').mockReturnValue(verifiedClaims);
			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			// @ts-ignore
			await handleResetJenkinsRequest(mockRequest, { installContext: 123 });

			const missingCloudIdError = () => {
				throw new MissingCloudIdError(Errors.MISSING_CLOUD_ID);
			};
			expect(missingCloudIdError).toThrow(MissingCloudIdError);
		});
	});

	describe('Should handle resetting the Jenkins server when requestType is resetJenkinsServer', () => {
		beforeEach(() => {
			jest.spyOn(atlassianJwt, 'getAlgorithm').mockReturnValue('HS256');
			jest.spyOn(atlassianJwt, 'decodeSymmetric').mockReturnValue(verifiedClaims);
			const jwtMock = jest.spyOn(jwt, 'extractBodyFromSymmetricJwt');
			jwtMock.mockReturnValue({ requestType: 'resetJenkinsServer' });
			const mock = jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers');
			// @ts-ignore
			mock.mockReturnValue([mockSingleJenkinsPipeline]);
		});

		it('Should return 200 response when resetting Jenkins server succeeds', async () => {
			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			const resetServer = await handleResetJenkinsRequest(mockRequest, { installContext: CLOUD_ID });
			const response = {
				body: '{"success": true}',
				headers: {
					'Content-Type': ['application/json']
				},
				statusCode: 200
			};

			expect(getAllJenkinsServers).toBeCalled();
			expect(disconnectJenkinsServer).toBeCalledWith(mockSingleJenkinsPipeline.uuid, CLOUD_ID, '');
			expect(deleteBuilds).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
			expect(deleteDeployments).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
			expect(resetServer).toEqual(response);
		});
	});

	describe('Should handle deleting builds and deployments when requestType is deleteBuildsDeployments', () => {
		beforeEach(() => {
			jest.spyOn(atlassianJwt, 'getAlgorithm').mockReturnValue('HS256');
			jest.spyOn(atlassianJwt, 'decodeSymmetric').mockReturnValue(verifiedClaims);
		});

		it('Should return 400 response when no UUID is passed', async () => {
			const jwtMock = jest.spyOn(jwt, 'extractBodyFromSymmetricJwt');
			jwtMock.mockReturnValue({ requestType: 'deleteBuildsDeployments' });
			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			const resetServer = await handleResetJenkinsRequest(mockRequest, { installContext: CLOUD_ID });
			const response = {
				body: `{"error": ${Errors.MISSING_UUID}`,
				headers: {
					'Content-Type': ['application/json']
				},
				statusCode: 400
			};

			expect(deleteBuilds).not.toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
			expect(deleteDeployments).not.toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
			expect(resetServer).toEqual(response);
		});

		it('Should return 200 response when deleting builds and deployments succeeds', async () => {
			const jwtMock = jest.spyOn(jwt, 'extractBodyFromSymmetricJwt');
			jwtMock.mockReturnValue({ requestType: 'deleteBuildsDeployments', data: { uuid: testUuid } });
			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			const resetServer = await handleResetJenkinsRequest(mockRequest, { installContext: CLOUD_ID });
			const response = {
				body: '{"success": true}',
				headers: {
					'Content-Type': ['application/json']
				},
				statusCode: 200
			};

			expect(deleteBuilds).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
			expect(deleteDeployments).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
			expect(resetServer).toEqual(response);
		});
	});
});
