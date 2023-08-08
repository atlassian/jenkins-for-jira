import * as ld from '@launchdarkly/node-server-sdk'; // Updated import
import { Logger } from './logger';
import { envVars } from './env';
import { createHashWithSharedSecret } from '../utils/encryption';

const logger = Logger.getInstance('feature-flags');

const ldClient = ld.init(envVars.LAUNCHDARKLY_KEY || '', {
	offline: !envVars.LAUNCHDARKLY_KEY,
});

export enum BooleanFlags {}

export enum StringFlags {}

export enum NumberFlags {}

const createLaunchdarklyUser = (key?: string): ld.LDUser => {
	if (!key) {
		return {
			key: 'global',
		};
	}

	return {
		key: createHashWithSharedSecret(key),
	};
};

const getLaunchDarklyValue = async <T = boolean | string | number>(
	flag: BooleanFlags | StringFlags | NumberFlags,
	defaultValue: T,
	key?: string
): Promise<T> => {
	try {
		await ldClient.waitForInitialization();
		const user = createLaunchdarklyUser(key);
		return await ldClient.variation(flag as unknown as string, user, defaultValue);
	} catch (error) {
		logger.logError({
			eventType: 'featureFlagEvent',
			data: flag,
			error,
			errorMsg: 'Error resolving value for feature flag',
		});
		return defaultValue;
	}
};

// Include jiraHost for any FF that needs to be rolled out in stages
export const booleanFlag = async (flag: BooleanFlags, key?: string): Promise<boolean> => {
	// Always use the default value as false to prevent issues
	const flagIsOff = await getLaunchDarklyValue(flag, false, key);
	return flagIsOff;
};

export const stringFlag = async <T = string>(
	flag: StringFlags,
	defaultValue: T,
	key?: string
): Promise<T> => getLaunchDarklyValue<T>(flag, defaultValue, key);

export const numberFlag = async (
	flag: NumberFlags,
	defaultValue: number,
	key?: string
): Promise<number> => getLaunchDarklyValue(flag, defaultValue, key);

export const onFlagChange = (
	flag: BooleanFlags | StringFlags | NumberFlags,
	listener: () => void
): void => {
	ldClient.on(`update:${flag}`, listener);
};
