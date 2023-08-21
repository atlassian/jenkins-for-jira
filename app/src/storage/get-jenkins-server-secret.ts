import { storage } from '@forge/api';
import { SECRET_STORAGE_KEY_PREFIX } from './constants';
import { NoJenkinsServerError } from '../common/error';
import { Logger } from '../config/logger';

export const getJenkinsServerSecret = async (jenkinsServerUuid: string): Promise<string> => {
	const logger = Logger.getInstance('getAllJenkinsServers');
	const eventType = 'getJenkinsServerSecretEvent';

	try {
		const secret = await storage.getSecret(`${SECRET_STORAGE_KEY_PREFIX}${jenkinsServerUuid}`);
		if (!secret) {
			const errorMsg = `Couldn't find secret for Jenkins server for uuid ${jenkinsServerUuid}`;
			logger.logError({ eventType, errorMsg });
			throw new NoJenkinsServerError(errorMsg);
		}
		return secret;
	} catch (error) {
		const errorMsg = `Failed to fetch secret for Jenkins server for uuid ${jenkinsServerUuid}`;
		logger.logError({ eventType, errorMsg });
		throw new NoJenkinsServerError(errorMsg);
	}
};
