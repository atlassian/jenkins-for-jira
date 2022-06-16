import { storage } from '@forge/api';
import { SECRET_STORAGE_KEY_PREFIX } from './constants';
import { NoJenkinsServerError } from '../common/error';

export const getJenkinsServerSecret = async (jenkinsServerUuid: string): Promise<string> => {
	try {
		const secret = await storage.getSecret(`${SECRET_STORAGE_KEY_PREFIX}${jenkinsServerUuid}`);
		if (!secret) {
			throw new NoJenkinsServerError(`Couldn't find secret for Jenkins server ${jenkinsServerUuid}`);
		}
		return secret;
	} catch (error) {
		console.error(`Failed to fetch secret for Jenkins server for uuid ${jenkinsServerUuid}`, error);
		throw error;
	}
};
