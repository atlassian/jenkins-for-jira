import { extractAppIdFromLocalId } from './extract-app-id-from-local-id';

describe('extractAppIdFromLocalId', () => {
    it('should extract the appId value from localId', () => {
        const officialAppId = 'df76f661-4cbe-4768-a119-13992dc4ce2d';
        const officalLocalId = `
            ari:cloud:ecosystem::extension/
                ${officialAppId}/2113b3a2-5043-4d97-8db0-31d7e2379e3c/static/jenkins-for-jira-ui-admin-page`;
        const extractedOfficalAppId = extractAppIdFromLocalId(officalLocalId);
        expect(extractedOfficalAppId).toBe(officialAppId);

        const outdatedAppId = '21696c93-1a1d-4dd0-bac0-dfed80a62aba';
        const outdatedLocalId = `
            ari:cloud:ecosystem::extension/
                ${outdatedAppId}/2113b3a2-5043-4d97-8db0-31d7e2379e3c/static/jenkins-for-jira-ui-admin-page`;
        const extractedOutdatedAppId = extractAppIdFromLocalId(outdatedLocalId);
        expect(extractedOutdatedAppId).toBe(outdatedAppId);
    });
});
