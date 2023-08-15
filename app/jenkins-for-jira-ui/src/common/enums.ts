import { useLDClient } from 'launchdarkly-react-client-sdk';

export enum FeatureFlags {
	GENERATE_SERVER_SECRET = 'server-secret-generation',
	SOME_RANDOM_FLAG = 'random-flag',
	TEST = 'test'
}

export function useIsLDReady(): boolean {
	const ldClient = useLDClient();

	return ldClient !== undefined;
}
