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

	logger.logInfo({
		eventType,
		data:
			{
				message: 'Called Jira API',
				path: url,
				status: apiResponse.status,
				response: responseData
			}
	});

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
		logger.logError({ eventType, errorMsg: Errors.MISSING_REQUIRED_PROPERTIES });
		throw new InvalidPayloadError(Errors.MISSING_REQUIRED_PROPERTIES);
	}

	logger.logDebug({ eventType, data: payload });
	// {
	// 	"properties":
	// 		{
	// 			"source":"jenkins",
	// 			"cloudId":"bd32dd17-ba44-4e4c-a63a-e2a79c35585f",
	// 			"jenkinsServerUuid":"1b625e1e-516e-4687-bb78-dc4b6c03e2f4"
	// 		},
	// 	"providerMetadata":
	// 		{
	// 			"product":"jenkins"
	// 		},
	// 	"deployments":
	// 		[
	// 			{
	// 				"deploymentSequenceNumber":64276,
	// 				"updateSequenceNumber":1691113565,
	// 				"associations":
	// 					[
	// 						{
	// 							"values": ["JFAP-1"],
	// 							"associationType":"issueKeys"
	// 						}
	// 						],
	// 				"displayName":"#64276",
	// 				"url":"http://10.237.10.102:8080/job/Pollinator%20Check%20Pipeline/job/main/64276/",
	// 				"description":"#64276",
	// 				"lastUpdated":"2023-08-04T01:46:05.858Z",
	// 				"label":"#64276",
	// 				"state":"successful",
	// 				"pipeline":
	// 					{
	// 						"id":"-1004711128",
	// 						"displayName":"Pollinator Check Pipeline/main",
	// 						"url":"http://10.237.10.102:8080/job/Pollinator%20Check%20Pipeline/job/main/"
	// 					},
	// 				"environment":
	// 					{
	// 						"id":"prod",
	// 						"displayName":"prod",
	// 						"type":"production"
	// 					},
	// 				"schemaVersion":"1.0"
	// 			}
	// 			]
	// }}

	switch (eventType) {
		case EventType.BUILD:
			return invokeApi(`/jira/builds/0.1/cloud/${cloudId}/bulk`, payload, eventType, logger);
		case EventType.DEPLOYMENT:
			return invokeApi(`/jira/deployments/0.1/cloud/${cloudId}/bulk`, payload, eventType, logger);
		default:
			logger.logError({ eventType, errorMsg: Errors.INVALID_EVENT_TYPE });
			throw new InvalidPayloadError(Errors.INVALID_EVENT_TYPE);
	}
}

export { sendEventToJira };
