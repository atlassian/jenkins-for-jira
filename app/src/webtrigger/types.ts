import {
	BuildEventStatus, DeploymentEventStatus, EventType, JenkinsPluginConfig
} from '../common/types';

export enum RequestType {
	EVENT = 'event',
	GATING_STATUS = 'gatingStatus',
	PING = 'ping',
	PLUGIN_CONFIG = 'pluginConfig',
	RESET_JENKINS_SERVER = 'resetJenkinsServer',
	DELETE_BUILDS_DEPLOYMENTS = 'deleteBuildsDeployments'
}

export interface WebtriggerRequest {
	queryParameters: object;
	body: string;
}

export interface WebtriggerResponse {
	body: string;
	statusCode: number;
	headers: { 'Content-Type': string[] };
}

export interface ForgeTriggerContext {
	installContext: string;
}

export interface JenkinsRequest {
	requestType: RequestType,
	data?: any;
}

export interface JenkinsEvent extends JenkinsRequest {
	eventType: EventType,
	pipelineName?: string;
	status?: BuildEventStatus | DeploymentEventStatus,
	lastUpdated?: Date,
	environmentName?: string,
	payload: any
}

export interface JenkinsPluginConfigEvent extends JenkinsEvent, JenkinsPluginConfig {
	lastUpdatedOn: Date,
	ipAddress: string,
	autoBuildEnabled?: boolean,
	autoBuildRegex?: string,
	autoDeploymentsEnabled?: boolean,
	autoDeploymentsRegex?: string,
}

export interface GatingStatusRequest extends JenkinsRequest {
	deploymentId: string,
	pipelineId: string,
	environmentId: string
}
