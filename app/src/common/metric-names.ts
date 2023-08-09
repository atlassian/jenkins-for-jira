const server = 'jenkins-for-jira.forge.server';

export const metricResolverEmitter = {
	fetchJenkinsEventHandlerUrl: `${server}.fetchServer.emitted`,
	connectJenkinsServer: `${server}.connectServer.emitted`,
	updateJenkinsServer: `${server}.updateServer.emitted`,
	getAllJenkinsServers: `${server}.getAllServers.emitted`,
	getJenkinsServerWithSecret: `${server}.getWithSecretServer.emitted`,
	disconnectJenkinsServer: `${server}.disconnectServer.emitted`,
	generateNewSecretForServer: `${server}.generateNewSecret.emitted`,
};
