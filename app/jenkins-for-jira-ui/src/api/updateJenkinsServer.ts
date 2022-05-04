import { invoke } from '@forge/bridge';
import { JenkinsServer } from '../../../src/common/types';

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
