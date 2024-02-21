import crypto from 'crypto';
// import { fetch } from '@forge/api';

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
    console.info('SEND ANALYTICS');
    sendEvent(cloudId, eventPayload, accountId, anonymousId)
        .then(() => console.info('Analytics event processed'))
        .catch((e) => console.error({ e }, 'Failed to send analytics event'));
};

// eslint-disable-next-line max-len,@typescript-eslint/no-unused-vars
const sendEvent = async (cloudId: string, eventPayload: EventPayload, accountId?: string, anonymousId?: string): Promise<void> => {
    const analyticsClient = await getAnalyticsClient();
    const {
        eventName, attributes, actionSubject, action
    } = eventPayload;

    if (!analyticsClient) {
    // if (!analyticsClient || !isProductionEnv()) {
        console.warn('Analytics sendEvent skipped: @atlassiansox/analytics-node-client module not found or environment not production.');
        return;
    }

    console.warn('analyticsClient found');

    const accountDetails = getAccountDetails(accountId, anonymousId);

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
    //
    // const body = {
    //     jiraHost: 'https://jkay.jira-dev.com',
    //     eventPayload: {
    //         eventType: 'screen',
    //         eventProps: {
    //             name: 'banananas',
    //             fooProp: 'bar'
    //         },
    //         eventAttributes: {
    //             attr1: 'value1'
    //         }
    //     }
    // };
    //
    //
    // const resulthc = await fetch(
    //     'https://jenkins-for-jira-analytics.dev.services.atlassian.com/openapi.json'
    // );
    //
    // console.log('resulthc');
    // console.log('resulthc');
    // console.log(resulthc);
    //
    // const result = await fetch(
	// 	'https://jenkins-for-jira-analytics.dev.services.atlassian.com/analytics', {
    //         method: 'POST',
    //         body: JSON.stringify(body),
    //         headers: { 'Content-Type': 'application/json' }
    //     }
    // );
    //
    // const { status } = result;
    // console.log('GOT ME A STATUS');
    // console.log(status);
    // console.log(result);
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
            env: EnvType.STAGING,
            product: 'jenkinsForJira'
        });

        return analyticsNodeClient;
    } catch (error) {
        return null;
    }
};
