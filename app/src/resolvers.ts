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
import { isAdmin } from './check-permissions';

const resolver = new Resolver();

const checkPermissions = async (accountId: string) => {
	const admin = await isAdmin(accountId);
	if (!admin) {
		throw new Error('Only Jira administrators can perform this operation.');
	}
};

resolver.define('fetchJenkinsEventHandlerUrl', async (req) => {
	await checkPermissions(req.context.accountId);
	return {
		url: await webTrigger.getUrl('jenkins-webtrigger')
	};
});

resolver.define('connectJenkinsServer', async (req) => {
	await checkPermissions(req.context.accountId);
	const payload = req.payload as JenkinsServer;
	return connectJenkinsServer(payload);
});

resolver.define('updateJenkinsServer', async (req) => {
	await checkPermissions(req.context.accountId);
	const payload = req.payload as JenkinsServer;
	return updateJenkinsServer(payload);
});

resolver.define('getAllJenkinsServers', async (req) => {
	await checkPermissions(req.context.accountId);
	return getAllJenkinsServers();
});

resolver.define('getJenkinsServerWithSecret', async (req) => {
	await checkPermissions(req.context.accountId);
	const jenkinsServerUuid = req.payload.uuid as string;
	return getJenkinsServerWithSecret(jenkinsServerUuid);
});

resolver.define('disconnectJenkinsServer', async (req) => {
	await checkPermissions(req.context.accountId);
	const { cloudId } = req.context;
	const jenkinsServerUuid = req.payload.uuid;
	return Promise.all([
		disconnectJenkinsServer(jenkinsServerUuid),
		deleteBuilds(cloudId, jenkinsServerUuid),
		deleteDeployments(cloudId, jenkinsServerUuid)
	]);
});

export default resolver.getDefinitions();
