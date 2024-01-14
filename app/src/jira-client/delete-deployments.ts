import api, { route, Route } from '@forge/api';
import { JiraResponse } from './types';
import { InvalidPayloadError } from '../common/error';
import { Errors } from '../common/error-messages';
import { Logger } from '../config/logger';

async function deleteDeployments(cloudId: string, jenkinsServerUuid?: string): Promise<JiraResponse> {
	const logger = Logger.getInstance('Logger');

	if (!cloudId) {
		logger.warn(Errors.MISSING_CLOUD_ID);
		throw new InvalidPayloadError(Errors.MISSING_CLOUD_ID);
	}

	let deleteDeploymentsRoute: Route;
	if (jenkinsServerUuid) {
		// eslint-disable-next-line max-len
		deleteDeploymentsRoute = route`/deployments/0.1/cloud/${cloudId}/bulkByProperties?cloudId=${cloudId}&jenkinsServerUuid=${jenkinsServerUuid}`;
	} else {
		deleteDeploymentsRoute = route`/deployments/0.1/cloud/${cloudId}/bulkByProperties?cloudId=${cloudId}`;
	}

	// @ts-ignore // required so that Typescript doesn't complain about the missing "api" property
	// eslint-disable-next-line no-underscore-dangle
	const apiResponse = await api
		.asApp()
		.requestConnectedData(deleteDeploymentsRoute, {
			method: 'DELETE'
		});

	logger.debug('Jenkins deployments deleted');

	return {
		status: apiResponse.status,
		body: { }
	};
}

export { deleteDeployments };
