const server = 'jenkins-for-jira.forge.server';

export const metricResolverEmitter = {
	fetchJenkinsEventHandlerUrl: `${server}.fetchServer.emitted`,
	connectJenkinsServer: `${server}.createServer.emitted`,
	updateJenkinsServer: `${server}.updateServer.emitted`,
	getAllJenkinsServers: `${server}.getAllServers.emitted`,
	getJenkinsServerWithSecret: `${server}.getServer.emitted`,
	disconnectJenkinsServer: `${server}.disconnectServer.emitted`
};
