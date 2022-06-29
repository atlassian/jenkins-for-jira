import api, { route } from '@forge/api';

const isAdmin = async (accountId: any): Promise<boolean> => {
	const permissionRequestBody = `{
		"globalPermissions": [
			"ADMINISTER"
		],
		"accountId": "${accountId}"
	}`;

	const permissions = await api.asApp().requestJira(route`/rest/api/3/permissions/check`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: permissionRequestBody
	});

	if (permissions.status === 403) {
		return false;
	}

	const permissionDetails = await permissions.json();
	return permissionDetails?.globalPermissions?.includes('ADMINISTER');
};

export {
	isAdmin
};
