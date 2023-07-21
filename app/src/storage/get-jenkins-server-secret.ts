import { storage } from '@forge/api';
import { SECRET_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServerStorageError, NoJenkinsServerError } from '../common/error';
import { log } from '../config/logger';

export const getJenkinsServerSecret = async (jenkinsServerUuid: string): Promise<string> => {
	const logName = 'getJenkinsServerSecret';
	const eventType = 'getJenkinsServerSecretEvent';

	try {
		const secret = await storage.getSecret(`${SECRET_STORAGE_KEY_PREFIX}${jenkinsServerUuid}`);

		if (!secret) {
			log(
				logName,
				'error',
				{
					eventType,
					errorMsg: `Couldn't find secret for Jenkins server ${jenkinsServerUuid}`,
				}
			);

			throw new NoJenkinsServerError(`Couldn't find secret for Jenkins server ${jenkinsServerUuid}`);
		}
		return secret;
	} catch (error) {
		log(
			logName,
			'error',
			{
				eventType,
				errorMsg: `Failed to fetch secret for Jenkins server for uuid ${jenkinsServerUuid}`,
				error
			}
		);

		throw new JenkinsServerStorageError('Failed to get Jenkins server configuration');
	}
};
