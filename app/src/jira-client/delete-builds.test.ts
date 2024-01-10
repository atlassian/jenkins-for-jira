import api from '@forge/api';
import { deleteBuilds } from './delete-builds';
import { Errors } from '../common/error-messages';
import { InvalidPayloadError } from '../common/error';

jest.mock('@forge/api', () => ({
	...jest.requireActual('@forge/api'),
	asApp: jest.fn().mockReturnValue({
		requestJira: jest.fn()
	})
}));

describe('deleteBuilds suite', () => {
	it('Should throw an error if no cloudId is passed', async () => {
		const error = new InvalidPayloadError(Errors.MISSING_CLOUD_ID);
		await expect(deleteBuilds(null!)).rejects.toThrow(error);
	});

	it('Should return status for successful response', async () => {
		const mockResponse = { status: 200 };
		api.asApp().requestJira = jest.fn().mockImplementation(() => ({
			then: (callback: any) => Promise.resolve(callback(mockResponse))
		}));

		const response = await deleteBuilds('1234');
		expect(response).toEqual({ status: 200, body: {} });
	});
});
