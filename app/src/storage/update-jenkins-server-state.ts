import { storage } from '@forge/api';
import { NoJenkinsServerError } from '../common/error';
import { JenkinsPipeline, JenkinsServer } from '../common/types';
import { MAX_JENKINS_PIPELINES, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { Logger } from '../config/logger';
import { JenkinsPluginConfigEvent } from '../webtrigger/types';

export const updatePipelines = (
	index: number,
	jenkinsServer: JenkinsServer,
	pipelineToUpdate: JenkinsPipeline
): void => {
	if (index === -1 && jenkinsServer.pipelines.length < MAX_JENKINS_PIPELINES) {
		jenkinsServer.pipelines.push(pipelineToUpdate);
	} else if (index === -1 && jenkinsServer.pipelines.length === 10) {
		const oldPipelineEvent = jenkinsServer.pipelines.reduce((prev, curr) =>
			(curr.lastEventDate < prev.lastEventDate ? curr : prev));

		jenkinsServer.pipelines = jenkinsServer.pipelines.map((pipeline) =>
			(pipeline === oldPipelineEvent ? pipelineToUpdate : pipeline));
	} else {
		jenkinsServer.pipelines[index] = { ...pipelineToUpdate };
	}
};

async function getJenkinsServer(uuid: string, logger?: Logger): Promise<JenkinsServer> {
	const jenkinsServer: JenkinsServer = await storage.get(
		`${SERVER_STORAGE_KEY_PREFIX}${uuid}`
	);

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
		const jenkinsServer = await getJenkinsServer(uuid, logger);

		const index = jenkinsServer.pipelines.findIndex(
			(pipeline) => pipeline.name === pipelineToUpdate.name
		);

		updatePipelines(index, jenkinsServer, pipelineToUpdate);

		await storage.set(
			`${SERVER_STORAGE_KEY_PREFIX}${jenkinsServer.uuid}`,
			jenkinsServer
		);
	} catch (error) {
		logger?.error(`Failed to update Jenkins server uuid ${uuid}`);
		throw error;
	}
}

async function updateJenkinsPluginConfigState(
	uuid: string,
	jenkinsEvent: JenkinsPluginConfigEvent,
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
		await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${uuid}`, jenkinsServer);
	} catch (error) {
		logger.error(`Failed to update Jenkins plugin config for server uuid ${uuid}`, { error });
		throw error;
	}
}

export { updateJenkinsServerState, updateJenkinsPluginConfigState };
