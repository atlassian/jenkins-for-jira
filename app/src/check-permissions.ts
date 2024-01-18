import api, { route } from '@forge/api';
import { GLOBAL_PAGE } from '../jenkins-for-jira-ui/src/common/constants';

// Forge does not export their Request type, so we have to resort to 'any' for now.
export const adminPermissionCheck = async (req: any): Promise<void> => {
	const { accountId, moduleKey } = req.context;
	const isGlobalPage = moduleKey === GLOBAL_PAGE;

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

	if (permissions.status === 403 && !isGlobalPage) {
		throw new Error('Only Jira administrators can access the Jenkins for Jira admin page.');
	}

	const permissionDetails = await permissions.json();

	if (!permissionDetails?.globalPermissions?.includes('ADMINISTER') && !isGlobalPage) {
		throw new Error('Only Jira administrators can access the Jenkins for Jira admin page.');
	}
};
