import { useFlags } from 'launchdarkly-react-client-sdk';

export type FeatureFlagValue = string | boolean | number;

export enum FeatureFlags {
	SERVER_SECRET_GENERATION = 'server-secret-generation'
}

export const useFeatureFlag = <TFeatureFlagValue extends FeatureFlagValue>(
	flag: FeatureFlags,
	defaultValue?: TFeatureFlagValue
): TFeatureFlagValue => {
	const flags = useFlags();
	console.log('flags', flags);

	const defaultValues = {
		[FeatureFlags.SERVER_SECRET_GENERATION]: defaultValue !== undefined ? defaultValue : false
		// Add more flags here
	} as Record<FeatureFlags, TFeatureFlagValue>;

	return (flags[flag] ?? defaultValues[flag]);
};
