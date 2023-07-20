import api, { route } from '@forge/api';
import { InvalidPayloadError, NotAdminError } from './common/error';
import { Errors } from './common/error-messages';

// Forge does not export their Request type, so we have to resort to 'any' for now.
export const adminPermissionCheck = async (req: any): Promise<void> => {
	const { accountId } = req.context;

	if (!accountId) {
		console.log(Errors.MISSING_ACCOUNT_ID);
		throw new InvalidPayloadError(Errors.MISSING_ACCOUNT_ID);
	}

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
		throw new NotAdminError(Errors.NOT_ADMIN);
	}

	const permissionDetails = await permissions.json();

	if (!permissionDetails?.globalPermissions?.includes('ADMINISTER')) {
		throw new NotAdminError(Errors.NOT_ADMIN);
	}
};
