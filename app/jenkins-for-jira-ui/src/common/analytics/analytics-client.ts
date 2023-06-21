import { view } from '@forge/bridge';

interface AnalyticsAttributes {
	[key: string]: any;
}

interface BaseAttributes {
	userId: string;
	userIdType: string;
	tenantIdType: string;
	tenantId: string;
}

enum EnvType {
	LOCAL = 'local',
	DEV = 'dev',
	STAGING = 'staging',
	PROD = 'prod'
}

export class AnalyticsClient {
	private analyticsWebClient: any;

	constructor() {
		this.analyticsWebClient = null;
	}

	static async sendEvent(eventType: string, name: string, promise: Promise<void>) {
		promise?.catch((error: any) => {
			console.error('Failed to send analytics event', error);
		});
	}

	async sendAnalytics(
		eventType: string,
		eventName: string,
		attributes?: AnalyticsAttributes
	): Promise<void> {
		const isAnalyticsPackageInstalled = await AnalyticsClient.checkIfAnalyticsPackageInstalled();

		if (!isAnalyticsPackageInstalled || (process.env.NODE_ENV as EnvType) === EnvType.PROD) {
			console.warn('Analytics Web Client module not found or not prod. Ignoring the dependency.');
			return;
		}

		if (!this.analyticsWebClient) {
			const { default: AnalyticsWebClient, tenantType, userType } = isAnalyticsPackageInstalled;

			if (!AnalyticsWebClient || !userType || !tenantType) {
				console.warn('Failed to initialize Analytics Web Client. Ignoring analytics event.');
				return;
			}

			this.analyticsWebClient = new AnalyticsWebClient(
				{
					env: EnvType.PROD,
					product: 'jenkinsForJira'
				},
				{
					useLegacyUrl: true
				}
			);

			this.getContext(userType, tenantType);
		}

		const baseAttributes: BaseAttributes = {
			userId: 'anonymousId',
			userIdType: this.analyticsWebClient?.userType?.ATLASSIAN_ACCOUNT,
			tenantIdType: this.analyticsWebClient?.tenantType?.CLOUD_ID,
			tenantId: 'NONE'
		};

		await AnalyticsClient.sendEvent(
			eventType,
			eventName,
			this.getEventData(eventType, eventName, baseAttributes, attributes)
		);
	}

	private static async checkIfAnalyticsPackageInstalled(): Promise<any> {
		try {
			const analyticsWebClient = await import('@atlassiansox/analytics-web-client');
			return analyticsWebClient;
		} catch (error) {
			return false;
		}
	}

	private async getEventData(
		eventType: string,
		eventName: string,
		baseAttributes: BaseAttributes,
		attributes?: AnalyticsAttributes
	): Promise<void> {
		switch (eventType) {
			case 'screen':
				return (this.analyticsWebClient as any)?.sendScreenEvent?.({
					name: eventName,
					attributes: {
						...baseAttributes,
						...attributes
					}
				});
			case 'ui':
				return (this.analyticsWebClient as any)?.sendUIEvent?.({
					source: attributes?.source || '',
					action: attributes?.action || eventName,
					actionSubject: attributes?.actionSubject || eventName,
					attributes: {
						...baseAttributes,
						...attributes
					}
				});
			case 'track':
				return (this.analyticsWebClient as any)?.sendTrackEvent?.({
					source: attributes?.source || '',
					action: attributes?.action || eventName,
					actionSubject: attributes?.actionSubject || eventName,
					attributes: {
						...baseAttributes,
						...attributes
					}
				});
			case 'operational':
				return (this.analyticsWebClient as any)?.sendOperationalEvent?.({
					source: attributes?.source || '',
					action: attributes?.action || eventName,
					actionSubject: attributes?.actionSubject || eventName,
					attributes: {
						...baseAttributes,
						...attributes
					}
				});
			default:
				return Promise.resolve();
		}
	}

	private getContext(userType?: any, tenantType?: any): void {
		view.getContext().then((ctx) => {
			const { cloudId, accountId } = ctx as any;
			this.analyticsWebClient?.setTenantInfo?.(tenantType.CLOUD_ID, cloudId);
			this.analyticsWebClient?.setUserInfo?.(userType.ATLASSIAN_ACCOUNT, accountId);
		});
	}
}
