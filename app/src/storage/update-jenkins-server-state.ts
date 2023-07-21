import { storage } from '@forge/api';
import { JenkinsServerStorageError, NoJenkinsServerError } from '../common/error';
import { JenkinsPipeline, JenkinsServer } from '../common/types';
import { MAX_JENKINS_PIPELINES, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { log } from '../config/logger';

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
	pipelineToUpdate: JenkinsPipeline
) {
	const logName = 'updateJenkinsServerState';
	const eventType = 'updateJenkinsServerStateEvent';

	try {
		const jenkinsServer: JenkinsServer = await storage.get(
			`${SERVER_STORAGE_KEY_PREFIX}${uuid}`
		);

		if (!jenkinsServer) {
			log(
				logName,
				'error',
				{
					eventType,
					errorMsg: `No Jenkins Server found for UUID ${uuid}`
				}
			);

			throw new NoJenkinsServerError(`No Jenkins Server found for UUID ${uuid}`);
		}

		const index = jenkinsServer.pipelines.findIndex(
			(pipeline) => pipeline.name === pipelineToUpdate.name
		);

		updatePipelines(index, jenkinsServer, pipelineToUpdate);

		await storage.set(
			`${SERVER_STORAGE_KEY_PREFIX}${jenkinsServer.uuid}`,
			jenkinsServer
		);

		log(
			logName,
			'info',
			{
				eventType,
				data:
					{
						message: 'Jenkins server state updated'
					}
			}
		);
	} catch (error) {
		log(
			logName,
			'error',
			{
				eventType,
				errorMsg:
					`Failed to update Jenkins server uuid ${uuid} with pipeline ${JSON.stringify(pipelineToUpdate)}`
			}
		);

		throw new JenkinsServerStorageError('Failed to update jenkins server state');
	}
}

export { updateJenkinsServerState };
