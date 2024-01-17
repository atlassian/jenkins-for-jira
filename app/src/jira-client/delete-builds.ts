import api, { route, Route } from '@forge/api';
import { JiraResponse } from './types';
import { InvalidPayloadError } from '../common/error';
import { Errors } from '../common/error-messages';
import { Logger } from '../config/logger';

async function deleteBuilds(cloudId: string, jenkinsServerUuid?: string): Promise<JiraResponse> {
	const logger = Logger.getInstance('deleteBuilds');

	if (!cloudId) {
		logger.error(Errors.MISSING_CLOUD_ID);
		throw new InvalidPayloadError(Errors.MISSING_CLOUD_ID);
	}

	let deleteBuildsRoute: Route;
	if (jenkinsServerUuid) {
		// eslint-disable-next-line max-len
		deleteBuildsRoute = route`/builds/0.1/cloud/${cloudId}/bulkByProperties?cloudId=${cloudId}&jenkinsServerUuid=${jenkinsServerUuid}`;
	} else {
		deleteBuildsRoute = route`/builds/0.1/cloud/${cloudId}/bulkByProperties?cloudId=${cloudId}`;
	}

	const apiResponse = await api
		.asApp()
		.requestConnectedData(deleteBuildsRoute, {
			method: 'DELETE'
		});

	logger.debug('Jenkins builds deleted');

	return {
		status: apiResponse.status,
		body: {}
	};
}

export { deleteBuilds };
