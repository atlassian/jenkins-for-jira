import crypto from 'crypto';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

interface AnalyticsAttributes {
	[key: string]: any;
}

interface Metadata {
	nodeVersion: string;
	version: string;
}

interface Context {
	library: any
}

interface EventPayload {
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
		tenantId: string;
		tenantIdType: string;
		source: string;
		userIdType?: string;
	};
	type: string;
	timestamp: string;
	_metadata: Metadata;
	context: Context;
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
	console.info('Analytics Request');

	sendEvent(cloudId, eventPayload, accountId, anonymousId)
		.then(() => console.info('Analytics event processed'))
		.catch((e) => console.error({ e }, 'Failed to send analytics event'));
};

const getAnalyticsEnvironmentUrl = () => {
	if (isProductionEnv()) {
        return process.env.ANALYTICS_URL;
	}
	return process.env.ANALYTICS_STAGE_URL;
};

// eslint-disable-next-line max-len,@typescript-eslint/no-unused-vars
const sendEvent = async (cloudId: string, eventPayload: EventPayload, accountId?: string, anonymousId?: string): Promise<void> => {
	const url = getAnalyticsEnvironmentUrl();
	if (!url) {
		console.warn('No analytics path found.');
		return;
	}
	const trackEvent: Event = createTrackEvent(cloudId, eventPayload, accountId, anonymousId);
	console.log(trackEvent);
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
		attributes, actionSubject, action
	} = eventPayload;
	return {
		userId: accountId,
		anonymousId: createAnonymousId(anonymousId || 'default'),
		event: `${actionSubject} ${action}`,
		properties: {
			action,
			actionSubject,
			attributes: attributes || {},
			product: PRODUCT,
			env: isProductionEnv() ? environments.PROD : environments.STAGING,
			eventType: TRACK_EVENT_TYPE,
			userIdType: accountId ? 'atlassianAccount' : undefined,
			tenantIdType: TENANT_ID_TYPE,
			tenantId: cloudId,
			source: 'server',
			origin: ORIGIN
		},
		type: TRACK_EVENT_TYPE,
		timestamp,
		_metadata: {
			nodeVersion: process.versions.node,
			version: '0'
		},
		context: {
			library: {
				name: 'analytics-node'
			}
		},
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
	return `j4j-server-${uuidv4()}`;
};
