import { fetch } from '@forge/api';
import { Logger } from './logger';
import envVars, { Environment } from './env';

export const FEATURE_FLAG_ON_VARIATION = 0;
export const FEATURE_FLAG_OFF_VARIATION = 1;

interface Variation {
    _id: string;
    value: boolean;
}

interface EnvironmentData {
    on: boolean;
    archived: boolean;
    salt: string;
    sel: string;
    lastModified: number;
    version: number;
    targets: any[];
    contextTargets: any[];
    rules: any[];
    fallthrough: any;
    offVariation: number;
    prerequisites: any[];
    _site: any;
    _environmentName: string;
    trackEvents: boolean;
    trackEventsFallthrough: boolean;
    _summary: any;
}

interface FeatureFlag {
    name: string;
    kind: string;
    description: string;
    key: string;
    _version: number;
    creationDate: number;
    includeInSnippet: boolean;
    clientSideAvailability: {
        usingMobileKey: boolean;
        usingEnvironmentId: boolean;
    };
    variations?: Variation[];
    variationJsonSchema: null | any;
    temporary: boolean;
    tags: string[];
    _links: {
        parent: {
            href: string;
            type: string;
        };
        self: {
            href: string;
            type: string;
        };
    };
    maintainerId: string;
    _maintainer: {
        _links: {
            self: any;
        };
        _id: string;
        firstName: string;
        lastName: string;
        role: string;
        email: string;
    };
    goalIds: string[];
    experiments: {
        baselineIdx: number;
        items: any[];
    };
    customProperties: any;
    archived: boolean;
    defaults: {
        onVariation: number;
        offVariation: number;
    };
    environments: {
        development: EnvironmentData;
        production: EnvironmentData;
        staging: EnvironmentData;
        test: EnvironmentData;
    };
}

export const LAUNCH_DARKLY_URL = `https://app.launchdarkly.com`;
const BASE_URL = `${LAUNCH_DARKLY_URL}/api/v2/flags/${envVars.LAUNCHDARKLY_APP_NAME}`;

const baseHeaders = {
    headers: {
        Authorization: envVars.LAUNCHDARKLY_API_KEY
    }
};

const logger = Logger.getInstance('featureFlags');

async function getFeatureFlag(featureFlagKey: string): Promise<FeatureFlag> {
    const REQUEST_TIMEOUT_MILLISECONDS = 2000;
    const controller = new AbortController();
    const { signal } = controller;
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MILLISECONDS);

    try {
        const response = await fetch(`${BASE_URL}/${featureFlagKey}`, { ...baseHeaders, signal });

        if (response.status === 200) {
            logger.info(`Successfully retrieved ${featureFlagKey}`);
            return await response.json();
        }

        throw new Error('fetching feature flag unexpected status');
    } catch (error) {
        // @ts-ignore
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        logger.error('Failed to fetch feature flag', { error });
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

export const launchDarklyService = {
    getProductAppName: () => envVars.LAUNCHDARKLY_APP_NAME,
    getProductAppPageUrl: () => `${LAUNCH_DARKLY_URL}/${envVars.LAUNCHDARKLY_APP_NAME}`,
    getFeatureFlag,
    getFeatureFlagPageUrl: (featureFlagKey: string, environment: string) =>
        `${LAUNCH_DARKLY_URL}/${envVars.LAUNCHDARKLY_APP_NAME}/${environment}/features/${featureFlagKey}`
};

async function evaluateFeatureFlagDefault(
	featureFlagKey: string,
	{ fallthrough: { rollout: { variations } } }: EnvironmentData,
	cloudId?: string
): Promise<boolean> {
	try {
		const totalWeight = variations?.reduce((sum: any, variation: { weight: any }) => sum + variation.weight, 0);
		const hash = Array.from(cloudId || '').reduce((acc, char) => acc - char.charCodeAt(0) ** 5, 0);
		const normalizedHash = (Math.abs(hash) % totalWeight) + 1;
		let currentWeight = 0;

		const isVariationOn = variations.some((variation: { weight: number; variation: number }) => {
			currentWeight += variation.weight;
			return normalizedHash <= currentWeight && variation.variation === 0;
		});

		return isVariationOn;
	} catch (error) {
		console.error('Failed to evaluate feature flag manually:', error);
		return true; // TODO TOGLE THIS BACK!!!
	}
}

export const fetchFeatureFlag = async (featureFlagKey: string, cloudId?: string): Promise<boolean | null> => {
	try {
		// custom env var as Forge overrides NODE_ENV in every environment with production
		// left NODE_ENV as a fallback as it's needed for tests and pipelines
		const environment: Environment = envVars.JENKINS_ENV as Environment || process.env.NODE_ENV;
		const featureFlag = await launchDarklyService.getFeatureFlag(featureFlagKey);
		const envData = featureFlag.environments[environment];

		if (cloudId && envData.targets) {
			const { targets } = envData;
			// Values for individual user targeting is true for Cloud ID
			const individualTargetIsOn = targets[FEATURE_FLAG_ON_VARIATION]?.values || [];
			// Values for individual user targeting is false for Cloud ID
			const individualTargetIsOff = targets[FEATURE_FLAG_OFF_VARIATION]?.values || [];

			if (individualTargetIsOn.includes(cloudId)) return true;
			if (individualTargetIsOff.includes(cloudId)) return false;
		}

		const { variation: fallThroughVariation } = envData.fallthrough;

		if (fallThroughVariation === FEATURE_FLAG_ON_VARIATION) return true;
		if (fallThroughVariation === FEATURE_FLAG_OFF_VARIATION) return false;

		const targetedInRollout = await evaluateFeatureFlagDefault(featureFlagKey, envData, cloudId);
		return targetedInRollout || false;
	} catch (error) {
		logger.error('Fetch feature flag error', { error });
		return false;
	}
};
