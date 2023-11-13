import { invoke } from '@forge/bridge';

export const fetchFeatureFlagFromBackend = async (featureFlag: string): Promise<boolean> => {
	const featureFlagStatus: boolean = await invoke('fetchFeatureFlagFromBackend', { featureFlag });
	console.log('featureFlagStatus: ', featureFlagStatus);
	return featureFlagStatus;
};
