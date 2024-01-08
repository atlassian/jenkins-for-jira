import { storage } from '@forge/api';
import { NoJenkinsServerError } from '../common/error';
import { JenkinsPipeline, JenkinsServer } from '../common/types';
import { MAX_JENKINS_PIPELINES, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { Logger } from '../config/logger';
import { JenkinsPluginConfigEvent } from '../webtrigger/types';

export const updateOrInsertPipeline = (jenkinsServer: JenkinsServer, incomingPipeline: JenkinsPipeline): void => {
	const pipelineExists = jenkinsServer.pipelines.some((pipeline) => pipeline.name === incomingPipeline.name);

	if (!pipelineExists) {
		insertPipeline(jenkinsServer, incomingPipeline);
	} else {
		updatePipeline(jenkinsServer, incomingPipeline);
	}
};

const insertPipeline = (jenkinsServer: JenkinsServer, incomingPipeline: JenkinsPipeline): void => {
	jenkinsServer.pipelines.push(incomingPipeline);
	enforcePipelineLimit(jenkinsServer);
};

const enforcePipelineLimit = (jenkinsServer: JenkinsServer): void => {
	if (jenkinsServer.pipelines.length > MAX_JENKINS_PIPELINES) {
		jenkinsServer.pipelines.shift();
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
	updatedPipeline.environmentName = getUniqueEnvironmentNames(
		existingPipeline.environmentName,
		incomingPipeline.environmentName
	);

	jenkinsServer.pipelines[existingPipelineIndex] = updatedPipeline;
};

const getUniqueEnvironmentNames = (existingNames = '', incomingName = ''): string => {
	const concatenatedEnvironmentNames = [existingNames, incomingName].join(',');
	return [...new Set(concatenatedEnvironmentNames.split(','))].join(',');
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

		updateOrInsertPipeline(jenkinsServer, pipelineToUpdate);

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
