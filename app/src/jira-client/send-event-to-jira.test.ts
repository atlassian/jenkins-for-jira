import { Errors } from '../common/error-messages';
import { sendEventToJira } from './send-event-to-jira';
import { EventType, PayloadWithBuilds } from '../common/types';
import { InvalidPayloadError } from '../common/error';

describe('deleteDeployments suite', () => {
	const buildPayload: PayloadWithBuilds = {
		properties: {
			source: 'jenkins',
			cloudId: 'bd32dd17-ba44-4e4c-a63a-e2a79c35585f',
			jenkinsServerUuid: '8541c521-d4c2-4a3b-a53b-ef78212a3f72',
		},
		providerMetadata: {
			product: 'jenkins',
		},
		builds: [
			{
				pipelineId: '-1037018184',
				buildNumber: 1,
				updateSequenceNumber: 1691138682,
				displayName: 'testing/TEST-257',
				description: null,
				label: '#1',
				url: 'http://example.com:8080/job/new/job/TEST-389-prod-test/2/',
				state: 'successful',
				lastUpdated: '2023-08-04T08:44:42.300504Z',
				issueKeys: ['TEST-257'],
				references: null,
				testInfo: null,
				schemaVersion: '1.0',
			},
		],
	};

	it('Should throw an error if no eventType is passed', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		await expect(async () => {
			// @ts-ignore
			await sendEventToJira(null, '1234', buildPayload);
		}).rejects.toThrow(new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES));
	});

	it('Should throw an error if no cloudId is passed', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		await expect(async () => {
			// @ts-ignore
			await sendEventToJira(EventType.BUILD, null, buildPayload);
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

		await expect(async () => {
			// @ts-ignore
			await sendEventToJira('random event type', '1234', buildPayload);
		}).rejects.toThrow(new InvalidPayloadError(Errors.INVALID_EVENT_TYPE));
	});

	it('Should return status with empty body if no responseString is returned', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({ status: 200, text: jest.fn() })
			})
		};

		const response = await sendEventToJira(EventType.BUILD, '1234', buildPayload);
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

		const response = await sendEventToJira(EventType.DEPLOYMENT, '1234', buildPayload);
		expect(response).toEqual({ status: 200, body: { data: resPayload.data } });
	});
});
