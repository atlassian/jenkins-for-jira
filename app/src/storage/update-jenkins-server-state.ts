import { storage } from '@forge/api';
import { NoJenkinsServerError } from '../common/error';
import { JenkinsPipeline, JenkinsServer } from '../common/types';
import { MAX_JENKINS_PIPELINES, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { Logger } from '../config/logger';

export const updatePipelines = (
	index: number,
	jenkinsServer: JenkinsServer,
	pipelineToUpdate: JenkinsPipeline
) => {
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

async function updateJenkinsServerState(
	uuid: string,
	pipelineToUpdate: JenkinsPipeline,
	logger?: Logger
) {
	const eventType = 'updateJenkinsServerStateEvent';

	try {
		const jenkinsServer: JenkinsServer = await storage.get(
			`${SERVER_STORAGE_KEY_PREFIX}${uuid}`
		);

		if (!jenkinsServer) {
			const errorMsg = `No Jenkins Server found for UUID ${uuid}`;
			logger?.logError({ eventType, errorMsg });
			throw new NoJenkinsServerError(errorMsg);
		}

		const index = jenkinsServer.pipelines.findIndex(
			(pipeline) => pipeline.name === pipelineToUpdate.name
		);

		updatePipelines(index, jenkinsServer, pipelineToUpdate);

		await storage.set(
			`${SERVER_STORAGE_KEY_PREFIX}${jenkinsServer.uuid}`,
			jenkinsServer
		);
	} catch (error) {
		const errorMsg =
			`Failed to update Jenkins server uuid ${uuid}`;
		logger?.logError({ eventType, errorMsg });
		throw new NoJenkinsServerError(errorMsg);
	}
}

export { updateJenkinsServerState };
