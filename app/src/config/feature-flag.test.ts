import { fetch as forgeFetch } from '@forge/api';
import { fetchFeatureFlag, LAUNCH_DARKLY_URL, launchDarklyService } from './feature-flags';
import envVars from './env';

jest.mock('@forge/api', () => ({
    fetch: jest.fn(),
}));

const fetch = forgeFetch as jest.Mock;

describe('fetchFeatureFlag', () => {
    afterEach(() => {
        fetch.mockClear();
    });

    it('should return true when flag is on', async () => {
        const mockFeatureFlagData = {
            name: 'test-flag',
            kind: 'boolean',
            environments: {
                test: {
                    on: true,
                    archived: false,
                }
            },
        };

        fetch.mockResolvedValueOnce({
            status: 200,
            json: async () => mockFeatureFlagData,
        });

        const result = await fetchFeatureFlag('test-flag', 'test');
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('test-flag'), expect.anything());
        expect(result).toEqual(true);
    });

    it('should return false when flag is off', async () => {
        const mockFeatureFlagData = {
            name: 'test-flag',
            kind: 'boolean',
            environments: {
                test: {
                    on: false,
                    archived: false,
                }
            },
        };

        fetch.mockResolvedValueOnce({
            status: 200,
            json: async () => mockFeatureFlagData,
        });

        const result = await fetchFeatureFlag('test-flag', 'test');
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('test-flag'), expect.anything());
        expect(result).toEqual(false);
    });

    it('handles fetch errors', async () => {
        fetch.mockRejectedValueOnce(new Error('Fetch error'));
        await expect(fetchFeatureFlag('test-flag', 'test')).rejects.toThrow('Fetch error');
    });
});

describe('launchDarklyService', () => {
    it('returns the correct product app name', () => {
        expect(launchDarklyService.getProductAppName()).toEqual(envVars.LAUNCHDARKLY_APP_NAME);
    });

    it('returns the correct product app page URL', () => {
        expect(launchDarklyService.getProductAppPageUrl())
            .toEqual(`https://app.launchdarkly.com/${envVars.LAUNCHDARKLY_APP_NAME}`);
    });

    it('returns the correct feature flag page URL for testing environment', () => {
        const featureFlagKey = 'yourFeatureFlagKey';
        const environment = 'testing';

        const expectedUrl =
            `${LAUNCH_DARKLY_URL}/${envVars.LAUNCHDARKLY_APP_NAME}/${environment}/features/${featureFlagKey}`;
        expect(launchDarklyService.getFeatureFlagPageUrl(featureFlagKey, environment)).toEqual(expectedUrl);
    });

    it('returns the correct feature flag page URL for development environment', () => {
        const featureFlagKey = 'yourFeatureFlagKey';
        const environment = 'development';

        const expectedUrl =
            `${LAUNCH_DARKLY_URL}/${envVars.LAUNCHDARKLY_APP_NAME}/${environment}/features/${featureFlagKey}`;
        expect(launchDarklyService.getFeatureFlagPageUrl(featureFlagKey, environment)).toEqual(expectedUrl);
    });

    it('returns the correct feature flag page URL for staging environment', () => {
        const featureFlagKey = 'yourFeatureFlagKey';
        const environment = 'staging';

        const expectedUrl =
            `${LAUNCH_DARKLY_URL}/${envVars.LAUNCHDARKLY_APP_NAME}/${environment}/features/${featureFlagKey}`;
        expect(launchDarklyService.getFeatureFlagPageUrl(featureFlagKey, environment)).toEqual(expectedUrl);
    });

    it('returns the correct feature flag page URL for production environment', () => {
        const featureFlagKey = 'yourFeatureFlagKey';
        const environment = 'production';

        const expectedUrl =
            `${LAUNCH_DARKLY_URL}/${envVars.LAUNCHDARKLY_APP_NAME}/${environment}/features/${featureFlagKey}`;
        expect(launchDarklyService.getFeatureFlagPageUrl(featureFlagKey, environment)).toEqual(expectedUrl);
    });
});
