import { EventType } from '../common/types';
import { InvalidPayloadError } from '../common/error';
import { JiraResponse } from './types';
import { Errors } from '../common/error-messages';
import { log } from '../config/logger';
import { getResponseData } from '../utils/get-data-from-response';

async function invokeApi(url: string, payload: object): Promise<JiraResponse> {
	const logName = 'deleteBuilds';
	const eventType = 'deleteBuildsEvent';

	if (!url || !payload) {
		log(
			logName,
			'ERROR',
			{
				eventType,
				errorMsg: Errors.MISSING_REQUIRED_PROPERTIES,
			}
		);

		throw new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
	}

	// @ts-ignore // required so that Typescript doesn't complain about the missing "api" property
	// eslint-disable-next-line no-underscore-dangle
	const apiResponse = await global.api
		.asApp()
		.__requestAtlassian(url, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

	const responseString = await apiResponse.text();

	if (!responseString) {
		return {
			status: apiResponse.status,
			body: {}
		};
	}

	// unwrap the response from the Jira API
	const jiraResponse = JSON.parse(responseString);
	const responseData = getResponseData(jiraResponse);

	log(
		logName,
		'INFO',
		{
			eventType,
			data:
				{
					message: 'Called Jira API',
					path: url,
					responseStatus: apiResponse.status,
					responseData
				}
		}
	);

	return {
		status: apiResponse.status,
		body: jiraResponse
	};
}

async function sendEventToJira(
	eventType: EventType,
	cloudId: string,
	payload: object
): Promise<JiraResponse> {
	if (!eventType || !cloudId || !payload) {
		throw new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
	}

	switch (eventType) {
		case EventType.BUILD:
			return invokeApi(`/jira/builds/0.1/cloud/${cloudId}/bulk`, payload);
		case EventType.DEPLOYMENT:
			return invokeApi(`/jira/deployments/0.1/cloud/${cloudId}/bulk`, payload);
		default:
			console.error(`${Errors.INVALID_EVENT_TYPE}: ${eventType}`);
			throw new InvalidPayloadError(Errors.INVALID_EVENT_TYPE);
	}
}

export { sendEventToJira };
