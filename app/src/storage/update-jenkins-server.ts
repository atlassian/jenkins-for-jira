import { storage } from '@forge/api';
import { JenkinsServer } from '../common/types';
import { getJenkinsServerWithSecret } from './get-jenkins-server-with-secret';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { Logger } from '../config/logger';
import { JenkinsServerStorageError } from '../common/error';

const updateJenkinsServer = async (jenkinsServer: JenkinsServer) => {
	const eventType = 'updateJenkinsServerEvent';
	const logger = Logger.getInstance('updateJenkinsServer');

	try {
		// Retrieve latest Jenkins Server in case new pipeline events have occurred since loading page
		const { uuid } = jenkinsServer;
		const upToDateJenkinsServer = await getJenkinsServerWithSecret(uuid);
		const updatedJenkinsServer = {
			...jenkinsServer,
			pipelines: upToDateJenkinsServer.pipelines
		};
		await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${updatedJenkinsServer.uuid}`, updatedJenkinsServer);
		await storage.setSecret(`${SECRET_STORAGE_KEY_PREFIX}${uuid}`, updatedJenkinsServer.secret);

		logger.logInfo(
			{
				eventType,
				data:
					{
						uuid,
						message: 'Jenkins server configuration updated successfully!'
					}
			}
		);
	} catch (error) {
		logger.logError(
			{
				eventType,
				errorMsg: 'Failed to update Jenkins server',
				error
			}
		);

		throw new JenkinsServerStorageError('Failed to update Jenkins server configuration');
	}
};

export {
	updateJenkinsServer
};
