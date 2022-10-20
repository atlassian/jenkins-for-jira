import Resolver from '@forge/resolver';
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

const resolver = new Resolver();

resolver.define('fetchJenkinsEventHandlerUrl', async (req) => {
	await adminPermissionCheck(req);
	return {
		url: await webTrigger.getUrl('jenkins-webtrigger')
	};
});

resolver.define('connectJenkinsServer', async (req) => {
	await adminPermissionCheck(req);
	const payload = req.payload as JenkinsServer;
	return connectJenkinsServer(payload);
});

resolver.define('updateJenkinsServer', async (req) => {
	await adminPermissionCheck(req);
	const payload = req.payload as JenkinsServer;
	return updateJenkinsServer(payload);
});

resolver.define('getAllJenkinsServers', async (req) => {
	await adminPermissionCheck(req);
	return getAllJenkinsServers();
});

resolver.define('getJenkinsServerWithSecret', async (req) => {
	await adminPermissionCheck(req);
	const jenkinsServerUuid = req.payload.uuid as string;
	return getJenkinsServerWithSecret(jenkinsServerUuid);
});

resolver.define('disconnectJenkinsServer', async (req) => {
	await adminPermissionCheck(req);
	const { cloudId } = req.context;
	const jenkinsServerUuid = req.payload.uuid;
	return Promise.all([
		disconnectJenkinsServer(jenkinsServerUuid),
		deleteBuilds(cloudId, jenkinsServerUuid),
		deleteDeployments(cloudId, jenkinsServerUuid)
	]);
});

export default resolver.getDefinitions();
