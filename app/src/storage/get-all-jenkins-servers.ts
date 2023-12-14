import {
	startsWith, storage, ListResult, Result
} from '@forge/api';
import { JenkinsPipeline, JenkinsServer } from '../common/types';
import { SERVER_STORAGE_KEY_PREFIX } from './constants';
import { Logger } from '../config/logger';

async function getAllJenkinsServers(): Promise<JenkinsServer[]> {
	const logger = Logger.getInstance('getAllJenkinsServers');

	const jenkinsServer = {
		name: 'test updating a server',
		uuid: '04cf9667-87b7-46c3-beac-0b0962dc9827',
		secret: 't99l2aNLg1xGonU7KmOI',
		pipelines: [
			{
				name: 'Pollinator Check Pipeline Staging/main',
				lastEventType: 'build',
				lastEventStatus: 'successful',
				lastEventDate: '2023-12-14T04:54:54.531081Z'
			},
			{
				name: '#76337',
				lastEventType: 'deployment',
				lastEventStatus: 'successful',
				lastEventDate: '2023-12-14T04:47:31.723604Z'
			},
			{
				name: '#53676',
				lastEventType: 'deployment',
				lastEventStatus: 'successful',
				lastEventDate: '2023-12-14T04:55:21.893613Z'
			},
			{
				name: 'Pollinator Check Pipeline/main',
				lastEventType: 'build',
				lastEventStatus: 'successful',
				lastEventDate: '2023-12-14T04:47:58.750527Z'
			},
			{
				name: '#76334',
				lastEventType: 'deployment',
				lastEventStatus: 'successful',
				lastEventDate: '2023-12-14T04:02:37.206491Z'
			},
			{
				name: '#53673',
				lastEventType: 'deployment',
				lastEventStatus: 'successful',
				lastEventDate: '2023-12-14T04:10:23.653571Z'
			},
			{
				name: '#76335',
				lastEventType: 'deployment',
				lastEventStatus: 'successful',
				lastEventDate: '2023-12-14T04:17:35.825902Z'
			},
			{
				name: '#53674',
				lastEventType: 'deployment',
				lastEventStatus: 'successful',
				lastEventDate: '2023-12-14T04:25:17.168553Z'
			},
			{
				name: '#76336',
				lastEventType: 'deployment',
				lastEventStatus: 'successful',
				lastEventDate: '2023-12-14T04:32:36.444911Z'
			},
			{
				name: '#53675',
				lastEventType: 'deployment',
				lastEventStatus: 'successful',
				lastEventDate: '2023-12-14T04:40:20.708686Z'
			}
		],
		pluginConfig: undefined
	};

	console.log('about to create update available server', jenkinsServer);
	await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${'04cf9667-87b7-46c3-beac-0b0962dc9827'}`, jenkinsServer);
	try {
		logger.debug('Getting Jenkins servers.');

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
		logger.error('Failed to fetch Jenkins server list', { error });
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
