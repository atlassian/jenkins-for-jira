import { invoke } from '@forge/bridge';
import { JenkinsServer } from 'jenkins-for-jira-common/types';

const getAllJenkinsServers = async (): Promise<JenkinsServer[]> => {
	const jenkinsServers = await invoke('getAllJenkinsServers') as JenkinsServer[];
	// TODO: Need error checking before returning
	return jenkinsServers;
};

export {
	getAllJenkinsServers
};
