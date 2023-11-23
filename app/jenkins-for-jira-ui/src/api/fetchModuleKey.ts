import { invoke } from '@forge/bridge';

const fetchModuleKey = async (): Promise<string> => {
	const moduleKey: string = await invoke('fetchModuleKey');
	console.log('do i have it? ', moduleKey);
	return moduleKey;
};

export {
	fetchModuleKey
};
