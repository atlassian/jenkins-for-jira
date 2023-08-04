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
	pipelines: JenkinsPipeline[];
}

export interface JenkinsPipeline {
	name: string,
	lastEventDate: Date,
	lastEventStatus: BuildEventStatus | DeploymentEventStatus,
	lastEventType: EventType
}

interface CommonProperties {
	source: string;
	cloudId: string;
	jenkinsServerUuid: string;
}

interface Build {
	pipelineId: string;
	buildNumber: number;
	updateSequenceNumber: number;
	displayName: string;
	description: null;
	label: string;
	url: string;
	state: string;
	lastUpdated: string;
	issueKeys: string[];
	references: null;
	testInfo: null;
	schemaVersion: string;
}

interface Association {
	values: string[];
	associationType: string;
}

interface Deployment {
	deploymentSequenceNumber: number;
	updateSequenceNumber: number;
	associations: Association[];
	displayName: string;
	url: string;
	description: string;
	lastUpdated: string;
	label: string;
	state: string;
	pipeline: {
		id: string;
		displayName: string;
		url: string;
	};
	environment: {
		id: string;
		displayName: string;
		type: string;
	};
	schemaVersion: string;
}

export interface PayloadWithBuilds {
	properties: CommonProperties;
	providerMetadata: {
		product: string;
	};
	builds: Build[];
}

export interface PayloadWithDeployments {
	properties: CommonProperties;
	providerMetadata: {
		product: string;
	};
	deployments: Deployment[];
}
