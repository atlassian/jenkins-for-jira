import { redirectFromGetStarted, RedirectFromGetStarted } from './redirect-from-get-started';

describe('redirectFromGetStarted', () => {
    it('should return the expected RedirectFromGetStarted object', () => {
        const mockRequest = {
            context: {
                siteUrl: 'https://testjira.com',
                appId: 'df76f661-4cbe-4768-a119-13992dc4ce2d',
                environmentId: '1831-1281423-12389342983',
                moduleKey: 'some-page',
                localId: 'ari:cloud:ecosystem::extension/df76f661-4cbe-4768-a119-13992dc4ce2d/2113b3a2-5043-4d97-8db0-31d7e2379e3c/static/jenkins-for-jira-ui-admin-page'
            },
        };

        const result: RedirectFromGetStarted = redirectFromGetStarted(mockRequest);
        const {
            siteUrl,
            appId,
            environmentId,
            moduleKey
        } = mockRequest.context;
        const expected: RedirectFromGetStarted = {
            siteUrl,
            appId,
            environmentId,
            moduleKey
        };

        expect(result).toEqual(expected);
    });
});
