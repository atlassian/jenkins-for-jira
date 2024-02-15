import { storage } from '@forge/api';
import { internalMetrics } from '@forge/metrics';
import { uniq } from 'lodash';
import { NoJenkinsServerError } from '../common/error';
import { JenkinsPipeline, JenkinsServer } from '../common/types';
import { MAX_JENKINS_PIPELINES, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { Logger } from '../config/logger';
import { JenkinsPluginConfigEvent } from '../webtrigger/types';
import { sendAnalytics } from '../analytics/analytics-client';
import { AnalyticsTrackEventsEnum } from '../analytics/analytics-events';
import { metricFailedRequests, metricSuccessfulRequests } from '../common/metric-names';

export const updateOrInsertPipeline = (jenkinsServer: JenkinsServer, incomingPipeline: JenkinsPipeline): void => {
	const pipelineExists = jenkinsServer.pipelines.some((pipeline) => pipeline.name === incomingPipeline.name);

	if (!pipelineExists) {
		insertPipeline(jenkinsServer, incomingPipeline);
	} else {
		updatePipeline(jenkinsServer, incomingPipeline);
	}
};

const insertPipeline = (jenkinsServer: JenkinsServer, incomingPipeline: JenkinsPipeline): void => {
	jenkinsServer.pipelines.unshift(incomingPipeline);
	enforcePipelineLimit(jenkinsServer);
};

const enforcePipelineLimit = (jenkinsServer: JenkinsServer): void => {
	if (jenkinsServer.pipelines.length > MAX_JENKINS_PIPELINES) {
		jenkinsServer.pipelines.pop();
	}
};

const updatePipeline = (jenkinsServer: JenkinsServer, incomingPipeline: JenkinsPipeline): void => {
	const existingPipelineIndex = jenkinsServer.pipelines.findIndex(
		(pipeline) => pipeline.name === incomingPipeline.name
	);
	const existingPipeline = jenkinsServer.pipelines[existingPipelineIndex];
	const updatedPipeline: JenkinsPipeline = {
		...existingPipeline,
		...incomingPipeline
	};
	updatedPipeline.environmentNames = getUniqueEnvironmentNames(
		existingPipeline.environmentNames,
		incomingPipeline.environmentNames
	);

	jenkinsServer.pipelines[existingPipelineIndex] = updatedPipeline;
};

// eslint-disable-next-line max-len
export const getUniqueEnvironmentNames = (existingEnvNames: string[] = [], incomingEnvNames: string[] = []): string[] => {
	const environmentNames = [...existingEnvNames, ...incomingEnvNames];
	return uniq(environmentNames);
};

async function getJenkinsServer(uuid: string, logger?: Logger): Promise<JenkinsServer> {
	console.log('UUID getJenkinsServer', uuid);
	const jenkinsServer: JenkinsServer = await storage.get(
		`${SERVER_STORAGE_KEY_PREFIX}${uuid}`
	);

	console.log('blah', !jenkinsServer);

	if (!jenkinsServer) {
		const errorMsg = `No Jenkins Server found for UUID ${uuid}`;
		logger?.error(errorMsg);
		throw new NoJenkinsServerError(errorMsg);
	}
	return jenkinsServer;
}

async function updateJenkinsServerState(
	uuid: string,
	pipelineToUpdate: JenkinsPipeline,
	logger?: Logger
): Promise<void> {
	try {
		console.log('UUID: ', uuid);
		const jenkinsServer = await getJenkinsServer(uuid, logger);
		console.log('jenkinsServer', jenkinsServer);

		updateOrInsertPipeline(jenkinsServer, pipelineToUpdate);

		await storage.set(
			`${SERVER_STORAGE_KEY_PREFIX}${jenkinsServer.uuid}`,
			jenkinsServer
		);
		internalMetrics.counter(metricSuccessfulRequests.updateJenkinsServer).incr();
	} catch (error) {
		logger?.error(`Failed to update Jenkins server uuid ${uuid}`);
		internalMetrics.counter(metricFailedRequests.updateJenkinsServerStateError).incr();
		throw error;
	}
}

function sendConnectionAnalytics(cloudId: string, jenkinsServer: JenkinsServer): void {
	const hasConfigData = !!jenkinsServer.pluginConfig?.ipAddress;
	if (hasConfigData) {
		return;
	}

	const eventPayload = {
		eventName: AnalyticsTrackEventsEnum.ConfigDataReceivedName,
		action: 'Received config plugin POST request',
		actionSubject: 'REQUEST'
	};

	sendAnalytics(cloudId, eventPayload, '', jenkinsServer.pluginConfig?.ipAddress);
}

async function updateJenkinsPluginConfigState(
	uuid: string,
	jenkinsEvent: JenkinsPluginConfigEvent,
	cloudId: string,
	logger: Logger
): Promise<void> {
	try {
		const jenkinsServer = await getJenkinsServer(uuid, logger);
		const {
			ipAddress, autoBuildEnabled, autoBuildRegex, autoDeploymentsEnabled, autoDeploymentsRegex
		} = jenkinsEvent;
		jenkinsServer.pluginConfig = {
			ipAddress,
			autoBuildEnabled,
			autoBuildRegex,
			autoDeploymentsEnabled,
			autoDeploymentsRegex,
			lastUpdatedOn: new Date()
		};
		console.log('jenkinsServer', jenkinsServer);
		await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${uuid}`, jenkinsServer);
		sendConnectionAnalytics(cloudId, jenkinsServer);
	} catch (error) {
		logger.error(`Failed to update Jenkins plugin config for server uuid ${uuid}`, { error });
		throw error;
	}
}

export { updateJenkinsServerState, updateJenkinsPluginConfigState };
