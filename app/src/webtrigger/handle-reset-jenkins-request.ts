import { deleteBuilds } from '../jira-client/delete-builds';
import { deleteDeployments } from '../jira-client/delete-deployments';
import { disconnectJenkinsServer } from '../storage/disconnect-jenkins-server';
import { getAllJenkinsServers } from '../storage/get-all-jenkins-servers';
import { UnsupportedRequestTypeError } from '../common/error';
import { extractCloudId } from './helpers';
import { extractBodyFromJwt, verifyJwt } from './jwt';
import {
	ForgeTriggerContext, JenkinsRequest, RequestType, WebtriggerRequest, WebtriggerResponse
} from './types';
import { createWebtriggerResponse, handleWebtriggerError } from './webtrigger-utils';
import { Errors } from '../common/error-messages';

async function handleResetJenkinsRequest(
	request: WebtriggerRequest,
	context: ForgeTriggerContext
): Promise<WebtriggerResponse> {
	try {
		const jwtToken = request.body;
		const secret = process.env.RESET_JENKINS_JWT_SECRET!;
		const claims = {
			issuer: 'pollinator-test',
			audience: 'jenkins-forge-app'
		};

		verifyJwt(jwtToken, secret, claims);

		const payload = extractBodyFromJwt(jwtToken);
		const jenkinsRequest = payload as JenkinsRequest;
		const cloudId = extractCloudId(context.installContext);

		if (jenkinsRequest.requestType === RequestType.RESET_JENKINS_SERVER) {
			await resetJenkinsServer(cloudId, jenkinsRequest.data?.excludeUuid);
			return createWebtriggerResponse(200, '{"success": true}');
		}

		if (jenkinsRequest.requestType === RequestType.DELETE_BUILDS_DEPLOYMENTS) {
			if (jenkinsRequest.data?.uuid) {
				console.log('not being called');
				await deleteBuildsAndDeployments(cloudId, jenkinsRequest.data.uuid);
				return createWebtriggerResponse(200, '{"success": true}');
			}
			return createWebtriggerResponse(400, '{"error": "No uuid found"}');
		}

		throw new UnsupportedRequestTypeError(Errors.UNSUPPORTED_REQUEST_TYPE);
	} catch (error) {
		return handleWebtriggerError(request, error);
	}
}

async function resetJenkinsServer(cloudId: string, excludeUuid?: string) {
	try {
		let jenkinsServers = await getAllJenkinsServers();
		console.log('jenkinsServers', jenkinsServers);
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
		console.error('unexpected error during resetJenkinsServer invocation', error);
		return error;
	}
}

async function deleteBuildsAndDeployments(cloudId: string, uuid: string) {
	console.log('in here');
	try {
		await deleteBuilds(cloudId, uuid);
		await deleteDeployments(cloudId, uuid);
	} catch (error) {
		console.error('unexpected error during deleteBuildsAndDeployments invocation', error);
		throw error;
	}
}

export { handleResetJenkinsRequest, resetJenkinsServer, deleteBuildsAndDeployments };
