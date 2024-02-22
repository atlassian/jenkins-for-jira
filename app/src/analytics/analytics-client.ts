import crypto from 'crypto';
// import { fetch } from '@forge/api';
import fetch from 'node-fetch';

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
	STAGING = 'stg',
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
	// const analyticsClient = await getAnalyticsClient();
	// const {
	// 	eventName, attributes, actionSubject, action
	// } = eventPayload;

	// if (!analyticsClient) {
	// 	// if (!analyticsClient || !isProductionEnv()) {
	// 	console.warn('Analytics sendEvent skipped:
	// 	@atlassiansox/analytics-node-client module not found or environment not production.');
	// 	return;
	// }

    console.warn('analyticsClient found');
    console.warn('analyticsClient found');
    console.warn('analyticsClient found');

	// const accountDetails = getAccountDetails(accountId, anonymousId);

	// todo call nv type to return prod or this from envvars
	const url = 'https://as.staging.atl-paas.net/api/v1/batch';
    //
	// const payload = {
	// 	batch: [
	// 		{
	// 			userId: '70121:3e65d00a-afa5-465f-b7b4-b92665c1dc92',
	// 			anonymousId: undefined,
	// 			event: 'User action Connected new Jenkins server',
	// 			properties: [Object],
	// 			timestamp: '2024-02-21T04:13:44.130Z',
	// 			context: [Object],
	// 			type: 'track',
	// 			_metadata: [Object],
	// 			messageId: 'node-b207547505dbc2307c66fca5d7c195e6-7445b312-c229-4e85-83a4-b43c4e1671a6'
	// 		}
	// 	],
	// 	timestamp: '2024-02-21T04:13:44.132Z',
	// 	sentAt: '2024-02-21T04:13:44.132Z'
	// };

    console.warn('HERE GOES FRESH STYLE');

	const timestamp = new Date().toISOString();

	const d = {
		batch: [
			{
				userId: '70121:3e65d00a-afa5-465f-b7b4-b92665c1dc92',
				event: 'User Action Disconnected Jenkins Server',
				properties: {
					source: 'DisconnectedServer',
					action: 'Disconnected Jenkins Server',
					actionSubject: 'User Action',
					attributes: {},
					product: 'jenkinsForJira',
					env: 'stg',
					eventType: 'track',
					userIdType: 'atlassianAccount',
					tenantIdType: 'cloudId',
					tenantId: '03ce73f8-41fc-492e-9983-83ab6d8ebd32',
					origin: 'server'
				},
				timestamp,
				type: 'track',
				messageId: 'node-1f20e23f793c98e711461e82dc555521-2d8ce23f-cdd6-48be-8935-cd32c36cd6f7'
			}
		],
		timestamp,
		sentAt: timestamp
	};

    // how to gen id
    // message.messageId = `node-${md5(JSON.stringify(message))}-${uuid()}`
	const options = {
		method: 'POST',
		body: JSON.stringify(d),
		headers: {
			'Content-Type': 'application/json'
			// 'Authorization': 'Basic ' + new Buffer('BLANK' + ':' + '').toString('base64'),
			// 'User-Agent': 'analytics-node/6.2.0'
		}
	};

	console.warn('XXXXPRE FETCHRE GOES FRESH STYLE');

	// eslint-disable-next-line @typescript-eslint/no-shadow
	async function fetchData(url: string, options: any) {
		try {
			const res = await fetch(url, options);
			const json = await res.json();
			console.info('wow');
			console.info('wow');
			console.info(json);
		} catch (err) {
			console.error(`error:${err}`);
		}
	}

	await fetchData(url, options);
	//
    // console.warn('PRE FETCHRE GOES FRESH STYLE');
	// fetch(url, options)
	// 	.then((res) => res.json())
	// 	.then((json) => {
	// 		console.info('wow');
	// 		console.info(json);
	// 	})
	// 	.catch((err) => console.error(`error:${err}`));

	// try {
	//     await analyticsClient.sendTrackEvent({
	//         ...accountDetails,
	//         tenantIdType: 'cloudId',
	//         tenantId: cloudId,
	//         trackEvent: {
	//             source: eventName,
	//             action: action || 'unknown',
	//             actionSubject: actionSubject || eventName,
	//             attributes: {
	//                 ...attributes
	//             }
	//         }
	//     });
	// } catch (e) {
	//     console.error(e);
	// }
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
			userId: accountId
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
