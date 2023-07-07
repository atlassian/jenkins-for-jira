import { invoke } from '@forge/bridge';

export const disconnectJenkinsServer = async (uuid: string): Promise<boolean> => {
	console.log('testing a change');
	return invoke('disconnectJenkinsServer', { uuid });
};
