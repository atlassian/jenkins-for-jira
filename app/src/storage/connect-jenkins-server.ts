import { internalMetrics } from '@forge/metrics';
import { storage } from '@forge/api';
import { log } from '../analytics-logger';
import { JenkinsServer } from '../common/types';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServerStorageError } from '../common/error';
import { metricSuccess } from '../common/metric-names';

const connectJenkinsServer = async (jenkinsServer: JenkinsServer): Promise<boolean> => {
	try {
		const { secret } = jenkinsServer;
		// eslint-disable-next-line no-param-reassign
		delete jenkinsServer.secret;
		await storage.set(`${SERVER_STORAGE_KEY_PREFIX}${jenkinsServer.uuid}`, jenkinsServer);
		await storage.setSecret(`${SECRET_STORAGE_KEY_PREFIX}${jenkinsServer.uuid}`, secret);

		console.log(`${jenkinsServer.name} jenkins server configuration saved successfully !`);
		log({ eventType: 'jenkinsServerCreated', data: { uuid: jenkinsServer.uuid } });

		internalMetrics.counter(metricSuccess.connectJenkinsServer).incr();

		return true;
	} catch (error) {
		console.error('Failed to store Jenkins server configuration', error);
		throw new JenkinsServerStorageError('Failed to store jenkins server configuration');
	}
};

export { connectJenkinsServer };
