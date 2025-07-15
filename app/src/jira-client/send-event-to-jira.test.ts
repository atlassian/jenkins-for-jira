import api from '@forge/api';
import { Errors } from '../common/error-messages';
import { sendEventToJira } from './send-event-to-jira';
import { EventType } from '../common/types';
import { InvalidPayloadError } from '../common/error';

jest.mock('@forge/api', () => ({
	...jest.requireActual('@forge/api'),
	asApp: jest.fn().mockReturnValue({
		requestJira: jest.fn()
	})
}));

describe('Send event to Jira suite', () => {
	it('Should throw an error if no eventType is passed', async () => {
		const error = new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
		await expect(sendEventToJira(null!, '1234', { thing: 'value' })).rejects.toThrow(error);
	});

	it('Should throw an error if no cloudId is passed', async () => {
		const error = new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
		await expect(sendEventToJira(EventType.BUILD, null!, { thing: 'value' })).rejects.toThrow(error);
	});

	it('Should throw an error if no payload is passed', async () => {
		const error = new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
		await expect(sendEventToJira(EventType.BUILD, '1234', null!)).rejects.toThrow(error);
	});

	it('Should throw an error when invalid eventType is passes', async () => {
		const error = new InvalidPayloadError(Errors.INVALID_EVENT_TYPE);
		await expect(sendEventToJira(<EventType>'FAKE_EVENT', '1234', { thing: 'banana' })).rejects.toThrow(error);
	});

	it('Should return status with empty body if no responseString is returned', async () => {
		const mockResponse = { status: 200, text: jest.fn() };
		api.asApp().requestJira = jest.fn().mockImplementation(() => ({
			then: (callback: any) => Promise.resolve(callback(mockResponse))
		}));

		const response = await sendEventToJira(EventType.BUILD, '1234', { thing: 'value' });
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

		const mockText = jest.fn(() => {
			return Promise.resolve(JSON.stringify({
				...resPayload
			}));
		});
		const mockResponse = { status: 200, text: mockText };
		api.asApp().requestJira = jest.fn().mockImplementation(() => ({
			then: (callback: any) => Promise.resolve(callback(mockResponse))
		}));

		const response = await sendEventToJira(EventType.DEPLOYMENT, '1234', { thing: 'value' });
		expect(response).toEqual({ status: 200, body: { data: resPayload.data } });
	});
});
