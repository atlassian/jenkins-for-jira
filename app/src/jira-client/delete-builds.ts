import { JiraResponse } from './types';
import { InvalidPayloadError } from '../common/error';
import { Errors } from '../common/error-messages';
import { Logger } from '../config/logger';

async function deleteBuilds(cloudId: string, jenkinsServerUuid?: string): Promise<JiraResponse> {
	const logger = Logger.getInstance('deleteBuilds');
	const eventType = 'deleteBuildsEvent';

	if (!cloudId) {
		logger.logError({ eventType, errorMsg: Errors.MISSING_CLOUD_ID });
		throw new InvalidPayloadError(Errors.MISSING_CLOUD_ID);
	}

	let url = `/jira/builds/0.1/cloud/${cloudId}/bulkByProperties?cloudId=${cloudId}`;
	if (jenkinsServerUuid) {
		url += `&jenkinsServerUuid=${jenkinsServerUuid}`;
	}

	// @ts-ignore // required so that Typescript doesn't complain about the missing 'api' property
	// eslint-disable-next-line no-underscore-dangle
	const apiResponse = await global.api
		.asApp()
		.__requestAtlassian(url, {
			method: 'DELETE'
		});

	logger.logDebug({ eventType, data: { message: 'Jenkins builds deleted' } });

	return {
		status: apiResponse.status,
		body: {}
	};
}

export { deleteBuilds };
