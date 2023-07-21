import { storage } from '@forge/api';
import { log } from '../config/logger';
import { JenkinsServer } from '../common/types';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServerStorageError } from '../common/error';

const connectJenkinsServer = async (jenkinsServer: JenkinsServer): Promise<boolean> => {
	const logName = 'connectJenkinsServer';
	const eventType = 'connectJenkinsServerEvent';

	try {
		const { secret } = jenkinsServer;
		delete jenkinsServer.secret;
		const { uuid } = jenkinsServer;
		await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${uuid}`, jenkinsServer);
		await storage.setSecret(`${SECRET_STORAGE_KEY_PREFIX}${uuid}`, secret);

		log(
			logName,
			'info',
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
		log(
			logName,
			'error',
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
