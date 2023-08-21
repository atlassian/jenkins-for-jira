import { Errors } from '../common/error-messages';
import { sendEventToJira } from './send-event-to-jira';
import { EventType } from '../common/types';
import { InvalidPayloadError } from '../common/error';

describe('deleteDeployments suite', () => {
	it('Should throw an error if no eventType is passed', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		expect(async () => {
			// @ts-ignore
			await sendEventToJira(null, '1234', { thing: 'value' });
		}).rejects.toThrow(new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES));
	});

	it('Should throw an error if no cloudId is passed', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		expect(async () => {
			// @ts-ignore
			await sendEventToJira(EventType.BUILD, null, { thing: 'value' });
		}).rejects.toThrow(new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES));
	});

	it('Should throw an error if no payload is passed', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		expect(async () => {
			// @ts-ignore
			await sendEventToJira(EventType.BUILD, '1234', null);
		}).rejects.toThrow(new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES));
	});

	it('Should throw an error when invalid eventType is passes', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		expect(async () => {
			// @ts-ignore
			await sendEventToJira('random event type', '1234', { thing: 'value' });
		}).rejects.toThrow(new InvalidPayloadError(Errors.INVALID_EVENT_TYPE));
	});

	it('Should return status with empty body if no responseString is returned', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({ status: 200, text: jest.fn() })
			})
		};

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

		const response = await sendEventToJira(EventType.DEPLOYMENT, '1234', { thing: 'value' });
		expect(response).toEqual({ status: 200, body: { data: resPayload.data } });
	});
});
