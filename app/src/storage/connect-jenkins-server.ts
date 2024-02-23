import { storage } from '@forge/api';
import { internalMetrics } from '@forge/metrics';
import { JenkinsServer } from '../common/types';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServerStorageError } from '../common/error';
import { Logger } from '../config/logger';
import { sendAnalytics } from '../analytics/analytics-client';
import { AnalyticsTrackEventActionSubjectsEnum, AnalyticsTrackEventActionsEnum } from '../analytics/analytics-events';
import { metricFailedRequests, metricSuccessfulRequests } from '../common/metric-names';

const connectJenkinsServer = async (
	jenkinsServer: JenkinsServer,
	cloudId: string,
	accountId: string
): Promise<boolean> => {
	const logger = Logger.getInstance('connectJenkinsServer');

	try {
		const { secret } = jenkinsServer;
		delete jenkinsServer.secret;
		const { uuid } = jenkinsServer;
		await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${uuid}`, jenkinsServer);
		await storage.setSecret(`${SECRET_STORAGE_KEY_PREFIX}${uuid}`, secret);

		logger.info('Jenkins server configuration saved successfully!', { uuid });
		internalMetrics.counter(metricSuccessfulRequests.connectJenkinsServer).incr();
		await sendConnectAnalytics(cloudId, accountId);
		return true;
	} catch (error) {
		logger.error('Failed to store Jenkins server configuration', { error });
		internalMetrics.counter(metricFailedRequests.connectJenkinsServerError).incr();
		throw new JenkinsServerStorageError('Failed to store jenkins server configuration');
	}
};

const sendConnectAnalytics = async (cloudId: string, accountId: string) => {
	const eventPayload = {
		action: AnalyticsTrackEventActionsEnum.ConnectionCreated,
		actionSubject: AnalyticsTrackEventActionSubjectsEnum.User
	};

	await sendAnalytics(cloudId, eventPayload, accountId);
};

export { connectJenkinsServer };
