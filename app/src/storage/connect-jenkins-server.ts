import { storage } from '@forge/api';
import { JenkinsServer } from '../common/types';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServerStorageError } from '../common/error';
import { Logger } from '../config/logger';
import { sendAnalytics } from '../analytics/analytics-client';
import { AnalyticsTrackEventsEnum } from '../analytics/analytics-events';

const connectJenkinsServer = async (jenkinsServer: JenkinsServer, cloudId: string, accountId: string): Promise<boolean> => {
	const logger = Logger.getInstance('connectJenkinsServer');

	try {
		const { secret } = jenkinsServer;
		delete jenkinsServer.secret;
		const { uuid } = jenkinsServer;
		await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${uuid}`, jenkinsServer);
		await storage.setSecret(`${SECRET_STORAGE_KEY_PREFIX}${uuid}`, secret);

		logger.info('Jenkins server configuration saved successfully!', { uuid });
		// TODO ANALYTICS HERE
		console.log('CONNECT ANALYTICS HERE!!!!');
		await sendConnectAnalytics(cloudId, accountId);
		return true;
	} catch (error) {
		logger.error('Failed to store Jenkins server configuration', { error });
		throw new JenkinsServerStorageError('Failed to store jenkins server configuration');
	}
};

const sendConnectAnalytics = async (cloudId: string, accountId: string) => {
	const eventPayload = {
		eventName: AnalyticsTrackEventsEnum.ConnectionCreatedName,
		action: 'Connected new Jenkins server',
		actionSubject: 'REQUEST'
	};

	await sendAnalytics(cloudId, eventPayload, accountId);
};

export { connectJenkinsServer };
