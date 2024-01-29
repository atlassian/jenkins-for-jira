import { fetch as forgeFetch } from '@forge/api';
import { FEATURE_FLAG_OFF_VARIATION, FEATURE_FLAG_ON_VARIATION, fetchFeatureFlag } from './feature-flags';

jest.mock('@forge/api', () => ({
	fetch: jest.fn()
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
					fallthrough: {
						variation: FEATURE_FLAG_ON_VARIATION
					}
				}
			}
		};

		fetch.mockResolvedValueOnce({
			status: 200,
			json: async () => mockFeatureFlagData
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
					fallthrough: {
						variation: FEATURE_FLAG_OFF_VARIATION
					}
				}
			}
		};

		fetch.mockResolvedValueOnce({
			status: 200,
			json: async () => mockFeatureFlagData
		});

		const result = await fetchFeatureFlag('test-flag', 'test');
		expect(fetch).toHaveBeenCalledWith(expect.stringContaining('test-flag'), expect.anything());
		expect(result).toEqual(false);
	});

	it('should return true when flag is on for the specified cloudId', async () => {
		const mockFeatureFlagData = {
			name: 'test-flag',
			kind: 'boolean',
			environments: {
				test: {
					on: true,
					archived: false,
					targets: [
						{
							values: [
								'test-cloudId'
							],
							variation: 0,
							contextKind: 'user'
						},
						{
							values: [
								'12313423435324534'
							],
							variation: 1,
							contextKind: 'user'
						}
					],
					fallthrough: {
						variation: FEATURE_FLAG_OFF_VARIATION
					}
				}
			}
		};

		fetch.mockResolvedValueOnce({
			status: 200,
			json: async () => mockFeatureFlagData
		});

		const result = await fetchFeatureFlag('test-flag', 'test-cloudId');
		expect(fetch).toHaveBeenCalledWith(expect.stringContaining('test-flag'), expect.anything());
		expect(result).toEqual(true);
	});

	it('should return false when flag is off for the specified cloudId', async () => {
		const mockFeatureFlagData = {
			name: 'test-flag',
			kind: 'boolean',
			environments: {
				test: {
					on: false,
					archived: false,
					targets: [
						{
							values: [
								'some-other-cloud-id'
							],
							variation: 0,
							contextKind: 'user'
						},
						{
							values: [
								'test-cloudId'
							],
							variation: 1,
							contextKind: 'user'
						}
					],
					fallthrough: {
						variation: FEATURE_FLAG_ON_VARIATION
					}
				}
			}
		};

		fetch.mockResolvedValueOnce({
			status: 200,
			json: async () => mockFeatureFlagData
		});

		const result = await fetchFeatureFlag('test-flag', 'test-cloudId');
		expect(fetch).toHaveBeenCalledWith(expect.stringContaining('test-flag'), expect.anything());
		expect(result).toEqual(false);
	});

	it('should return false when flag is off and cloudId is not in the targets', async () => {
		const mockFeatureFlagData = {
			name: 'test-flag',
			kind: 'boolean',
			environments: {
				test: {
					on: false,
					archived: false,
					targets: [
						{ values: ['other-cloudId'] }
					],
					fallthrough: {
						variation: FEATURE_FLAG_OFF_VARIATION
					}
				}
			}
		};

		fetch.mockResolvedValueOnce({
			status: 200,
			json: async () => mockFeatureFlagData
		});

		const result = await fetchFeatureFlag('test-flag', 'test-cloudId');
		expect(fetch).toHaveBeenCalledWith(expect.stringContaining('test-flag'), expect.anything());
		expect(result).toEqual(false);
	});

	it('handles fetch errors', async () => {
		fetch.mockRejectedValueOnce(new Error('Fetch error'));
		await expect(fetchFeatureFlag('test-flag', 'test')).rejects.toThrow('Fetch error');
	});
});
