import { invoke } from '@forge/bridge';
import { JenkinsServer } from '../../../src/common/types';

const getAllJenkinsServers = async (): Promise<JenkinsServer[]> => {
	const jenkinsServers = await invoke('getAllJenkinsServers') as JenkinsServer[];
	// TODO: Need error checking before returning
	return jenkinsServers;
};

export {
	getAllJenkinsServers
};
