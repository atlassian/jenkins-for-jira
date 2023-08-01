import { storage } from '@forge/api';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServerStorageError } from '../common/error';
import { Logger } from '../config/logger';

export const disconnectJenkinsServer = async (uuid: string): Promise<boolean> => {
	const logName = 'disconnectJenkinsServer';
	const eventType = 'jenkinsServerRemovedEvent';
	const logger = Logger.getInstance();

	try {
		const deleteJenkinsServerPromise = await storage.delete(`${SERVER_STORAGE_KEY_PREFIX}${uuid}`);
		const deleteSecretPromise = await storage.deleteSecret(`${SECRET_STORAGE_KEY_PREFIX}${uuid}`);
		await Promise.all([deleteJenkinsServerPromise, deleteSecretPromise]);

		logger.logInfo(
			logName,
			{
				eventType,
				data:
					{
						uuid,
						message: 'Jenkins server successfully disconnected!'
					}
			}
		);

		return true;
	} catch (error) {
		logger.logError(
			logName,
			{
				eventType,
				errorMsg: 'Failed to delete jenkins server configuration',
				error
			}
		);

		throw new JenkinsServerStorageError('Failed to delete jenkins server configuration');
	}
};
