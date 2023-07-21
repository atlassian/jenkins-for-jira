import { JiraResponse } from './types';
import { InvalidPayloadError } from '../common/error';
import { Errors } from '../common/error-messages';

async function deleteDeployments(cloudId: string, jenkinsServerUuid?: string): Promise<JiraResponse> {
	if (!cloudId) {
		throw new InvalidPayloadError(Errors.MISSING_CLOUD_ID);
	}

	let url = `/jira/deployments/0.1/cloud/${cloudId}/bulkByProperties?cloudId=${cloudId}`;
	if (jenkinsServerUuid) {
		url += `&jenkinsServerUuid=${jenkinsServerUuid}`;
	}

	// @ts-ignore // required so that Typescript doesn't complain about the missing "api" property
	// eslint-disable-next-line no-underscore-dangle
	const apiResponse = await global.api
		.asApp()
		.__requestAtlassian(url, {
			method: 'DELETE'
		});

	return {
		status: apiResponse.status,
		body: { }
	};
}

export { deleteDeployments };
