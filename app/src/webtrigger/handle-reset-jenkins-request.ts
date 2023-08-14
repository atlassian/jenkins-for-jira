import { deleteBuilds } from '../jira-client/delete-builds';
import { deleteDeployments } from '../jira-client/delete-deployments';
import { disconnectJenkinsServer } from '../storage/disconnect-jenkins-server';
import { getAllJenkinsServers } from '../storage/get-all-jenkins-servers';
import { InvocationError, UnsupportedRequestTypeError } from '../common/error';
import { extractCloudId } from './helpers';
import {
	ForgeTriggerContext, RequestType, WebtriggerRequest, WebtriggerResponse
} from './types';
import { createWebtriggerResponse, handleWebtriggerError } from './webtrigger-utils';
import { Errors } from '../common/error-messages';
import { Logger } from '../config/logger';
import { extractBodyFromSymmetricJwt, verifySymmetricJwt } from './jwt';

async function handleResetJenkinsRequest(
	request: WebtriggerRequest,
	context: ForgeTriggerContext
): Promise<WebtriggerResponse> {
	const eventType = 'handleResetJenkinsRequest';
	const logger = Logger.getInstance('handleResetJenkinsRequestEvent');

	try {
		const jwtToken = request.body;
		const secret = process.env.RESET_JENKINS_JWT_SECRET!;
		const decodedToken = verifySymmetricJwt(jwtToken, secret, logger);
		const jenkinsRequest = extractBodyFromSymmetricJwt(decodedToken);
		const cloudId = extractCloudId(context.installContext);

		if (jenkinsRequest.requestType === RequestType.RESET_JENKINS_SERVER) {
			await resetJenkinsServer(cloudId, logger, jenkinsRequest.data?.excludeUuid);
			return createWebtriggerResponse(200, '{"success": true}');
		}

		if (jenkinsRequest.requestType === RequestType.DELETE_BUILDS_DEPLOYMENTS) {
			if (jenkinsRequest.data?.uuid) {
				await deleteBuildsAndDeployments(cloudId, jenkinsRequest.data.uuid, logger);
				return createWebtriggerResponse(200, '{"success": true}');
			}
			return createWebtriggerResponse(400, `{"error": ${Errors.MISSING_UUID}`);
		}

		logger.logError({ eventType, errorMsg: Errors.UNSUPPORTED_REQUEST_TYPE });
		throw new UnsupportedRequestTypeError(Errors.UNSUPPORTED_REQUEST_TYPE);
	} catch (error) {
		return handleWebtriggerError(request, error, logger);
	}
}

async function resetJenkinsServer(cloudId: string, logger: Logger, excludeUuid?: string) {
	try {
		let jenkinsServers = await getAllJenkinsServers();
		const disconnectJenkinsServerPromises: Array<Promise<any>> = [];

		if (excludeUuid) {
			jenkinsServers = jenkinsServers.filter((jenkinsServer) => jenkinsServer.uuid !== excludeUuid);
		}

		jenkinsServers.forEach((jenkinsServer) => {
			const jenkinsServerUuid = jenkinsServer.uuid;
			const disconnectJenkinsServerPromise = Promise.all([
				disconnectJenkinsServer(jenkinsServerUuid),
				deleteBuilds(cloudId, jenkinsServerUuid),
				deleteDeployments(cloudId, jenkinsServerUuid)
			]);
			disconnectJenkinsServerPromises.push(disconnectJenkinsServerPromise);
		});

		return await Promise.all(disconnectJenkinsServerPromises);
	} catch (error) {
		logger.logError({ eventType: 'resetJenkinsServerEvent', errorMsg: Errors.INVOCATION_ERROR });
		throw new InvocationError(Errors.INVOCATION_ERROR);
	}
}

async function deleteBuildsAndDeployments(cloudId: string, uuid: string, logger: Logger) {
	try {
		await deleteBuilds(cloudId, uuid);
		await deleteDeployments(cloudId, uuid);
	} catch (error) {
		logger.logError({ eventType: 'deleteBuildsAndDeploymentsEvent', errorMsg: Errors.INVOCATION_ERROR });
		throw new InvocationError(Errors.INVOCATION_ERROR);
	}
}

export { handleResetJenkinsRequest, resetJenkinsServer, deleteBuildsAndDeployments };
