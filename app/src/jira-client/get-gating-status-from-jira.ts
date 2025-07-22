import api, { route } from '@forge/api';
import { JiraResponse } from './types';
import { InvalidPayloadError } from '../common/error';
import { Errors } from '../common/error-messages';
import { Logger } from '../config/logger';
import { getResponseData } from '../utils/get-data-from-response';

async function getGatingStatusFromJira(
	cloudId: string,
	deploymentId: string,
	pipelineId: string,
	environmentId: string
): Promise<JiraResponse> {
	const logger = Logger.getInstance('deleteBuilds');

	if (!cloudId || !deploymentId || !pipelineId || !environmentId) {
		logger.error(Errors.MISSING_REQUIRED_PROPERTIES);
		throw new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
	}

	// eslint-disable-next-line max-len
	const getGatingStatusRoute = route`/rest/deployments/0.1/pipelines/${encodeURIComponent(pipelineId)}/environments/${encodeURIComponent(environmentId)}/deployments/${encodeURIComponent(deploymentId)}/gating-status`;

	const apiResponse = await api
		.asApp()
		.requestJira(getGatingStatusRoute, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
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

	logger.info(
		'Called Jira API',
		{
			path: getGatingStatusRoute,
			status: apiResponse.status,
			response: responseData
		}
	);

	return {
		status: apiResponse.status,
		body: jiraResponse
	};
}

export { getGatingStatusFromJira };
