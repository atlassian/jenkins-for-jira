import {
	startsWith, storage, ListResult, Result
} from '@forge/api';
// import { internalMetrics } from '@forge/metrics';
import { log } from '../analytics-logger';
import { JenkinsPipeline, JenkinsServer } from '../common/types';
import { SERVER_STORAGE_KEY_PREFIX } from './constants';
// import { metricSuccess } from '../common/metric-names';

async function getAllJenkinsServers(): Promise<JenkinsServer[]> {
	try {
		log({ eventType: 'jenkinsServerListRetrieved' });
		let results: Result[] = [];
		let response = await fetchInitialResult();
		results = response.results;

		while (response.nextCursor) {
			// eslint-disable-next-line no-await-in-loop
			response = await fetchNextResult(response.nextCursor);
			results = [...results, ...response.results];
		}

		const jenkinsServers = transformToJenkinsServers(results);

		// internalMetrics.counter(metricSuccess.getAllJenkinsServer).incr();

		return jenkinsServers;
	} catch (error) {
		console.error('Failed to fetch Jenkins server list ', error);
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
