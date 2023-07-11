import { internalMetrics } from '@forge/metrics';
import { storage } from '@forge/api';
import { JenkinsServer } from '../common/types';
import { getJenkinsServerWithSecret } from './get-jenkins-server-with-secret';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { log } from '../analytics-logger';
import { metricError, metricSuccess } from '../common/metric-names';

const updateJenkinsServer = async (jenkinsServer: JenkinsServer) => {
	try {
		// Retrieve latest Jenkins Server in case new pipeline events have occurred since loading page
		const upToDateJenkinsServer = await getJenkinsServerWithSecret(jenkinsServer.uuid);
		const updatedJenkinsServer = {
			...jenkinsServer,
			pipelines: upToDateJenkinsServer.pipelines
		};
		await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${updatedJenkinsServer.uuid}`, updatedJenkinsServer);
		await storage.setSecret(`${SECRET_STORAGE_KEY_PREFIX}${jenkinsServer.uuid}`, updatedJenkinsServer.secret);
		log({ eventType: 'jenkinsServerUpdated', data: { uuid: jenkinsServer.uuid } });
		internalMetrics.counter(metricSuccess.updateJenkinsServer).incr();
	} catch (err) {
		console.log(`Failed to update jenkins server ${JSON.stringify(jenkinsServer)} `, err);
		internalMetrics.counter(metricError.updateJenkinsServerError).incr();
		throw err;
	}
};

export {
	updateJenkinsServer
};
