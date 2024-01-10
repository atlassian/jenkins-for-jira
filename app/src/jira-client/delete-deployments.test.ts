import api from '@forge/api';
import { Errors } from '../common/error-messages';
import { deleteDeployments } from './delete-deployments';
import { InvalidPayloadError } from '../common/error';

jest.mock('@forge/api', () => ({
	...jest.requireActual('@forge/api'),
	asApp: jest.fn().mockReturnValue({
		requestJira: jest.fn()
	})
}));

describe('deleteDeployments suite', () => {
	it('Should throw an error if no cloudId is passed', async () => {
		const error = new InvalidPayloadError(Errors.MISSING_CLOUD_ID);
		await expect(deleteDeployments(null!)).rejects.toThrow(error);
	});

	it('Should return status for successful response', async () => {
		const mockResponse = { status: 200 };
		api.asApp().requestJira = jest.fn().mockImplementation(() => ({
			then: (callback: any) => Promise.resolve(callback(mockResponse))
		}));

		const result = await deleteDeployments('1234');
		expect(result).toEqual({ status: 200, body: {} });
	});
});
