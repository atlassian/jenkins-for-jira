import { view } from '@forge/bridge';
import { EnvironmentEnum } from '../types';

interface AnalyticsAttributes {
	[key: string]: any;
}

interface UserType {
	ATLASSIAN_ACCOUNT: string,
	HASHED_EMAIL: string,
	TRELLO: string,
	OPSGENIE: string,
	HALP: string
}

interface TenantType {
	CLOUD_ID: string,
	HALP_TEAM_ID: string,
	NONE: string,
	OPSGENIE_CUSTOMER_ID: string,
	ORG_ID: string,
	TRELLO_WORKSPACE_ID: string
}

const isNotProductionEnv = (): boolean => {
	const env = (process.env.NODE_ENV || '').toLowerCase();
	return !['production', 'prod'].includes(env);
};

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

		if (!isAnalyticsPackageInstalled || isNotProductionEnv()) {
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
					env: EnvironmentEnum.PROD,
					product: 'jenkinsForJira'
				},
				{
					useLegacyUrl: true
				}
			);

			await this.getContext(userType, tenantType);
		}

		await AnalyticsClient.sendEvent(
			eventType,
			eventName,
			this.getEventData(
				eventType,
				eventName,
				this.analyticsWebClient?.siteUrl,
				attributes
			)
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
		siteUrl: string | undefined,
		attributes?: AnalyticsAttributes
	): Promise<void> {
		switch (eventType) {
			case 'screen':
				return (this.analyticsWebClient as any)?.sendScreenEvent?.({
					name: eventName,
					attributes: {
						...attributes,
						siteUrl
					}
				});
			case 'ui':
				return (this.analyticsWebClient as any)?.sendUIEvent?.({
					source: attributes?.source || 'unknown',
					action: attributes?.action || eventName,
					actionSubject: attributes?.actionSubject || eventName,
					attributes: {
						...attributes
					}
				});
			case 'track':
				return (this.analyticsWebClient as any)?.sendTrackEvent?.({
					source: attributes?.source || 'unknown',
					action: attributes?.action || eventName,
					actionSubject: attributes?.actionSubject || eventName,
					attributes: {
						...attributes
					}
				});
			case 'operational':
				return (this.analyticsWebClient as any)?.sendOperationalEvent?.({
					source: attributes?.source || 'unknown',
					action: attributes?.action || eventName,
					actionSubject: attributes?.actionSubject || eventName,
					attributes: {
						...attributes
					}
				});
			default:
				return Promise.resolve();
		}
	}

	private getContext(userType?: UserType, tenantType?: TenantType): Promise<any> {
		return new Promise((resolve, reject) => {
			view.getContext().then((ctx) => {
				const { cloudId, accountId, siteUrl } = ctx as any;

				if (this.analyticsWebClient && userType && tenantType) {
					this.analyticsWebClient.setTenantInfo?.(tenantType.CLOUD_ID, cloudId);
					this.analyticsWebClient.setUserInfo?.(userType.ATLASSIAN_ACCOUNT, accountId);
					this.analyticsWebClient.siteUrl = siteUrl;
					resolve({ cloudId, accountId, siteUrl }); // Resolve the promise with the context information
				} else {
					reject(new Error('Analytics Web Client is not initialized.'));
				}
			}).catch(reject);
		});
	}
}
