import crypto from 'crypto';

interface AnalyticsAttributes {
    [key: string]: any;
}

interface EventPayload {
    eventName: string,
    action: string,
    actionSubject: string,
    attributes?: AnalyticsAttributes
}

enum EnvType {
    LOCAL = 'local',
    DEV = 'dev',
    STAGING = 'staging',
    PROD = 'prod'
}

// eslint-disable-next-line max-len
export const sendAnalytics = async (cloudId: string, eventPayload: EventPayload, accountId?: string, anonymousId?: string): Promise<void> => {
    sendEvent(cloudId, eventPayload, accountId, anonymousId)
        .then(() => console.info('Analytics event processed'))
        .catch((e) => console.error({ e }, 'Failed to send analytics event'));
};

// eslint-disable-next-line max-len
const sendEvent = async (cloudId: string, eventPayload: EventPayload, accountId?: string, anonymousId?: string): Promise<void> => {
    console.info('Analytics event starting');
    const analyticsClient = await getAnalyticsClient();
    const {
        eventName, attributes, actionSubject, action
    } = eventPayload;

    if (!analyticsClient) {
        console.warn('Analytics sendEvent skipped: @atlassiansox/analytics-node-client module not found or environment not production.');
        return;
    }

    const accountDetails = getAccountDetails(accountId, anonymousId);

    console.info('Analytics event tracking');
    await analyticsClient.sendTrackEvent({
        ...accountDetails,
        tenantIdType: 'cloudId',
        tenantId: cloudId,
        trackEvent: {
            source: eventName,
            action: action || 'unknown',
            actionSubject: actionSubject || eventName,
                attributes: {
                    ...attributes
                }
        }
    });
};

export const isProductionEnv = (): boolean => {
    const env = (process.env.NODE_ENV || '').toLowerCase();
    return ['production', 'prod'].includes(env);
};

export const getAccountDetails = (accountId?: string, anonymousId?: string) => {
    if (accountId) {
        return {
            userIdType: 'atlassianAccount',
            userId: accountId,
        };
    }
    const hashedAnonymousId = createAnonymousId(anonymousId || 'default');
    return { anonymousId: hashedAnonymousId };
};

export const createAnonymousId = (input: string): string => {
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    return hash;
};

export const getAnalyticsClient = async (): Promise<any> => {
    try {
        const { analyticsClient } = await import('@atlassiansox/analytics-node-client');

        const analyticsNodeClient = analyticsClient({
            env: EnvType.PROD,
            product: 'jenkinsForJira'
        });

        return analyticsNodeClient;
    } catch (error) {
        return null;
    }
};
