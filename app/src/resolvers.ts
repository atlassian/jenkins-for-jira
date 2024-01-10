import Resolver from '@forge/resolver';
import { internalMetrics } from '@forge/metrics';
import { webTrigger } from '@forge/api';
import { connectJenkinsServer } from './storage/connect-jenkins-server';
import { JenkinsServer } from './common/types';
import { getAllJenkinsServers } from './storage/get-all-jenkins-servers';
import { disconnectJenkinsServer } from './storage/disconnect-jenkins-server';
import { getJenkinsServerWithSecret } from './storage/get-jenkins-server-with-secret';
import { updateJenkinsServer } from './storage/update-jenkins-server';
import { deleteBuilds } from './jira-client/delete-builds';
import { deleteDeployments } from './jira-client/delete-deployments';
import { adminPermissionCheck } from './check-permissions';
import { metricResolverEmitter } from './common/metric-names';
import { generateNewSecret } from './storage/generate-new-secret';
import { FetchAppDataProps, fetchAppData } from './utils/fetch-app-data';
import { fetchFeatureFlag } from './config/feature-flags';

const resolver = new Resolver();

resolver.define('fetchJenkinsEventHandlerUrl', async (req) => {
	await adminPermissionCheck(req);
	internalMetrics.counter(metricResolverEmitter.fetchJenkinsEventHandlerUrl).incr();
	return {
		url: await webTrigger.getUrl('jenkins-webtrigger')
	};
});

resolver.define('connectJenkinsServer', async (req) => {
	await adminPermissionCheck(req);
	const payload = req.payload as JenkinsServer;
	internalMetrics.counter(metricResolverEmitter.connectJenkinsServer).incr();
	return connectJenkinsServer(payload);
});

resolver.define('updateJenkinsServer', async (req) => {
	await adminPermissionCheck(req);
	const payload = req.payload as JenkinsServer;
	internalMetrics.counter(metricResolverEmitter.updateJenkinsServer).incr();
	return updateJenkinsServer(payload);
});

resolver.define('getAllJenkinsServers', async (req) => {
	await adminPermissionCheck(req);
	internalMetrics.counter(metricResolverEmitter.getAllJenkinsServers).incr();
	return getAllJenkinsServers();
});

resolver.define('getJenkinsServerWithSecret', async (req) => {
	await adminPermissionCheck(req);
	const jenkinsServerUuid = req.payload.uuid as string;
	internalMetrics.counter(metricResolverEmitter.getJenkinsServerWithSecret).incr();
	return getJenkinsServerWithSecret(jenkinsServerUuid);
});

resolver.define('disconnectJenkinsServer', async (req) => {
	await adminPermissionCheck(req);
	const { cloudId } = req.context;
	const jenkinsServerUuid = req.payload.uuid;
	internalMetrics.counter(metricResolverEmitter.disconnectJenkinsServer).incr();

	return Promise.all([
		disconnectJenkinsServer(jenkinsServerUuid),
		deleteBuilds(cloudId, jenkinsServerUuid),
		deleteDeployments(cloudId, jenkinsServerUuid)
	]);
});

resolver.define('generateNewSecret', async (req) => {
	await adminPermissionCheck(req);
	internalMetrics.counter(metricResolverEmitter.generateNewSecretForServer).incr();
	return generateNewSecret();
});

resolver.define('fetchFeatureFlagFromBackend', async (req) => {
	const { cloudId } = req.context;
	const { featureFlag } = req.payload;
	const featureFlagState = await fetchFeatureFlag(featureFlag, cloudId);
	return featureFlagState;
});

resolver.define('fetchCloudId', async (req): Promise<string> => {
	await adminPermissionCheck(req);
	return req.context.cloudId;
});

resolver.define('fetchAppData', async (req): Promise<FetchAppDataProps> => {
	await adminPermissionCheck(req);
	internalMetrics.counter(metricResolverEmitter.generateNewSecretForServer).incr();
	return fetchAppData(req);
});

export default resolver.getDefinitions();
