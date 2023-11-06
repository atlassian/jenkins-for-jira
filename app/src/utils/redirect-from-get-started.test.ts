import { redirectFromGetStarted, RedirectFromGetStarted } from './redirect-from-get-started';

describe('redirectFromGetStarted', () => {
    it('should return the expected RedirectFromGetStarted object', () => {
        const mockRequest = {
            context: {
                siteUrl: 'https://testjira.com',
                appId: 'df76f661-4cbe-4768-a119-13992dc4ce2d',
                environmentId: '1831-1281423-12389342983',
            },
        };

        const result: RedirectFromGetStarted = redirectFromGetStarted(mockRequest);
        const expected: RedirectFromGetStarted = {
            siteUrl: mockRequest.context.siteUrl,
            appId: mockRequest.context.appId,
            environmentId: mockRequest.context.environmentId,
        };

        expect(result).toEqual(expected);
    });
});
