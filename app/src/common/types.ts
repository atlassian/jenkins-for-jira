export type BuildEventStatus = 'pending' | 'in_progress' | 'successful' | 'failed' | 'cancelled' | 'unknown';

export type DeploymentEventStatus = BuildEventStatus | 'rolled_back';

export enum EventType {
	BUILD = 'build',
	DEPLOYMENT = 'deployment'
}

export interface JenkinsServer {
	uuid: string,
	name: string,
	secret?: string,
	pipelines: JenkinsPipeline[],
	pluginConfig?: JenkinsPluginConfig;
}

export interface JenkinsPipeline {
	name: string,
	lastEventDate: Date,
	lastEventStatus: BuildEventStatus | DeploymentEventStatus,
	lastEventType: EventType
}

export interface JenkinsPluginConfig {
	lastUpdatedOn: Date,
	ipAddress: string,
	autoBuildEnabled: string,
	autoBuildRegex: string,
	autoDeploymentEnabled: string,
	autoDeploymentRegex: string,
}
