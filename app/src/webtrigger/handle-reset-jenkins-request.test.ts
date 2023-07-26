import jwt from 'jsonwebtoken';
import { getAllJenkinsServers } from '../storage/get-all-jenkins-servers';
import { mockSingleJenkinsPipeline, testUuid } from '../storage/mockData';
import { disconnectJenkinsServer } from '../storage/disconnect-jenkins-server';
import { handleResetJenkinsRequest } from './handle-reset-jenkins-request';
import { deleteBuilds } from '../jira-client/delete-builds';
import { deleteDeployments } from '../jira-client/delete-deployments';
import * as jwtModule from './jwt';
import * as getAllJenkinsServersModule from '../storage/get-all-jenkins-servers';
import {
	JwtDecodingFailedError,
	JwtVerificationFailedError, MissingCloudIdError, UnsupportedRequestTypeError
} from '../common/error';
import { Errors } from '../common/error-messages';

jest.mock('../storage/get-all-jenkins-servers');
jest.mock('../storage/disconnect-jenkins-server');
jest.mock('../jira-client/delete-builds');
jest.mock('../jira-client/delete-deployments');

const CLOUD_ID = '97eaf652-4b6e-46cf-80c2-d99327a63bc1';

describe('Reset Jenkins Server request suite', () => {
	describe('Should handle errors', () => {
		it('Should throw a JwtVerificationFailedError when JWT cannot be verified', async () => {
			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			await handleResetJenkinsRequest(mockRequest, { installContext: 'some-install-context' });

			const jwtTokenValidationError = () => {
				throw new JwtVerificationFailedError(Errors.JWT_VERIFICATION_FAILED);
			};
			expect(jwtTokenValidationError).toThrow(JwtVerificationFailedError);
		});

		it('Should throw a JwtDecodingFailedError when JWT cannot be decoded', async () => {
			const signedJwt = jest.spyOn(jwt, 'sign');
			signedJwt.mockImplementation(() => () => ({ token: 'my-signed-token' }));

			const verify = jest.spyOn(jwt, 'verify');
			verify.mockImplementation(() => () => ({ verified: true }));

			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			await handleResetJenkinsRequest(mockRequest, { installContext: 'some-install-context' });
			const jwtTokenDecodingError = () => {
				throw new JwtDecodingFailedError(Errors.JWT_DECODING_ERROR);
			};
			expect(jwtTokenDecodingError).toThrow(JwtDecodingFailedError);
		});

		it('Should throw InvalidPayloadError if requestType is not resetJenkinsServer or deleteBuildsDeployments', async () => {
			const signedJwt = jest.spyOn(jwt, 'sign');
			signedJwt.mockImplementation(() => () => ({ token: 'my-signed-token' }));

			const verify = jest.spyOn(jwt, 'verify');
			verify.mockImplementation(() => () => ({ verified: true }));

			const decode = jest.spyOn(jwt, 'decode');
			decode.mockImplementation(() => () => ({ requestType: 'randomRequestType', data: { thing: 'stuff' } }));

			const mock = jest.spyOn(jwtModule, 'extractBodyFromJwt');
			mock.mockReturnValue({ requestType: 'randomRequestType' });

			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			await handleResetJenkinsRequest(mockRequest, { installContext: CLOUD_ID });

			const unsupportedRequestTypeError = () => {
				throw new UnsupportedRequestTypeError(Errors.JWT_DECODING_ERROR);
			};
			expect(unsupportedRequestTypeError).toThrow(UnsupportedRequestTypeError);
		});

		it('Should throw MissingCloudIdError if installContext has no CloudID', async () => {
			const signedJwt = jest.spyOn(jwt, 'sign');
			signedJwt.mockImplementation(() => () => ({ token: 'my-signed-token' }));

			const verify = jest.spyOn(jwt, 'verify');
			verify.mockImplementation(() => () => ({ verified: true }));

			const decode = jest.spyOn(jwt, 'decode');
			decode.mockImplementation(() => () => ({ requestType: 'randomRequestType' }));

			const mock = jest.spyOn(jwtModule, 'extractBodyFromJwt');
			mock.mockReturnValue({ requestType: 'randomRequestType' });

			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			// @ts-ignore
			await handleResetJenkinsRequest(mockRequest, { installContext: null });

			const missingCloudIdError = () => {
				throw new MissingCloudIdError(Errors.MISSING_CLOUD_ID);
			};
			expect(missingCloudIdError).toThrow(MissingCloudIdError);
		});

		it('Should throw MissingCloudIdError if installContext is not a string', async () => {
			const signedJwt = jest.spyOn(jwt, 'sign');
			signedJwt.mockImplementation(() => () => ({ token: 'my-signed-token' }));

			const verify = jest.spyOn(jwt, 'verify');
			verify.mockImplementation(() => () => ({ verified: true }));

			const decode = jest.spyOn(jwt, 'decode');
			decode.mockImplementation(() => () => ({ requestType: 'randomRequestType' }));

			const mock = jest.spyOn(jwtModule, 'extractBodyFromJwt');
			mock.mockReturnValue({ requestType: 'randomRequestType' });

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
			const signedJwt = jest.spyOn(jwt, 'sign');
			signedJwt.mockImplementation(() => () => ({ token: 'my-signed-token' }));

			const verify = jest.spyOn(jwt, 'verify');
			verify.mockImplementation(() => () => ({ verified: true }));

			const decode = jest.spyOn(jwt, 'decode');
			decode.mockImplementation(() => () => ({ requestType: 'resetJenkinsServer' }));

			const jwtMock = jest.spyOn(jwtModule, 'extractBodyFromJwt');
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
			expect(disconnectJenkinsServer).toBeCalledWith(mockSingleJenkinsPipeline.uuid);
			expect(deleteBuilds).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
			expect(deleteDeployments).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
			expect(resetServer).toEqual(response);
		});
	});

	describe('Should handle deleting builds and deployments when requestType is deleteBuildsDeployments', () => {
		beforeEach(() => {
			const signedJwt = jest.spyOn(jwt, 'sign');
			signedJwt.mockImplementation(() => () => ({ token: 'my-signed-token' }));

			const verify = jest.spyOn(jwt, 'verify');
			verify.mockImplementation(() => () => ({ verified: true }));

			const decode = jest.spyOn(jwt, 'decode');
			decode.mockImplementation(() => () => ({ requestType: 'deleteBuildsDeployments' }));
		});

		it('Should return 400 response when no UUID is passed', async () => {
			const mock = jest.spyOn(jwtModule, 'extractBodyFromJwt');
			mock.mockReturnValue({ requestType: 'deleteBuildsDeployments' });
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
			const mock = jest.spyOn(jwtModule, 'extractBodyFromJwt');
			mock.mockReturnValue({ requestType: 'deleteBuildsDeployments', data: { uuid: testUuid } });
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
