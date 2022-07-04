import api, { route } from '@forge/api';

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
		throw new Error('Only Jira administrators can perform this operation.');
	}

	const permissionDetails = await permissions.json();

	if (!permissionDetails?.globalPermissions?.includes('ADMINISTER')) {
		throw new Error('Only Jira administrators can perform this operation.');
	}
};
