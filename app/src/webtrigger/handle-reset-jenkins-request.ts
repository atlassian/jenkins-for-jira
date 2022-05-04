import { deleteBuilds } from '../jira-client/delete-builds';
import { deleteDeployments } from '../jira-client/delete-deployments';
import { disconnectJenkinsServer } from '../storage/disconnect-jenkins-server';
import { getAllJenkinsServers } from '../storage/get-all-jenkins-servers';
import { InvalidPayloadError } from '../common/error';
import { extractCloudId } from './helpers';
import { extractBodyFromJwt, verifyJwt } from './jwt';
import {
  ForgeTriggerContext, JenkinsRequest, RequestType, WebtriggerRequest, WebtriggerResponse,
} from './types';
import { createWebtriggerResponse, handleWebtriggerError } from './webtrigger-utils';

async function handleResetJenkinsRequest(
  request: WebtriggerRequest,
  context: ForgeTriggerContext,
): Promise<WebtriggerResponse> {
  try {
    const jwtToken = request.body;
    const secret = process.env.RESET_JENKINS_JWT_SECRET!;
    const claims = {
      issuer: 'pollinator-test',
      audience: 'jenkins-forge-app',
    };
    verifyJwt(jwtToken, secret, claims);
    const payload = extractBodyFromJwt(jwtToken);
    const jenkinsRequest = payload as JenkinsRequest;
    if (jenkinsRequest.requestType === RequestType.RESET_JENKINS_SERVER) {
      const cloudId = extractCloudId(context.installContext);
      await resetJenkinsServer(cloudId);
      return createWebtriggerResponse(200, '{"success": true}');
    }
    throw new InvalidPayloadError(`unsupported request type ${jenkinsRequest.requestType}`);
  } catch (error) {
    return handleWebtriggerError(request, error);
  }
}

async function resetJenkinsServer(cloudId: string) {
  try {
    const jenkinsServers = await getAllJenkinsServers();
    const disconnectJenkinsServerPromises: Array<Promise<any>> = [];
    jenkinsServers.forEach((jenkinsServer) => {
      const jenkinsServerUuid = jenkinsServer.uuid;
      const disconnectJenkinsServerPromise = Promise.all([
        disconnectJenkinsServer(jenkinsServerUuid),
        deleteBuilds(cloudId, jenkinsServerUuid),
        deleteDeployments(cloudId, jenkinsServerUuid),
      ]);
      disconnectJenkinsServerPromises.push(disconnectJenkinsServerPromise);
    });
    return await Promise.all(disconnectJenkinsServerPromises);
  } catch (error) {
    console.error('unexpected error during resetJenkinsServer invocation', error);
    return error;
  }
}

export { handleResetJenkinsRequest, resetJenkinsServer };
