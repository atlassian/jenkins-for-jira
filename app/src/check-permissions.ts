import api, { route } from '@forge/api';
import { internalMetrics } from '@forge/metrics';
import { metricFailedRequests } from './common/metric-names';

// Forge does not export their Request type, so we have to resort to 'any' for now.
export const adminPermissionCheck = async (req: any): Promise<void> => {
	const { accountId } = req.context;

	const permissionRequestBody = `{
		"globalPermissions": [
			"ADMINISTER"
		],
		"accountId": "${accountId}"
	}`;

	const permissions = await api.asUser().requestJira(route`/rest/api/3/permissions/check`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: permissionRequestBody
	});

	if (permissions.status === 403) {
		internalMetrics.counter(metricFailedRequests.notJiraAdminError).incr();
		throw new Error('Only Jira administrators can access the Jenkins for Jira admin page.');
	}

	// TODO JOSH UNCOMMENT

	// const permissionDetails = await permissions.json();

	// @ts-ignore
	// if (!permissionDetails?.globalPermissions?.includes('ADMINISTER')) {
	// 	throw new Error('Only Jira administrators can access the Jenkins for Jira admin page.');
	// }
};
