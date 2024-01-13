import { Errors } from '../common/error-messages';
import { deleteDeployments } from './delete-deployments';
import { InvalidPayloadError } from '../common/error';

describe('deleteDeployments suite', () => {
	it('Should throw an error if no cloudId is passed', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({})
			})
		};

		expect(async () => {
			// @ts-ignore
			await deleteDeployments(null);
		}).rejects.toThrow(new InvalidPayloadError(Errors.MISSING_CLOUD_ID));
	});

	it('Should return status for successful response', async () => {
		(global as any).api = {
			asApp: () => ({
				__requestAtlassian: () => ({ status: 200 })
			})
		};

		const response = await deleteDeployments('1234');
		expect(response).toEqual({ status: 200, body: {} });
	});
});
