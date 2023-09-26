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

export interface FeatureFlag {
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

export default FeatureFlag;

export const LAUNCH_DARKLY_URL = `https://app.launchdarkly.com`;
const BASE_URL = `${LAUNCH_DARKLY_URL}/api/v2/flags/${envVars.LAUNCHDARKLY_APP_NAME}`;

const baseHeaders = {
    headers: {
        Authorization: 'api-c63c330c-dfac-424d-b42d-3d342b9aea27'
    }
};

const logger = Logger.getInstance('getAllJenkinsServers');

async function getFeatureFlag(featureFlagKey: string): Promise<FeatureFlag> {
    const eventType = 'retrievingFeatureFlag';
    const errorMsg = `fetching feature flag unexpected status`;

    try {
        const response = await fetch(`${BASE_URL}/${featureFlagKey}`, { ...baseHeaders });

        if (response.status === 200) {
            return await response.json();
        }

        logger.logWarn({ eventType: `${eventType}Error`, errorMsg });
        throw new Error(errorMsg);
    } catch (error) {
        logger.logWarn({ eventType: `${eventType}Error`, errorMsg, error });
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

export const fetchFeatureFlag =
    async (featureFlagKey: string, env: Environment): Promise<boolean | null> => {
    try {
        const environment: Environment = env?.toLowerCase() as Environment;
        const featureFlag = await launchDarklyService.getFeatureFlag(featureFlagKey);
        const envData = featureFlag.environments[environment];
        console.log('envData', envData);
        return envData?.on || false;
    } catch (error) {
        logger.logError({
            eventType: 'fetchFeatureFlagError',
            errorMsg: 'Error fetching feature flag:',
            error
        });
        throw error;
    }
};
