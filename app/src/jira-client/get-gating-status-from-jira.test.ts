import { Errors } from '../common/error-messages';
import { getGatingStatusFromJira } from './get-gating-status-from-jira';
import { InvalidPayloadError } from '../common/error';

describe('deleteDeployments suite', () => {
	it('Should throw an error if no cloudId is passed', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		expect(async () => {
			// @ts-ignore
			await getGatingStatusFromJira(null, '1234', '1234', '1234');
		}).rejects.toThrow(new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES));
	});

	it('Should throw an error if no deploymentId is passed', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		expect(async () => {
			// @ts-ignore
			await getGatingStatusFromJira('1234', null, '1234', '1234');
		}).rejects.toThrow(new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES));
	});

	it('Should throw an error if no pipelineId is passed', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		expect(async () => {
			// @ts-ignore
			await getGatingStatusFromJira('1234', '1234', null, '1234');
		}).rejects.toThrow(new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES));
	});

	it('Should throw an error if no environmentId is passed', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		expect(async () => {
			// @ts-ignore
			await getGatingStatusFromJira('1234', '1234', '1234', null);
		}).rejects.toThrow(new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES));
	});

	it('Should return status with empty body if no responseString is returned', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({ status: 200, text: jest.fn() })
			})
		};

		const response = await getGatingStatusFromJira('1234', '1234', '1234', '1234');
		expect(response).toEqual({ status: 200, body: {} });
	});

	it('Should return status with response body when responseString is returned', async () => {
		const resPayload =
			{
				data: {
					response: {
						acceptedBuilds: [],
						rejectedBuilds: [],
						acceptedDeployments: [],
						rejectedDeployments: []
					}
				}
			};

		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({
					status: 200,
					text: jest.fn(() => {
						return Promise.resolve(JSON.stringify({
							...resPayload
						}));
					})
				})
			})
		};

		const response = await getGatingStatusFromJira('1234', '1234', '1234', '1234');
		expect(response).toEqual({ status: 200, body: { data: resPayload.data } });
	});
});
