import { invoke } from '@forge/bridge';

export const disconnectJenkinsServer = async (uuid: string): Promise<boolean> => {
	return invoke('disconnectJenkinsServer', { uuid });
};
