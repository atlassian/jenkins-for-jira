import { invoke } from '@forge/bridge';

const fetchCloudId = async (): Promise<string> => {
	const response: string = await invoke('fetchCloudId');
	return response;
};

export {
	fetchCloudId
};
