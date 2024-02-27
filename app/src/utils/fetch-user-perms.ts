import api, { route } from '@forge/api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchUserPerms = async (req: any): Promise<boolean> => {
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

    const permissionDetails = await permissions.json();
    return !!permissionDetails?.globalPermissions?.includes('ADMINISTER');
};

export { fetchUserPerms };
