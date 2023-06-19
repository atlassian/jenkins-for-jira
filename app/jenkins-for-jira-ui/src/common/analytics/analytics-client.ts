// eslint-disable-next-line import/no-extraneous-dependencies
// import { optionalRequire } from 'optional-require/dist';
import { view } from '@forge/bridge';

// const {
// 	envType, tenantType, userType
// } = optionalRequire('@atlassiansox/analytics-web-client');

import AnalyticsWebClient, {
	envType, tenantType, userType
} from '@atlassiansox/analytics-web-client';

// const PROD_ENV = envType.PROD;

interface AnalyticsAttributes {
	source?: string,
	action?: string,
	actionSubject?: string,
	[key: string]: any;
}

interface BaseAttributes {
	userId: string,
	userIdType: string,
	tenantIdType: string,
	tenantId: string
}

export class AnalyticsClient {
	private readonly analyticsClient: any;

	private analyticsWebClient: AnalyticsWebClient | null;

	constructor() {
		this.analyticsClient = AnalyticsWebClient;
		// this.analyticsClient = optionalRequire('@atlassiansox/analytics-node-client', true) || {};
		this.analyticsWebClient = null;
	}

	sendAnalytics(eventType: string, eventName: string, attributes?: AnalyticsAttributes) {
		// if (!this.analyticsClient || PROD_ENV) {
		if (!this.analyticsClient) {
			console.log('no client');
			return;
		}

		if (!this.analyticsWebClient) {
			// Values defined by DataPortal.
			// Do not change their values as it will affect our metrics logs and dashboards.
			this.analyticsWebClient = new AnalyticsWebClient({
				env: envType.PROD, // This needs to be 'prod' as we're using prod Jira instances.
				product: 'jenkinsForJira'
			}, {
				useLegacyUrl: true
			});

			this.getContext();
		}

		const baseAttributes: BaseAttributes = {
			userId: 'anonymousId',
			userIdType: 'atlassianAccount',
			tenantIdType: 'cloudId',
			tenantId: 'NONE'
		};

		AnalyticsClient.sendEvent(
			eventType,
			eventName,
			this.getEventData(eventType, eventName, baseAttributes, attributes)
		);
	}

	getEventData(
		eventType: string,
		eventName: string,
		baseAttributes: BaseAttributes,
		attributes?: AnalyticsAttributes
	): Promise<void> {
		switch (eventType) {
			case 'screen':
				console.log('sending SCREEN analytics...');
				return (this.analyticsWebClient as any)?.sendScreenEvent?.({
					name: eventName,
					attributes: {
						...baseAttributes
					}
				});
			case 'ui':
				console.log('sending UI analytics...');
				return (this.analyticsWebClient as any)?.sendUIEvent?.({
					source: attributes?.source || '',
					action: attributes?.action || eventName,
					actionSubject: attributes?.actionSubject || eventName,
					attributes: {
						...baseAttributes
					}
				});
			case 'track':
				console.log('sending TRACK analytics...');
				return (this.analyticsWebClient as any)?.sendTrackEvent?.({
					source: attributes?.source || '',
					action: attributes?.action || eventName,
					actionSubject: attributes?.actionSubject || eventName,
					attributes: {
						...baseAttributes
					}
				});
			case 'operational':
				console.log('sending OPERATIONAL analytics...');
				return (this.analyticsWebClient as any)?.sendOperationalEvent?.({
					source: attributes?.source || '',
					action: attributes?.action || eventName,
					actionSubject: attributes?.actionSubject || eventName,
					attributes: {
						...baseAttributes
					}
				});
			default:
				return Promise.resolve();
		}
	}

	static sendEvent(eventType: string, name: string, promise: Promise<any>) {
		promise?.catch((error: any) => {
			console.log('Need a bloody logger', error);
		});
	}

	getContext() {
		view.getContext().then((ctx) => {
			const { cloudId, accountId } = ctx as any;
			(this.analyticsWebClient as any)?.setTenantInfo?.(tenantType.CLOUD_ID, cloudId);
			(this.analyticsWebClient as any)?.setUserInfo?.(userType.ATLASSIAN_ACCOUNT, accountId);
		});
	}
}
