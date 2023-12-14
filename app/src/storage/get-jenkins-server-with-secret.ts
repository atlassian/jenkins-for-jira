import { storage } from '@forge/api';
import { getJenkinsServerSecret } from './get-jenkins-server-secret';
import { SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServer } from '../common/types';
import { NoJenkinsServerError } from '../common/error';
import { Logger } from '../config/logger';

async function getJenkinsServer(uuid: string, logger?: Logger): Promise<JenkinsServer> {
	const jenkinsServer: JenkinsServer = await storage.get(
		`${SERVER_STORAGE_KEY_PREFIX}${uuid}`
	);

	if (!jenkinsServer) {
		const errorMsg = `No Jenkins Server found for UUID ${uuid}`;
		logger?.error(errorMsg);
		throw new NoJenkinsServerError(errorMsg);
	}
	return jenkinsServer;
}

const getJenkinsServerWithSecret = async (jenkinsServerUuid: string): Promise<JenkinsServer> => {
	const logger = Logger.getInstance('getJenkinsServerWithSecret');

	try {
		const jenkinsServer: JenkinsServer = await storage.get(`${SERVER_STORAGE_KEY_PREFIX}${jenkinsServerUuid}`);

		if (!jenkinsServer) {
			const errorMsg = `Couldn't find Jenkins server ${jenkinsServerUuid}`;
			logger.error(errorMsg);
			throw new NoJenkinsServerError(errorMsg);
		}

		const secret = await getJenkinsServerSecret(jenkinsServerUuid);

		const blah = await getJenkinsServer('04cf9667-87b7-46c3-beac-0b0962dc9827', logger);
		const jenkinsEvent = {
			ipAddress: '10.10.1.123',
			autoBuildEnabled: true,
			autoBuildRegex: '',
			autoDeploymentsEnabled: false,
			autoDeploymentsRegex: ''
		};
		jenkinsServer.pluginConfig = {
			ipAddress: '10.10.1.123',
			autoBuildEnabled: jenkinsEvent.autoBuildEnabled,
			autoBuildRegex: jenkinsEvent.autoBuildRegex,
			autoDeploymentsEnabled: jenkinsEvent.autoDeploymentsEnabled,
			autoDeploymentsRegex: jenkinsEvent.autoDeploymentsRegex,
			lastUpdatedOn: new Date()
		};

		// 04cf9667-87b7-46c3-beac-0b0962dc9827
		console.log('about to add data...');

		const result = await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${'04cf9667-87b7-46c3-beac-0b0962dc9827'}`, blah);
		console.log('SUCCESS: ', result);
		return {
			...jenkinsServer,
			secret
		};
	} catch (error) {
		const errorMsg = `Failed to fetch Jenkins server for uuid ${jenkinsServerUuid}`;
		logger.error(errorMsg);
		throw new NoJenkinsServerError(errorMsg);
	}
};

export {
	getJenkinsServerWithSecret
};
