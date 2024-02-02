import api, { route } from '@forge/api';
import { Logger } from '../config/logger';

const fetchUserPerms = async (req: any): Promise<boolean> => {
    const logger = Logger.getInstance('blah');
    const { accountId } = req.context;
    logger.info('accountId', { accountId });

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