import { adminPermissionCheck } from './check-permissions';
import { Errors } from './common/error-messages';

describe('adminPermissionCheck suite', () => {
    it('Should throw an error if no accountId is passed in the request', async () => {
        const mockRequest = { context: { accountId: null } };

        try {
            await await adminPermissionCheck(mockRequest);
        } catch (e) {
            // @ts-ignore
            expect(e.toString()).toEqual((`Error: ${Errors.MISSING_ACCOUNT_ID}`));
        }
    });
});
