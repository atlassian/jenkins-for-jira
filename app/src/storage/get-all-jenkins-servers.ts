import {
	startsWith, storage, ListResult, Result
} from '@forge/api';
import { JenkinsPipeline, JenkinsServer } from '../common/types';
import { SERVER_STORAGE_KEY_PREFIX } from './constants';
import { Logger } from '../config/logger';

async function getAllJenkinsServers(): Promise<JenkinsServer[]> {
	const logName = 'getAllJenkinsServers';
	const eventType = 'getAllJenkinsServersEvent';
	const logger = Logger.getInstance();

	try {
		logger.logInfo(logName, { eventType });

		let results: Result[] = [];
		let response = await fetchInitialResult();
		results = response.results;

		while (response.nextCursor) {
			// eslint-disable-next-line no-await-in-loop
			response = await fetchNextResult(response.nextCursor);
			results = [...results, ...response.results];
		}

		const jenkinsServers = transformToJenkinsServers(results);

		return jenkinsServers;
	} catch (error) {
		logger.logError(
			logName,
			{
				eventType,
				errorMsg: 'Failed to fetch Jenkins server list',
				error
			}
		);
		throw error;
	}
}

function fetchInitialResult(): Promise<ListResult> {
	return storage.query()
		.where('key', startsWith(SERVER_STORAGE_KEY_PREFIX))
		.limit(20)
		.getMany();
}

function fetchNextResult(nextCursor: string) {
	return storage.query()
		.where('key', startsWith(SERVER_STORAGE_KEY_PREFIX))
		.limit(20)
		.cursor(nextCursor)
		.getMany();
}

function comparePipelines(aPipeline: JenkinsPipeline, bPipeline: JenkinsPipeline) {
	return new Date(bPipeline.lastEventDate).getTime() - new Date(aPipeline.lastEventDate).getTime();
}

function transformToJenkinsServers(queryResult: Result[]): JenkinsServer[] {
	const jenkinsServers: JenkinsServer[] = [];
	queryResult.forEach((result) => {
		const jenkinsServer: JenkinsServer = result.value as JenkinsServer;
		if (jenkinsServer.pipelines) {
			jenkinsServer.pipelines.sort(comparePipelines);
		}
		jenkinsServers.push(jenkinsServer);
	});
	return jenkinsServers;
}

export { getAllJenkinsServers };
