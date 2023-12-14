import {
	ForgeTriggerContext,
	GatingStatusRequest,
	JenkinsEvent,
	JenkinsPluginConfigEvent,
	RequestType,
	WebtriggerRequest,
	WebtriggerResponse
} from './types';
import {sendEventToJira} from '../jira-client/send-event-to-jira';
import {EventType, JenkinsPipeline} from '../common/types';
import {extractCloudId, getQueryParameterValue} from './helpers';
import {updateJenkinsPluginConfigState, updateJenkinsServerState} from '../storage/update-jenkins-server-state';
import {createWebtriggerResponse, handleWebtriggerError} from './webtrigger-utils';
import {InvalidPayloadError, NoJenkinsServerError} from '../common/error';
import {extractBodyFromSymmetricJwt, verifySymmetricJwt} from './jwt';
import {getGatingStatusFromJira} from '../jira-client/get-gating-status-from-jira';
import {JiraResponse} from '../jira-client/types';
import {getJenkinsServerWithSecret} from '../storage/get-jenkins-server-with-secret';
import {Logger} from '../config/logger';

const WEBTRIGGER_UUID_PARAM_NAME = 'jenkins_server_uuid';

/**
 * Handles an incoming request from the Jenkins plugin.
 */
export default async function handleJenkinsRequest(
	request: WebtriggerRequest,
	context: ForgeTriggerContext
): Promise<WebtriggerResponse> {
	const logger = Logger.getInstance('handleJenkinsRequestEvent');

	try {
		const cloudId = extractCloudId(context.installContext);

		const jenkinsServerUuid = getQueryParameterValue(
			WEBTRIGGER_UUID_PARAM_NAME,
			request.queryParameters
		);

		if (!jenkinsServerUuid) {
			throw new NoJenkinsServerError(
				`Cannot map this request to a Jenkins server (parameter ${WEBTRIGGER_UUID_PARAM_NAME} is missing!).`
			);
		}

		const jwtToken = request.body;
		const jenkinsServer = await getJenkinsServerWithSecret(jenkinsServerUuid);
		const decodedToken = verifySymmetricJwt(jwtToken, jenkinsServer.secret as string, logger);
		const jenkinsRequest = extractBodyFromSymmetricJwt(decodedToken);

		let response;

		switch (jenkinsRequest.requestType) {
			case RequestType.EVENT: {
				response = await handleEvent(jenkinsRequest as JenkinsEvent, jenkinsServerUuid, cloudId, logger);
				break;
			}
			case RequestType.PLUGIN_CONFIG: {
				response = await handlePluginConfigEvent(
					jenkinsRequest as JenkinsPluginConfigEvent, jenkinsServerUuid, logger
				);
				break;
			}
			case RequestType.PING:
				// A "ping" is just a test if the connection between Jenkins and this app is configured correctly.
				// If we get here, the JWT is already valid, so we just need to return a successful response.
				response = createWebtriggerResponse(200, '{"success": true}');
				break;
			case RequestType.GATING_STATUS:
				response = await getGatingStatus(cloudId, jenkinsRequest as GatingStatusRequest, logger);
				break;
			default:
				throw new InvalidPayloadError(`unsupported request type ${jenkinsRequest.requestType}`);
		}

		logger.info('Jenkins request success', { type: jenkinsRequest.requestType });
		return response;
	} catch (error) {
		logger.error('Failed to fetch Jenkins server list', { error });
		return handleWebtriggerError(request, error, logger);
	}
}

/**
 * Handles an incoming build or deployment event. Updates the JenkinsServer in storage and
 * then forwards the event to Jira.
 */
async function handleEvent(
	event: JenkinsEvent,
	jenkinsServerUuid: string,
	cloudId: string,
	logger: Logger
): Promise<WebtriggerResponse> {
	if (!isBuildOrDeploymentEvent(event.eventType)) {
		return createWebtriggerResponse(400, `invalid event type: ${event.eventType}`);
	}

	const pipeline: JenkinsPipeline = convertToPipeline(event);
	await updateJenkinsServerState(jenkinsServerUuid, pipeline, logger);
	event.payload.properties = event.payload.properties || {};
	event.payload.properties.cloudId = cloudId;
	event.payload.properties.jenkinsServerUuid = jenkinsServerUuid;
	const jiraResponse = await sendEventToJira(event.eventType, cloudId, event.payload);
	logJiraResponse(jiraResponse, logger);
	return createWebtriggerResponse(jiraResponse.status, jiraResponse.body);
}

/**
 * Handles an incoming pluginConfig event. Updates the JenkinsServer in storage.
 */
async function handlePluginConfigEvent(
	event: JenkinsPluginConfigEvent,
	jenkinsServerUuid: string,
	logger: Logger
): Promise<WebtriggerResponse> {
	await updateJenkinsPluginConfigState(jenkinsServerUuid, event, logger);
	return createWebtriggerResponse(200, '{"success": true}');
}

/**
 * Forwards an incoming request for a gating status to Jira and wraps the Jira response into
 * a WebtriggerResponse.
 */
async function getGatingStatus(
	cloudId: string,
	request: GatingStatusRequest,
	logger: Logger
): Promise<WebtriggerResponse> {
	const jiraResponse = await getGatingStatusFromJira(
		cloudId,
		request.deploymentId,
		request.pipelineId,
		request.environmentId
	);
	logJiraResponse(jiraResponse, logger);
	return createWebtriggerResponse(jiraResponse.status, jiraResponse.body);
}

function logJiraResponse(jiraResponse: JiraResponse, logger: Logger) {
	if (jiraResponse.status >= 400) {
		logger.error('Jira response error', { status: jiraResponse.status, error: JSON.stringify(jiraResponse.body) });
	} else {
		logger.info(
			'Jira response successful',
			{
				status: jiraResponse.status,
				response: JSON.stringify(jiraResponse.body)
			}
		);
	}
}

function isBuildOrDeploymentEvent(type: EventType): boolean {
	return type === EventType.BUILD || type === EventType.DEPLOYMENT;
}

function convertToPipeline(event: JenkinsEvent): JenkinsPipeline {
	return {
		name: event.pipelineName!,
		lastEventType: event.eventType,
		lastEventStatus: event.status!,
		lastEventDate: event.lastUpdated!
	};
}
