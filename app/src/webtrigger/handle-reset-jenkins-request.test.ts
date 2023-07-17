import { when } from 'jest-when';
import jwt from 'jsonwebtoken';
import { getAllJenkinsServers } from '../storage/get-all-jenkins-servers';
import { mockSingleJenkinsPipeline } from '../storage/mockData';
import { disconnectJenkinsServer } from '../storage/disconnect-jenkins-server';
import {
	resetJenkinsServer,
	deleteBuildsAndDeployments,
	handleResetJenkinsRequest
} from './handle-reset-jenkins-request';
import { deleteBuilds } from '../jira-client/delete-builds';
import { deleteDeployments } from '../jira-client/delete-deployments';
import * as jwtModule from './jwt';
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
			const verify = jest.spyOn(jwt, 'verify');
			verify.mockImplementation(() => () => ({ verified: true }));

			const decode = jest.spyOn(jwt, 'decode');
			decode.mockImplementation(() => () => ({ requestType: 'resetJenkinsServer' }));

			const mock = jest.spyOn(jwtModule, 'extractBodyFromJwt');
			mock.mockReturnValue({ requestType: 'resetJenkinsServer', data: { thing: 'stuff' } });
		});

		it('Should through InvalidPayloadError if requestType is not resetJenkinsServer or deleteBuildsDeployments', async () => {
			const mockRequest = { queryParameters: {}, body: 'my-jwt' };
			const resetServer = await handleResetJenkinsRequest(mockRequest, { installContext: CLOUD_ID });
			const response = {
				body: '{"success": true}',
				headers: {
					'Content-Type': ['application/json']
				},
				statusCode: 200
			};

			expect(resetServer).toEqual(response);
		});
	});

	when(disconnectJenkinsServer).mockImplementation(() => Promise.resolve(true));
	when(getAllJenkinsServers).mockImplementation(() => Promise.resolve([mockSingleJenkinsPipeline]));

	it('Should delete all Jenkins server configuration from Forge Storage', async () => {
		await resetJenkinsServer(CLOUD_ID);
		expect(getAllJenkinsServers).toBeCalled();
		expect(disconnectJenkinsServer).toBeCalledWith(mockSingleJenkinsPipeline.uuid);
		expect(deleteBuilds).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
		expect(deleteDeployments).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
	});

	it('Should not delete excluded server from Forge Storage', async () => {
		await resetJenkinsServer(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
		expect(getAllJenkinsServers).toBeCalled();
		expect(disconnectJenkinsServer).toBeCalledTimes(0);
		expect(deleteBuilds).toBeCalledTimes(0);
		expect(deleteDeployments).toBeCalledTimes(0);
	});

	it('Should delete builds and deployments', async () => {
		await deleteBuildsAndDeployments(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
		expect(deleteBuilds).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
		expect(deleteDeployments).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
	});
});
