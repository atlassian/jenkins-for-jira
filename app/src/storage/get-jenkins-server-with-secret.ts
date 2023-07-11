import { internalMetrics } from '@forge/metrics';
import { storage } from '@forge/api';
import { getJenkinsServerSecret } from './get-jenkins-server-secret';
import { SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServer } from '../common/types';
import { NoJenkinsServerError } from '../common/error';
import { metricError, metricSuccess } from '../common/metric-names';

const getJenkinsServerWithSecret = async (jenkinsServerUuid: string): Promise<JenkinsServer> => {
	try {
		const jenkinsServer: JenkinsServer = await storage.get(`${SERVER_STORAGE_KEY_PREFIX}${jenkinsServerUuid}`);

		if (!jenkinsServer) {
			throw new NoJenkinsServerError(`Couldn't find Jenkins server ${jenkinsServerUuid}`);
		}

		const secret = await getJenkinsServerSecret(jenkinsServerUuid);

		internalMetrics.counter(metricSuccess.getJenkinsServerWithSecret).incr();

		return {
			...jenkinsServer,
			secret
		};
	} catch (error) {
		console.error(`Failed to fetch Jenkins server for uuid ${jenkinsServerUuid} `, error);
		internalMetrics.counter(metricError.getJenkinsServerWithSecretError).incr();
		throw error;
	}
};

export {
	getJenkinsServerWithSecret
};
