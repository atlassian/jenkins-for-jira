import { EventType } from '../common/types';
import { InvalidPayloadError } from '../common/error';
import { JiraResponse } from './types';
import { Errors } from '../common/error-messages';
import { Logger } from '../config/logger';
import { getResponseData } from '../utils/get-data-from-response';

async function invokeApi(
	url: string,
	payload: object,
	eventType: EventType,
	logger: Logger
): Promise<JiraResponse> {
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

	logger.info('Called Jira API', { path: url, status: apiResponse.status, response: responseData });

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
	const logger = Logger.getInstance('sendEventToJira');

	if (!eventType || !cloudId || !payload) {
		logger.error(Errors.MISSING_REQUIRED_PROPERTIES);
		throw new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
	}

	switch (eventType) {
		case EventType.BUILD:
			return invokeApi(`/jira/builds/0.1/cloud/${cloudId}/bulk`, payload, eventType, logger);
		case EventType.DEPLOYMENT:
			return invokeApi(`/jira/deployments/0.1/cloud/${cloudId}/bulk`, payload, eventType, logger);
		default:
			logger.error(Errors.INVALID_EVENT_TYPE);
			throw new InvalidPayloadError(Errors.INVALID_EVENT_TYPE);
	}
}

export { sendEventToJira };
