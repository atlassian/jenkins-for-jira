import { invoke } from '@forge/bridge';

const fetchUserPerms = async (): Promise<boolean> => {
	const userIsAdmin: boolean = await invoke('fetchUserPerms');
	return userIsAdmin;
};

export {
	fetchUserPerms
};
