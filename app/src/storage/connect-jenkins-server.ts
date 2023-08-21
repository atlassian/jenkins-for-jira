import { storage } from '@forge/api';
import { JenkinsServer } from '../common/types';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServerStorageError } from '../common/error';
import { Logger } from '../config/logger';

const connectJenkinsServer = async (jenkinsServer: JenkinsServer): Promise<boolean> => {
	const eventType = 'connectJenkinsServerEvent';
	const logger = Logger.getInstance('connectJenkinsServer');

	try {
		const { secret } = jenkinsServer;
		delete jenkinsServer.secret;
		const { uuid } = jenkinsServer;
		await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${uuid}`, jenkinsServer);
		await storage.setSecret(`${SECRET_STORAGE_KEY_PREFIX}${uuid}`, secret);

		logger.logInfo(
			{
				eventType,
				data:
					{
						uuid,
						message: 'Jenkins server configuration saved successfully!'
					}
			}
		);

		return true;
	} catch (error) {
		logger.logError(
			{
				eventType,
				errorMsg: 'Failed to store Jenkins server configuration',
				error
			}
		);

		throw new JenkinsServerStorageError('Failed to store jenkins server configuration');
	}
};

export { connectJenkinsServer };
