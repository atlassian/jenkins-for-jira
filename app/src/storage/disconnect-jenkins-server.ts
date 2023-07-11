import { internalMetrics } from '@forge/metrics';
import { storage } from '@forge/api';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServerStorageError } from '../common/error';
import { log } from '../analytics-logger';
import { metricSuccess } from '../common/metric-names';

export const disconnectJenkinsServer = async (uuid: string): Promise<boolean> => {
	try {
		const deleteJenkinsServerPromise = await storage.delete(`${SERVER_STORAGE_KEY_PREFIX}${uuid}`);
		const deleteSecretPromise = await storage.deleteSecret(`${SECRET_STORAGE_KEY_PREFIX}${uuid}`);
		await Promise.all([deleteJenkinsServerPromise, deleteSecretPromise]);
		log({ eventType: 'jenkinsServerRemoved', data: { uuid } });
		internalMetrics.counter(metricSuccess.disconnectJenkinsServer).incr();
		return true;
	} catch (error) {
		console.error('Failed to delete jenkins server configuration', error);
		throw new JenkinsServerStorageError('Failed to delete jenkins server configuration');
	}
};
