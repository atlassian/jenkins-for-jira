const server = 'jenkins-for-jira.forge.server';

export const metricResolverEmitter = {
	fetchJenkinsEventHandlerUrl: `${server}.fetchServer.emitted`,
	connectJenkinsServer: `${server}.createServer.emitted`,
	updateJenkinsServer: `${server}.updateServer.emitted`,
	getAllJenkinsServers: `${server}.getAllServers.emitted`,
	getJenkinsServerWithSecret: `${server}.getServer.emitted`,
	disconnectJenkinsServer: `${server}.disconnectServer.emitted`
};

export const metricSuccess = {
	resetJenkinsRequest: `${server}.success.reset-jenkins-request`,
	resetJenkinsServerInvocation: `${server}.error.reset-jenkins-server-invocation`,
	deleteBuildsAndDeployments: `${server}.error.delete-builds-and-deployments`,
	connectJenkinsServer: `${server}.success.connect-jenkins-server`,
	disconnectJenkinsServer: `${server}.success.disconnect-jenkins-server`,
	getAllJenkinsServer: `${server}.success.get-all-jenkins-server`,
	getJenkinsServerWithSecret: `${server}.success.get-jenkins-server-with-secret`,
	updateJenkinsServer: `${server}.error.udpate-jenkins-server`
};
