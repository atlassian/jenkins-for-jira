import { invoke } from '@forge/bridge';
import { JenkinsServer } from 'jenkins-for-jira-common/types';

const createJenkinsServer = async (jenkinsServer: JenkinsServer): Promise<JenkinsServer> => {
	await invoke('connectJenkinsServer', { ...jenkinsServer });
	// TODO: Need error checking before returning
	return jenkinsServer;
};

export {
	createJenkinsServer
};
