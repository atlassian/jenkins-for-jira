import {
	ForgeTriggerContext,
	GatingStatusRequest,
	JenkinsEvent,
	JenkinsRequest,
	RequestType,
	WebtriggerRequest,
	WebtriggerResponse
} from './types';
import { sendEventToJira } from '../jira-client/send-event-to-jira';
import { EventType, JenkinsPipeline } from '../common/types';
import { extractCloudId, getQueryParameterValue } from './helpers';
import { updateJenkinsServerState } from '../storage/update-jenkins-server-state';
import { createWebtriggerResponse, handleWebtriggerError } from './webtrigger-utils';
import { InvalidPayloadError, NoJenkinsServerError } from '../common/error';
import { extractBodyFromJwt, verifyJwt } from './jwt';
import { getGatingStatusFromJira } from '../jira-client/get-gating-status-from-jira';
import { JiraResponse } from '../jira-client/types';
import { getJenkinsServerWithSecret } from '../storage/get-jenkins-server-with-secret';
import { Logger } from '../config/logger';

const WEBTRIGGER_UUID_PARAM_NAME = 'jenkins_server_uuid';

/**
 * Handles an incoming request from the Jenkins plugin.
 */
export default async function handleJenkinsRequest(
	request: WebtriggerRequest,
	context: ForgeTriggerContext
): Promise<WebtriggerResponse> {
	const logName = 'handleJenkinsRequest';
	const eventType = 'jenkinsEventProcessed';
	const logger = Logger.getInstance();

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
		const claims = {
			issuer: 'jenkins-plugin',
			audience: 'jenkins-forge-app'
		};

		verifyJwt(jwtToken, jenkinsServer.secret as string, claims);

		const payload = extractBodyFromJwt(jwtToken);
		const jenkinsRequest = payload as JenkinsRequest;

		let response;

		switch (jenkinsRequest.requestType) {
			case RequestType.EVENT: {
				response = await handleEvent(jenkinsRequest as JenkinsEvent, jenkinsServerUuid, cloudId, logger);
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

		logger.logInfo(logName, { eventType, data: { type: jenkinsRequest.requestType } });
		return response;
	} catch (error) {
		logger.logError(
			logName,
			{
				eventType,
				errorMsg: 'Failed to fetch Jenkins server list',
				error
			}
		);
		return handleWebtriggerError(request, error);
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
	await updateJenkinsServerState(jenkinsServerUuid, pipeline);
	event.payload.properties = event.payload.properties || {};
	event.payload.properties.cloudId = cloudId;
	event.payload.properties.jenkinsServerUuid = jenkinsServerUuid;
	const jiraResponse = await sendEventToJira(event.eventType, cloudId, event.payload);
	logJiraResponse(jiraResponse, logger);
	return createWebtriggerResponse(jiraResponse.status, jiraResponse.body);
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
	const loggerName = 'logJiraResponse';

	if (jiraResponse.status >= 400) {
		logger.logError(
			loggerName,
			{
				eventType: 'logJiraResponseErrorEvent',
				status: jiraResponse.status,
				// TODO - check what is being logged on this error
				error: JSON.stringify(jiraResponse.body)
			}
		);
	} else {
		logger.logInfo(
			loggerName,
			{
				eventType: 'logJiraResponseEvent',
				status: jiraResponse.status,
				// TODO - check what is being logged on this error
				error: JSON.stringify(jiraResponse.body)
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
