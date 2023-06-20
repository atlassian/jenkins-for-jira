import { view } from '@forge/bridge';

const checkIfAnalyticsPackageInstalled = async () => {
	try {
		await importDynamic('@atlassiansox/analytics-web-client');
		return true;
	} catch (error) {
		return false;
	}
};

const importDynamic = (modulePath: string) => {
	try {
		return import(modulePath);
	} catch (error) {
		return null;
	}
};

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
	PROD = 'prod'
}

export class AnalyticsClient {
	private analyticsWebClient: any;

	constructor() {
		this.analyticsWebClient = null;
	}

	static async sendEvent(eventType: string, name: string, promise: Promise<any>) {
		promise?.catch((error: any) => {
			console.error('Failed to send analytics event', error);
		});
	}

	async sendAnalytics(
		eventType: string,
		eventName: string,
		attributes?: AnalyticsAttributes
	) {
		const isAnalyticsPackageInstalled = await checkIfAnalyticsPackageInstalled();

		if (!isAnalyticsPackageInstalled || EnvType.PROD) {
			console.log('Analytics client not found');
			return;
		}

		if (!this.analyticsWebClient) {
			const analyticsWebClient = await importDynamic('@atlassiansox/analytics-web-client');
			if (analyticsWebClient) {
				const userType = analyticsWebClient?.userType;
				const tenantType = analyticsWebClient?.tenantType;

				this.analyticsWebClient = new analyticsWebClient.AnalyticsWebClient(
					{
						env: EnvType.PROD,
						product: 'jenkinsForJira'
					},
					{
						useLegacyUrl: true
					}
				);

				this.getContext(userType, tenantType);
			} else {
				console.warn('Analytics Web Client module not found. Ignoring the dependency.');
				return;
			}
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

	async getEventData(
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
						...baseAttributes
					}
				});
			case 'ui':
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

	getContext(userType?: any, tenantType?: any) {
		view.getContext().then((ctx) => {
			const { cloudId, accountId } = ctx as any;
			this.analyticsWebClient?.setTenantInfo?.(tenantType.CLOUD_ID, cloudId);
			this.analyticsWebClient?.setUserInfo?.(userType.ATLASSIAN_ACCOUNT, accountId);
		});
	}
}
