import { fetch } from '@forge/api';
import { Logger } from './logger';
import envVars, { Environment } from './env';

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
    variations: Variation[];
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
    try {
        const response = await fetch(`${BASE_URL}/${featureFlagKey}`, { ...baseHeaders });

        if (response.status === 200) {
            logger.info(`Successfully retrieved ${featureFlagKey}`);
            return await response.json();
        }

        throw new Error('fetching feature flag unexpected status');
    } catch (error) {
        logger.error('Failed to fetch feature flag', { error });
        throw error;
    }
}

export const launchDarklyService = {
    getProductAppName: () => envVars.LAUNCHDARKLY_APP_NAME,
    getProductAppPageUrl: () => `${LAUNCH_DARKLY_URL}/${envVars.LAUNCHDARKLY_APP_NAME}`,
    getFeatureFlag,
    getFeatureFlagPageUrl: (featureFlagKey: string, environment: string) =>
        `${LAUNCH_DARKLY_URL}/${envVars.LAUNCHDARKLY_APP_NAME}/${environment}/features/${featureFlagKey}`
};

export const fetchFeatureFlag = async (featureFlagKey: string, cloudId?: string): Promise<boolean | null> => {
    try {
        // custom env var as Forge overrides NODE_ENV in every environment with production
        // left NODE_ENV as a fallback as it's needed for tests and pipelines
        const environment: Environment = envVars.JENKINS_ENV as Environment || process.env.NODE_ENV;
        const featureFlag = await launchDarklyService.getFeatureFlag(featureFlagKey);
        const envData = featureFlag.environments[environment];

        if (cloudId && envData.targets) {
            const values = envData.targets.flatMap((target) => target.values);
            if (values.includes(cloudId)) {
                // If the cloudId is in any of the values within the targets, set the value to true
                return true;
            }
        }

        // If the cloudId is not in the targets or no cloudId is provided, use the "on" value
        return envData.on || false;
    } catch (error) {
        logger.error('Fetch feature flag error', { error });
        throw new Error(`Failed to retrieve feature flag: ${error}`);
    }
};
