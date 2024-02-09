import { isProductionEnv, createAnonymousId, getAccountDetails, sendAnalytics } from './analytics-client';

jest.mock('./analytics-client', () => ({
    ...jest.requireActual('./analytics-client'),
    getAnalyticsClient: jest.fn().mockReturnValue({ cats: 'ssss' })
}));

jest.mock('@atlassiansox/analytics-node-client');
describe('isProductionEnv', () => {
    test('should return true for production environment', () => {
        process.env.NODE_ENV = 'prod';
        expect(isProductionEnv()).toBe(true);
    });
    test('should return true for production environment', () => {
        process.env.NODE_ENV = 'somethingelse';
        expect(isProductionEnv()).toBe(false);
    });
});
describe('createAnonymousId', () => {
    test('should create a hashed anonymousId', () => {
        const result = createAnonymousId('testInput');
        expect(result).toBe('620ae460798e1f4cab44c44f3085620284f0960a276bbc3f0bd416449df14dbe');
    });
});
describe('getAccountDetails', () => {
    test('should return anonymousId when no accountId', () => {
        const result = getAccountDetails('', 'ipAddress');
        expect(result).toEqual({
            anonymousId: '095cf3ff5683bd7c1db48018af7d0bee79205bcafb47a09b97f9faf0bcee4800'
        });
    });
    test('should return accountId object', () => {
        const result = getAccountDetails('testAccount');
        expect(result).toEqual({
            userIdType: 'atlassianAccount',
            userId: 'testAccount',
        });
    });
});
