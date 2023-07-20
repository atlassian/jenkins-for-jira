import { deleteBuilds } from './delete-builds';
import { Errors } from '../common/error-messages';

describe('deleteBuilds suite', () => {
    it('Should throw an error if no cloudId is passed', async () => {
        (global as any).api = {
            asApp: () => ({
                __requestAtlassian: () => ({}),
            })
        };

        try {
            // @ts-ignore
            await deleteBuilds(null);
        } catch (e) {
            // @ts-ignore
            expect(e.toString()).toEqual((`Error: ${Errors.MISSING_CLOUD_ID}`));
        }
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
