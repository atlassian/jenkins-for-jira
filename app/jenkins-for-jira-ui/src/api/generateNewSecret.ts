import { invoke } from '@forge/bridge';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsTrackEventsEnum
} from '../common/analytics/analytics-events';
import { AnalyticsClient } from '../common/analytics/analytics-client';

export const generateNewSecret = async (): Promise<string> => {
	const analyticsClient = new AnalyticsClient();
	try {
		const newSecret = await invoke('generateNewSecret') as string;
		return newSecret;
	} catch (e) {
		console.error('Failed to get new secret', e);

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.TrackEvent,
			AnalyticsTrackEventsEnum.GenerateNewSecretErrorConnectJenkinsServerName,
			{
				source: AnalyticsScreenEventsEnum.ConnectJenkinsServerScreenName
			}
		);

		return '';
	}
};
