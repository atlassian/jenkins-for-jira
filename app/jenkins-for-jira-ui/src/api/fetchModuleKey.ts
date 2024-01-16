import { invoke } from '@forge/bridge';

const fetchModuleKey = async (): Promise<string> => {
	const moduleKey: string = await invoke('fetchModuleKey');
	return moduleKey;
};

export {
	fetchModuleKey
};
