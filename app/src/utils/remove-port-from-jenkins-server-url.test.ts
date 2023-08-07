import { PayloadWithBuilds, PayloadWithDeployments } from '../common/types';
import { removePortFromJenkinsServerUrl } from './remove-port-from-jenkins-server-url';

describe('removePortFromJenkinsServerUrl', () => {
    const buildPayload: PayloadWithBuilds = {
        properties: {
            source: 'jenkins',
            cloudId: 'bd32dd17-ba44-4e4c-a63a-e2a79c35585f',
            jenkinsServerUuid: '8541c521-d4c2-4a3b-a53b-ef78212a3f72',
        },
        providerMetadata: {
            product: 'jenkins',
        },
        builds: [
            {
                pipelineId: '-1037018184',
                buildNumber: 1,
                updateSequenceNumber: 1691138682,
                displayName: 'testing/TEST-257',
                description: null,
                label: '#1',
                url: 'http://example.com:8080/job/new/job/TEST-389-prod-test/2/',
                state: 'successful',
                lastUpdated: '2023-08-04T08:44:42.300504Z',
                issueKeys: ['TEST-257'],
                references: null,
                testInfo: null,
                schemaVersion: '1.0',
            },
        ],
    };

    const deploymentPayload: PayloadWithDeployments = {
        properties: {
            source: 'jenkins',
            cloudId: 'bd32dd17-ba44-4e4c-a63a-e2a79c35585f',
            jenkinsServerUuid: '8541c521-d4c2-4a3b-a53b-ef78212a3f72',
        },
        providerMetadata: {
            product: 'jenkins',
        },
        deployments: [
            {
                deploymentSequenceNumber: 1,
                updateSequenceNumber: 1691138688,
                associations: [
                    {
                        values: ['TEST-257'],
                        associationType: 'issueKeys',
                    },
                ],
                displayName: '#1',
                url: 'http://example.com:8080/job/new/job/TEST-389-prod-test/2/',
                description: '#1',
                lastUpdated: '2023-08-04T08:44:48.141852Z',
                label: '#1',
                state: 'in_progress',
                pipeline: {
                    id: '-1037018184',
                    displayName: 'testing/TEST-257',
                    url: 'http://example.com:8080/job/new/job/TEST-389-prod-test/2/',
                },
                environment: {
                    id: 'stg',
                    displayName: 'stg',
                    type: 'staging',
                },
                schemaVersion: '1.0',
            },
        ],
    };

    const modifiedBuildsPayload: PayloadWithBuilds = {
        properties: {
            source: 'jenkins',
            cloudId: 'bd32dd17-ba44-4e4c-a63a-e2a79c35585f',
            jenkinsServerUuid: '8541c521-d4c2-4a3b-a53b-ef78212a3f72',
        },
        providerMetadata: {
            product: 'jenkins',
        },
        builds: [
            {
                pipelineId: '-1037018184',
                buildNumber: 1,
                updateSequenceNumber: 1691138682,
                displayName: 'testing/TEST-257',
                description: null,
                label: '#1',
                url: 'http://example.com/job/new/job/TEST-389-prod-test/2/', // Modified URL
                state: 'successful',
                lastUpdated: '2023-08-04T08:44:42.300504Z',
                issueKeys: ['TEST-257'],
                references: null,
                testInfo: null,
                schemaVersion: '1.0',
            },
        ],
    };

    const modifiedDeploymentsPayload: PayloadWithDeployments = {
        properties: {
            source: 'jenkins',
            cloudId: 'bd32dd17-ba44-4e4c-a63a-e2a79c35585f',
            jenkinsServerUuid: '8541c521-d4c2-4a3b-a53b-ef78212a3f72',
        },
        providerMetadata: {
            product: 'jenkins',
        },
        deployments: [
            {
                deploymentSequenceNumber: 1,
                updateSequenceNumber: 1691138688,
                associations: [
                    {
                        values: ['TEST-257'],
                        associationType: 'issueKeys',
                    },
                ],
                displayName: '#1',
                url: 'http://example.com/job/new/job/TEST-389-prod-test/2/', // Modified URL
                description: '#1',
                lastUpdated: '2023-08-04T08:44:48.141852Z',
                label: '#1',
                state: 'in_progress',
                pipeline: {
                    id: '-1037018184',
                    displayName: 'testing/TEST-257',
                    url: 'http://example.com/job/new/job/TEST-389-prod-test/2/', // Modified URL
                },
                environment: {
                    id: 'stg',
                    displayName: 'stg',
                    type: 'staging',
                },
                schemaVersion: '1.0',
            },
        ],
    };

    it('should remove the port from builds URLs', () => {
        const modifiedPayload: PayloadWithBuilds = { ...buildPayload };
		removePortFromJenkinsServerUrl(modifiedPayload);
        expect(modifiedPayload.builds[0].url).toBe('http://example.com/job/new/job/TEST-389-prod-test/2/');
    });

    it('should remove the port from deployments URLs', () => {
        const modifiedPayload: PayloadWithDeployments = { ...deploymentPayload };
        removePortFromJenkinsServerUrl(modifiedPayload);
        expect(modifiedPayload.deployments[0].url).toBe('http://example.com/job/new/job/TEST-389-prod-test/2/');
    });

    it('should not remove the port from localhost URLs', () => {
        const modifiedPayload: PayloadWithBuilds = {
            ...buildPayload,
            builds: [
                {
                    ...buildPayload.builds[0],
                    url: 'http://localhost:3000/job/new/job/TEST-389-prod-test/2/',
                },
            ],
        };
        removePortFromJenkinsServerUrl(modifiedPayload);
        expect(modifiedPayload.builds[0].url).toBe('http://localhost:3000/job/new/job/TEST-389-prod-test/2/');
    });

    it('should not change URLs without a port', () => {
        const modifiedPayload: PayloadWithBuilds = {
            ...buildPayload,
            builds: [
                {
                    ...buildPayload.builds[0],
                    url: 'http://example.com/job/new/job/TEST-389-prod-test/2/',
                },
            ],
        };
        removePortFromJenkinsServerUrl(modifiedPayload);
        expect(modifiedPayload.builds[0].url).toBe('http://example.com/job/new/job/TEST-389-prod-test/2/');
    });

    it('should remove the port from builds URLs', () => {
        const modifiedPayload: PayloadWithBuilds = { ...buildPayload };
        const result = removePortFromJenkinsServerUrl(modifiedPayload);
        expect(result).toEqual(modifiedBuildsPayload);
    });

    it('should remove the port from deployments URLs', () => {
        const modifiedPayload: PayloadWithDeployments = { ...deploymentPayload };
        const result = removePortFromJenkinsServerUrl(modifiedPayload);
        expect(result).toEqual(modifiedDeploymentsPayload);
    });
});
