import { deleteBuilds } from './delete-builds';
import { Errors } from '../common/error-messages';
import { InvalidPayloadError } from '../common/error';

describe('deleteBuilds suite', () => {
    it('Should throw an error if no cloudId is passed', async () => {
        (global as any).api = {
            asApp: () => ({
                __requestAtlassian: () => ({}),
            })
        };

        expect(async () => {
            // @ts-ignore
            await deleteBuilds(null);
        }).rejects.toThrow(new InvalidPayloadError(Errors.INVALID_EVENT_TYPE));
    });

    it('Should return status for successful response', async () => {
        (global as any).api = {
            asApp: () => ({
                __requestAtlassian: () => ({ status: 200 }),
            })
        };

        const response = await deleteBuilds('1234');
        expect(response).toEqual({ status: 200, body: {} });
    });
});
