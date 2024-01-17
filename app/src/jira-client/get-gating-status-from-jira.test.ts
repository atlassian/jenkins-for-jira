import api from '@forge/api';
import { Errors } from '../common/error-messages';
import { getGatingStatusFromJira } from './get-gating-status-from-jira';
import { InvalidPayloadError } from '../common/error';

jest.mock('@forge/api', () => ({
	...jest.requireActual('@forge/api'),
	asApp: jest.fn().mockReturnValue({
		requestConnectedData: jest.fn()
	})
}));

describe('getGatingStatusFromJira suite', () => {
	it('Should throw an error if no cloudId is passed', async () => {
		const error = new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
		await expect(getGatingStatusFromJira(null!, '1234', '1234', '1234')).rejects.toThrow(error);
	});

	it('Should throw an error if no deploymentId is passed', async () => {
		const error = new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
		await expect(getGatingStatusFromJira('1234', null!, '1234', '1234')).rejects.toThrow(error);
	});

	it('Should throw an error if no pipelineId is passed', async () => {
		const error = new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
		await expect(getGatingStatusFromJira('1234', '1234', null!, '1234')).rejects.toThrow(error);
	});

	it('Should throw an error if no environmentId is passed', async () => {
		const error = new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
		await expect(getGatingStatusFromJira('1234', '1234', '1234', null!)).rejects.toThrow(error);
	});

	it('Should return status with empty body if no responseString is returned', async () => {
		const mockResponse = { status: 200, text: jest.fn() };
		api.asApp().requestConnectedData = jest.fn().mockImplementation(() => ({
			then: (callback: any) => Promise.resolve(callback(mockResponse))
		}));

		const response = await getGatingStatusFromJira('1234', '1234', '1234', '1234');
		expect(response).toEqual({ status: 200, body: {} });
	});

	it('Should return status with response body when responseString is returned', async () => {
		const resPayload = {
			data: {
				response: {
					acceptedBuilds: [],
					rejectedBuilds: [],
					acceptedDeployments: [],
					rejectedDeployments: []
				}
			}
		};

		const mockText = jest.fn(() => {
			return Promise.resolve(JSON.stringify({
				...resPayload
			}));
		});

		const mockResponse = { status: 200, text: mockText };
		api.asApp().requestConnectedData = jest.fn().mockImplementation(() => ({
			then: (callback: any) => Promise.resolve(callback(mockResponse))
		}));

		const response = await getGatingStatusFromJira('1234', '1234', '1234', '1234');
		expect(response).toEqual({ status: 200, body: { data: resPayload.data } });
	});
});
