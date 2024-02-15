import { storage } from '@forge/api';
import { internalMetrics } from '@forge/metrics';
import { getJenkinsServerSecret } from './get-jenkins-server-secret';
import { SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServer } from '../common/types';
import { NoJenkinsServerError } from '../common/error';
import { Logger } from '../config/logger';
import { metricFailedRequests, metricSuccessfulRequests } from '../common/metric-names';

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
		internalMetrics.counter(metricSuccessfulRequests.getJenkinsServerWithSecret).incr();

		return {
			...jenkinsServer,
			secret
		};
	} catch (error) {
		const errorMsg = `Failed to fetch Jenkins server for uuid ${jenkinsServerUuid}`;
		logger.error(errorMsg);
		internalMetrics.counter(metricFailedRequests.getJenkinsServerWithSecretError).incr();
		throw new NoJenkinsServerError(errorMsg);
	}
};

export {
	getJenkinsServerWithSecret
};
