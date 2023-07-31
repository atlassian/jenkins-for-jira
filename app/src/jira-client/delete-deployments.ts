import { JiraResponse } from './types';
import { InvalidPayloadError } from '../common/error';
import { Errors } from '../common/error-messages';
import { log } from '../config/logger';

async function deleteDeployments(cloudId: string, jenkinsServerUuid?: string): Promise<JiraResponse> {
	const logName = 'deleteDeployments';
	const eventType = 'deleteDeploymentsEvent';

	if (!cloudId) {
		log(
			logName,
			'ERROR',
			{
				eventType,
				errorMsg: Errors.MISSING_CLOUD_ID,
			}
		);

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

	log(
		logName,
		'DEBUG',
		{
			eventType,
			data:
				{
					message: 'Jenkins deployments deleted'
				}
		}
	);

	return {
		status: apiResponse.status,
		body: { }
	};
}

export { deleteDeployments };
