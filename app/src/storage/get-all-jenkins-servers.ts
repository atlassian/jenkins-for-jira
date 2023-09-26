import {
	startsWith, storage, ListResult, Result
} from '@forge/api';
import { JenkinsPipeline, JenkinsServer } from '../common/types';
import { SERVER_STORAGE_KEY_PREFIX } from './constants';
import { Logger } from '../config/logger';
import { fetchFeatureFlag } from '../config/feature-flags';
import { Environment } from '../config/env';

export interface ResolverContext {
	localId: string,
	cloudId: string,
	environmentId: string,
	environmentType: string,
	moduleKey: string,
	siteUrl: string,
	extension: { type: string },
	installContext: string,
		accountId: string,
		license: string,
		jobId: string
}

async function getAllJenkinsServers(context?: ResolverContext): Promise<JenkinsServer[]> {
	const eventType = 'getAllJenkinsServersEvent';
	const logger = Logger.getInstance('getAllJenkinsServers');

	const yourFeatureFlagKey = 'backend-test';
	const flagValue = await fetchFeatureFlag(yourFeatureFlagKey, context?.environmentType as Environment);
	logger.logInfo({ eventType, data: { flagValue } });

	try {
		logger.logInfo({ eventType });

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
