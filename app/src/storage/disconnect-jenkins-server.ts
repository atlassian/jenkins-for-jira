import { storage } from '@forge/api';
import { internalMetrics } from '@forge/metrics';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServerStorageError } from '../common/error';
import { Logger } from '../config/logger';
import { sendAnalytics } from '../analytics/analytics-client';
import { AnalyticsTrackEventActionSubjectsEnum, AnalyticsTrackEventActionsEnum } from '../analytics/analytics-events';
import { metricFailedRequests, metricSuccessfulRequests } from '../common/metric-names';

export const disconnectJenkinsServer = async (uuid: string, cloudId: string, accountId: string): Promise<boolean> => {
	const logger = Logger.getInstance('disconnectJenkinsServer');

	try {
		const deleteJenkinsServerPromise = await storage.delete(`${SERVER_STORAGE_KEY_PREFIX}${uuid}`);
		const deleteSecretPromise = await storage.deleteSecret(`${SECRET_STORAGE_KEY_PREFIX}${uuid}`);
		await Promise.all([deleteJenkinsServerPromise, deleteSecretPromise]);
		logger.info('Jenkins server successfully disconnected!', { uuid });
		internalMetrics.counter(metricSuccessfulRequests.disconnectJenkinsServer).incr();
		await sendDisconnectAnalytics(cloudId, accountId);
		return true;
	} catch (error) {
		logger.error('Failed to delete jenkins server configuration', { error });
		internalMetrics.counter(metricFailedRequests.disconnectJenkinsServerError).incr();
		throw new JenkinsServerStorageError('Failed to delete jenkins server configuration');
	}
};

const sendDisconnectAnalytics = async (cloudId: string, accountId: string) => {
	const eventPayload = {
		action: AnalyticsTrackEventActionsEnum.DisconnectedServer,
		actionSubject: AnalyticsTrackEventActionSubjectsEnum.User
	};

	await sendAnalytics(cloudId, eventPayload, accountId);
};
