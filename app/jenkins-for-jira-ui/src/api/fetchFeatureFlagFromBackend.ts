import { invoke } from '@forge/bridge';

export const fetchFeatureFlagFromBackend = async (featureFlag: string): Promise<boolean> => {
	return invoke('fetchFeatureFlagFromBackend', { featureFlag });
};
