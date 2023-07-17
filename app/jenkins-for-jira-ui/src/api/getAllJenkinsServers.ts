import { invoke } from '@forge/bridge';
import { JenkinsServer } from '../../../src/common/types';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsTrackEventsEnum
} from '../common/analytics/analytics-events';
import { AnalyticsClient } from '../common/analytics/analytics-client';

const analyticsClient = new AnalyticsClient();

const sendJenkinsServersAnalytics = async (jenkinsServers: JenkinsServer[]): Promise<void> => {
	await analyticsClient.sendAnalytics(
		AnalyticsEventTypes.TrackEvent,
		AnalyticsTrackEventsEnum.GetServerSuccessJenkinsConfigurationName,
		{
			source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName
		}
	);

	const totalNumberOfServers = jenkinsServers.length;
	const totalNumberOfServersWithoutPipelines = jenkinsServers.filter((server: JenkinsServer) =>
		server.pipelines.length === 0).length;
	const totalNumberOfServersWithPipelines = jenkinsServers.filter((server: JenkinsServer) =>
		server.pipelines.length > 0).length;

	await analyticsClient.sendAnalytics(
		AnalyticsEventTypes.TrackEvent,
		AnalyticsTrackEventsEnum.TotalNumberJenkinsServersName,
		{
			source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName,
			totalNumberOfServers
		}
	);

	await analyticsClient.sendAnalytics(
		AnalyticsEventTypes.TrackEvent,
		AnalyticsTrackEventsEnum.TotalNumberOfServersWithPipelines,
		{
			source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName,
			totalNumberOfServersWithPipelines
		}
	);

	await analyticsClient.sendAnalytics(
		AnalyticsEventTypes.TrackEvent,
		AnalyticsTrackEventsEnum.TotalNumberOfServersWithoutPipelines,
		{
			source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName,
			totalNumberOfServersWithoutPipelines
		}
	);
};

const getAllJenkinsServers = async (): Promise<JenkinsServer[]> => {
	try {
		const jenkinsServers = await invoke('getAllJenkinsServers') as JenkinsServer[];

		if (jenkinsServers.length) {
			sendJenkinsServersAnalytics(jenkinsServers);
			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.GetServerSuccessManageConnectionName,
				{
					source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName
				}
			);
		}

		log({ eventType: 'getAllJenkinsServersSuccess' });
		return jenkinsServers;
	} catch (e) {
		console.error('Failed to get Jenkins servers', e);

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.TrackEvent,
			AnalyticsTrackEventsEnum.GetServerErrorJenkinsConfigurationName,
			{
				source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName
			}
		);

		return [];
	}
};

export {
	getAllJenkinsServers
};
