import { storage } from '@forge/api';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServerStorageError } from '../common/error';
import { Logger } from '../config/logger';
import { sendAnalytics } from "../analytics/analytics-client";
import { AnalyticsTrackEventsEnum } from "../analytics/analytics-events";

export const disconnectJenkinsServer = async (uuid: string, cloudId: string, accountId: string): Promise<boolean> => {
	const logger = Logger.getInstance('disconnectJenkinsServer');

	try {
		const deleteJenkinsServerPromise = await storage.delete(`${SERVER_STORAGE_KEY_PREFIX}${uuid}`);
		const deleteSecretPromise = await storage.deleteSecret(`${SECRET_STORAGE_KEY_PREFIX}${uuid}`);
		await Promise.all([deleteJenkinsServerPromise, deleteSecretPromise]);
		logger.info('Jenkins server successfully disconnected!', { uuid });
		await sendDisconnectAnalytics(cloudId, accountId);

		return true;
	} catch (error) {
		logger.error('Failed to delete jenkins server configuration', { error });
		throw new JenkinsServerStorageError('Failed to delete jenkins server configuration');
	}
};

const sendDisconnectAnalytics = async (cloudId: string, accountId: string) => {
	const eventPayload = {
		eventName: AnalyticsTrackEventsEnum.DisconnectedServerName,
		action: 'Disconnected Jenkins Server',
		actionSubject: 'REQUEST'
	};

	await sendAnalytics(cloudId, eventPayload, accountId);
};
