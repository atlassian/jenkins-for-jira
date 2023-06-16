// eslint-disable-next-line import/no-extraneous-dependencies
import AnalyticsWebClient, {
	envType, tenantType, userType
} from '@atlassiansox/analytics-web-client';
import { view } from '@forge/bridge';

const analyticsClient = new AnalyticsWebClient({
	env: envType.PROD,
	product: 'jenkinsForJira',
	subproduct: 'app'
}, {
	useLegacyUrl: true
});

view.getContext().then((ctx) => {
	const { cloudId, accountId } = ctx as any;
	analyticsClient.setTenantInfo(tenantType.CLOUD_ID, cloudId);
	analyticsClient.setUserInfo(userType.ATLASSIAN_ACCOUNT, accountId);
});

export default analyticsClient;
