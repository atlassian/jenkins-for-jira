import { EventType } from '../common/types';
import { InvalidPayloadError } from '../common/error';
import { JiraResponse } from './types';

async function invokeApi(url: string, payload: object): Promise<JiraResponse> {
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

	// unwrap the response from the Jira API
	const jiraResponse = JSON.parse(await apiResponse.text());

	// eslint-disable-next-line no-console,max-len
	console.log(`called Jira API ${url}. Response status: ${apiResponse.status}. Response body: ${JSON.stringify(jiraResponse)}`);

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
	switch (eventType) {
		case EventType.BUILD:
			return invokeApi(`/jira/builds/0.1/cloud/${cloudId}/bulk`, payload);
		case EventType.DEPLOYMENT:
			return invokeApi(`/jira/deployments/0.1/cloud/${cloudId}/bulk`, payload);
		default:
			throw new InvalidPayloadError(`invalid event type: ${eventType}`);
	}
}

export { sendEventToJira };
