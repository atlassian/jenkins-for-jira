import fetch from 'node-fetch';
import {
    sendAnalytics,
    createAnonymousId,
    createTrackEvent,
    createMessageId,
    isProductionEnv
} from './analytics-client';

jest.mock('node-fetch', () => jest.fn());

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

describe('sendAnalytics', () => {
    it('should send analytics', async () => {
        process.env.NODE_ENV = 'prod';
        process.env.ANALYTICS_URL = 'epic-url';
        const eventPayload = { eventName: 'event', action: 'action', actionSubject: 'subject' };
        await sendAnalytics('cloudId', eventPayload, 'accountId', 'anonymousId');
        expect(fetch).toHaveBeenCalled();
    });
});

describe('createTrackEvent', () => {
    it('should create an event', () => {
        const eventPayload = { eventName: 'event', action: 'action', actionSubject: 'subject' };
        const event = createTrackEvent('cloudId', eventPayload, 'accountId', 'anonymousId');
        expect(event).toHaveProperty('userId', 'accountId');
        expect(event).toHaveProperty('anonymousId');
        expect(event).toHaveProperty('event');
        expect(event).toHaveProperty('properties');
        expect(event).toHaveProperty('type', 'track');
        expect(event).toHaveProperty('timestamp');
        expect(event).toHaveProperty('messageId');
    });
});

describe('createMessageId', () => {
    it('should create a messageId', () => {
        const messageId = createMessageId();
        expect(messageId).toBeDefined();
        // This regex validates a UUID
        const uuidRegex = /^j4j-server-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        expect(messageId).toMatch(uuidRegex);
    });
});
