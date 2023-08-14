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
		console.log('Here is the backend secret: ', newSecret);
		return newSecret;
	} catch (error) {
		console.error('Failed to get new secret', error);

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
