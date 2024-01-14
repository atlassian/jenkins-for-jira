import api, { APIResponse, route, Route } from '@forge/api';
import { internalMetrics } from '@forge/metrics';
import { EventType } from '../common/types';
import { InvalidPayloadError } from '../common/error';
import { JiraResponse } from './types';
import { Errors } from '../common/error-messages';
import { Logger } from '../config/logger';
import { getResponseData } from '../utils/get-data-from-response';
import { metricFailedRequests } from '../common/metric-names';

const handleSendEventToJiraErrors = (
	apiResponse: APIResponse,
	jiraResponse: { errorMessages: any; },
	url: string,
	logger: Logger
) => {
	logger.error('Send event to Jira error', {
		statusCode: apiResponse.status,
		error: jiraResponse.errorMessages,
		path: url
	});

	if (apiResponse.status === 403) {
		internalMetrics.counter(metricFailedRequests.sendEventToJiraUnauthorizedError).incr();
	} else {
		internalMetrics.counter(metricFailedRequests.sendEventToJiraError).incr();
	}
};

async function invokeApi(
	requestRoute: Route,
	payload: object,
	logger: Logger
): Promise<JiraResponse> {
	const apiResponse = await api
		.asApp()
		.requestConnectedData(requestRoute, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				Accept: 'application/json'
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
	const result = { status: apiResponse.status, body: jiraResponse };

	if (apiResponse.status >= 400 && apiResponse.status < 599) {
		handleSendEventToJiraErrors(apiResponse, jiraResponse, requestRoute.value, logger);
		return result;
	}

	logger.info('Called Jira API', { path: 'url', status: apiResponse.status, response: responseData });
	return result;
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
			return invokeApi(route`/builds/0.1/cloud/${cloudId}/bulk`, payload, logger);
		case EventType.DEPLOYMENT:
			return invokeApi(route`/deployments/0.1/cloud/${cloudId}/bulk`, payload, logger);
		default:
			logger.error(Errors.INVALID_EVENT_TYPE);
			throw new InvalidPayloadError(Errors.INVALID_EVENT_TYPE);
	}
}

export { sendEventToJira };
