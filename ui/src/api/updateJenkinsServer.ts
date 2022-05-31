import { invoke } from '@forge/bridge';
import { JenkinsServer } from 'jenkins-for-jira-common/types';

const updateJenkinsServer = async (jenkinsServer: JenkinsServer) => {
	try {
		await invoke('updateJenkinsServer', { ...jenkinsServer });
	} catch (err) {
		console.log('api/updateJenkinsServer ', err);
	}
};

export {
	updateJenkinsServer
};
