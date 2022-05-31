import { invoke } from '@forge/bridge';
import { JenkinsServer } from 'jenkins-for-jira-common/types';

const getJenkinsServerWithSecret = async (jenkinsServerUuid: string): Promise<JenkinsServer> => {
	const jenkinsServer = await invoke(
		'getJenkinsServerWithSecret', { uuid: jenkinsServerUuid }
	) as JenkinsServer;
	// TODO: Need error checking before returning
	return jenkinsServer;
};

export {
	getJenkinsServerWithSecret
};
