const server = 'jenkins-for-jira.forge.server';

export const metricError = {
    notJiraAdminError: `${server}.error.not-jira-admin`,
    jenkinsAppError: `${server}.error.jenkins-app-error`,
    unexpectedWebTriggerError: `${server}.error.upexpected-webtrigger-error`,
    resetJenkinsRequestNoUuidError: `${server}.error.reset-jenkins-request-no-uuid`,
    unsupportedResetJenkinsRequestError: `${server}.error.reset-jenkins-request-unsupported-request`,
    unexpectedResetJenkinsRequestError: `${server}.error.reset-jenkins-request-unexpected-request`,
    resetJenkinsServerInvocationError: `${server}.error.reset-jenkins-server-invocation-error`,
    deleteBuildsAndDeploymentsError: `${server}.error.delete-builds-and-deployments-error`,
    connectJenkinsServerError: `${server}.error.connect-jenkins--server-error`,
    disconnectJenkinsServerError: `${server}.error.disconnect-jenkins-server-error`,
    getAllJenkinsServerError: `${server}.error.get-all-jenkins-server-error`,
    getJenkinsServerWithSecretError: `${server}.error.get-jenkins-server-with-secret-error`,
    updateJenkinsServerError: `${server}.error.udpate-jenkins-server-error`,
    updateJenkinsServerStateError: `${server}.error.udpate-jenkins-server-state-error`
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

export const metricResolverEmitter = {
    fetchJenkinsEventHandlerUrl: `${server}.fetchServer.emitted`,
    connectJenkinsServer: `${server}.createServer.emitted`,
    updateJenkinsServer: `${server}.updateServer.emitted`,
    getAllJenkinsServers: `${server}.getAllServers.emitted`,
    getJenkinsServerWithSecret: `${server}.getServer.emitted`,
    disconnectJenkinsServer: `${server}.disconnectServer.emitted`
};
