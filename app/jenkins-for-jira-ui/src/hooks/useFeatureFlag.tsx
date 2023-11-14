import { useFlags } from 'launchdarkly-react-client-sdk';

export type FeatureFlagValue = string | boolean | number;

export enum FeatureFlags {
	RENOVATED_JENKINS_FOR_JIRA_CONFIG_FLOW = 'renovated_jenkins_for_jira_config_flow'
}

export const useFeatureFlag = <TFeatureFlagValue extends FeatureFlagValue>(
	flag: FeatureFlags,
	defaultValue?: TFeatureFlagValue
): TFeatureFlagValue => {
	const flags = useFlags();

	const defaultValues = {
		[FeatureFlags.RENOVATED_JENKINS_FOR_JIRA_CONFIG_FLOW]: defaultValue !== undefined ? defaultValue : false
		// Add more flags here
	} as Record<FeatureFlags, TFeatureFlagValue>;

	return (flags[flag] ?? defaultValues[flag]);
};
