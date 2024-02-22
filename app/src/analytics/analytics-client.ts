import crypto from 'crypto';
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

interface Event {
	userId?: string;
	anonymousId: string;
	event: string;
	properties: {
		action: string;
		actionSubject: string;
		attributes: Record<string, string>;
		env: string;
		eventType: string;
		origin: string;
		product: string;
		source: string;
		tenantId: string;
		tenantIdType: string;
		userIdType?: string;
	};
	type: string;
	timestamp: string;
	messageId: string;
  }

interface Payload {
	batch: Event[];
	timestamp: string;
	sentAt: string;
  }

interface Options {
	method: string;
	body: string;
	headers: {
		'Content-Type': string;
	};
  }

  const environments = {
	LOCAL: 'local',
	DEV: 'dev',
	STAGING: 'stg',
	PROD: 'prod'
  };

  const TRACK_EVENT_TYPE = 'track';
  const PRODUCT = 'jenkinsForJira';
  const ORIGIN = 'server';
  const TENANT_ID_TYPE = 'cloudId';

// eslint-disable-next-line max-len
export const sendAnalytics = async (cloudId: string, eventPayload: EventPayload, accountId?: string, anonymousId?: string): Promise<void> => {
	console.info('SEND ANALYTICS');
	sendEvent(cloudId, eventPayload, accountId, anonymousId)
		.then(() => console.info('Analytics event processed'))
		.catch((e) => console.error({ e }, 'Failed to send analytics event'));
};

// TODO BETTER NAMING AND PULL FROM ENVVARS TO HIDE PATH
const getAnalyticsEnvironmentUrl = () => {
	return 'a';
};

// eslint-disable-next-line max-len,@typescript-eslint/no-unused-vars
const sendEvent = async (cloudId: string, eventPayload: EventPayload, accountId?: string, anonymousId?: string): Promise<void> => {
	const url = getAnalyticsEnvironmentUrl();
	const trackEvent: Event = createTrackEvent(cloudId, eventPayload, accountId, anonymousId);
	const timestamp = new Date().toISOString();
	const payload: Payload = {
		batch: [trackEvent],
		timestamp,
		sentAt: timestamp
	};

	const options: Options = {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json'
		}
	};

	console.info('Sending Analytics');
	await fetch(url, options);
};

// eslint-disable-next-line max-len
export const createTrackEvent = (cloudId: string, eventPayload: EventPayload, accountId?: string, anonymousId?: string): Event => {
	const timestamp = new Date().toISOString();
	const {
		eventName, attributes, actionSubject, action
	} = eventPayload;

	return {
		userId: accountId,
		anonymousId: createAnonymousId(anonymousId || 'default'),
		event: `${actionSubject} ${action}`,
		properties: {
			source: eventName,
			action,
			actionSubject,
			attributes: attributes || {},
			product: PRODUCT,
			env: isProductionEnv() ? environments.PROD : environments.STAGING,
			eventType: TRACK_EVENT_TYPE,
			userIdType: accountId ? 'atlassianAccount' : undefined, // TODO DO BETTER
			tenantIdType: TENANT_ID_TYPE,
			tenantId: cloudId,
			origin: ORIGIN
		},
		type: TRACK_EVENT_TYPE,
		timestamp,
		messageId: createMessageId()
	};
};

export const isProductionEnv = (): boolean => {
	const env = (process.env.NODE_ENV || '').toLowerCase();
	return ['production', 'prod'].includes(env);
};

export const createAnonymousId = (input: string): string => {
	const hash = crypto.createHash('sha256').update(input).digest('hex');
	return hash;
};

export const createMessageId = () => {
	const now = new Date().valueOf();
	const random = Math.floor(Math.random() * 1000000);
	return `j4j-be-${now}-${random}`;
};
