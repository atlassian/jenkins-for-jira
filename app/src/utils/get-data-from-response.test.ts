import { getResponseData } from './get-data-from-response';

describe('getResponseData', () => {
    it('should return an empty array if both rejectedBuilds and rejectedDeployments are empty', () => {
        const response = {
            eventType: 'deleteBuildsEvent',
            data: {
                message: 'Called Jira API',
                path: '/jira/builds/0.1/cloud/bd32dd17-ba44-4e4c-a63a-e2a79c35585f/bulk',
                responseStatus: 202,
                response: {
                    unknownIssueKeys: ['TEST-123'],
                    acceptedBuilds: [],
                    rejectedBuilds: [],
                    acceptedDeployments: [],
                    rejectedDeployments: [],
                },
            },
        };

        const result = getResponseData(response);
        expect(result).toEqual([]);
    });

    it('should return an array with pipelineId for accepted builds', () => {
        const response = {
            eventType: 'deleteBuildsEvent',
            data: {
                message: 'Called Jira API',
                path: '/jira/builds/0.1/cloud/bd32dd17-ba44-4e4c-a63a-e2a79c35585f/bulk',
                responseStatus: 202,
                response: {
                    unknownIssueKeys: [],
                    acceptedBuilds: [
                        { pipelineId: '13424335354', buildNumber: 5 },
                        { pipelineId: '23942945834', buildNumber: 6 },
                    ],
                    rejectedBuilds: [],
                    acceptedDeployments: [],
                    rejectedDeployments: [],
                },
            },
        };

        const result = getResponseData(response);
        expect(result).toEqual([
            { pipelineId: '13424335354', statusType: 'acceptedBuild' },
            { pipelineId: '23942945834', statusType: 'acceptedBuild' },
        ]);
    });

    it('should return an array with pipelineId for accepted deployments', () => {
        const response = {
            eventType: 'deleteBuildsEvent',
            data: {
                message: 'Called Jira API',
                path: '/jira/deployments/0.1/cloud/some-uuid/bulk',
                responseStatus: 202,
                response: {
                    unknownIssueKeys: [],
                    acceptedBuilds: [],
                    rejectedBuilds: [],
                    acceptedDeployments: [
                        {
                            pipelineId: '1438092307',
                            environmentId: 'stage-d',
                            deploymentSequenceNumber: 12090,
                        },
                    ],
                    rejectedDeployments: [],
                },
            },
        };

        const result = getResponseData(response);
        expect(result).toEqual([
            { pipelineId: '1438092307', statusType: 'acceptedDeployment' },
        ]);
    });

    it('should return an array with pipelineId and errorMessage for rejected builds', () => {
        const response = {
            eventType: 'deleteBuildsEvent',
            data: {
                message: 'Called Jira API',
                path: '/jira/builds/0.1/cloud/bd32dd17-ba44-4e4c-a63a-e2a79c35585f/bulk',
                responseStatus: 202,
                response: {
                    unknownIssueKeys: ['TEST-123'],
                    acceptedBuilds: [],
                    rejectedBuilds: [
                        {
                            key: { pipelineId: '123456', buildNumber: 41011 },
                            errors: [{ message: 'No valid issues nor ati association found for entity' }],
                        },
                        {
                            key: { pipelineId: '345834953', buildNumber: 41012 },
                            errors: [{ message: 'Error 1' }, { message: 'Error 2' }],
                        },
                    ],
                    acceptedDeployments: [],
                    rejectedDeployments: [],
                },
            },
        };

        const result = getResponseData(response);
        expect(result).toEqual([
            {
                pipelineId: '123456',
                statusType: 'rejectedBuild',
                errorMessage: 'No valid issues nor ati association found for entity',
            },
            {
                pipelineId: '345834953',
                statusType: 'rejectedBuild',
                errorMessage: 'Error 1; Error 2',
            },
        ]);
    });

    it('should return an array with pipelineId and errorMessage for rejected deployments', () => {
        const response = {
            eventType: 'deleteBuildsEvent',
            data: {
                message: 'Called Jira API',
                path: '/jira/deployments/0.1/cloud/some-uuid/bulk',
                responseStatus: 202,
                response: {
                    unknownIssueKeys: [],
                    acceptedBuilds: [],
                    rejectedBuilds: [],
                    acceptedDeployments: [],
                    rejectedDeployments: [
                        {
                            key: { pipelineId: '38423424234', deploymentNumber: 2509 },
                            errors: [{ message: 'Deployment failed' }],
                        },
                        {
                            key: { pipelineId: '9342342342342', deploymentNumber: 2510 },
                            errors: [{ message: 'Error 1' }, { message: 'Error 2' }],
                        },
                    ],
                },
            },
        };

        const result = getResponseData(response);
        expect(result).toEqual([
            {
                pipelineId: '38423424234',
                statusType: 'rejectedDeployment',
                errorMessage: 'Deployment failed',
            },
            {
                pipelineId: '9342342342342',
                statusType: 'rejectedDeployment',
                errorMessage: 'Error 1; Error 2',
            },
        ]);
    });

    it('should return an array with pipelineId for accepted builds and deployments', () => {
        const response = {
            eventType: 'deleteBuildsEvent',
            data: {
                message: 'Called Jira API',
                path: '/jira/builds/0.1/cloud/21ab04ef-0acf-4e62-b163-a12e66774c17/bulk',
                responseStatus: 202,
                response: {
                    unknownIssueKeys: [],
                    acceptedBuilds: [
                        { pipelineId: '13424335354', buildNumber: 5 },
                        { pipelineId: '23942945834', buildNumber: 6 },
                    ],
                    rejectedBuilds: [],
                    acceptedDeployments: [
                        {
                            pipelineId: '1438092307',
                            environmentId: 'stage-d',
                            deploymentSequenceNumber: 12090,
                        },
                    ],
                    rejectedDeployments: [],
                },
            },
        };

        const result = getResponseData(response);
        expect(result).toEqual([
            { pipelineId: '13424335354', statusType: 'acceptedBuild' },
            { pipelineId: '23942945834', statusType: 'acceptedBuild' },
            { pipelineId: '1438092307', statusType: 'acceptedDeployment' },
        ]);
    });

    it('should return an array with pipelineId and errorMessage for rejected builds and deployments', () => {
        const response = {
            eventType: 'deleteBuildsEvent',
            data: {
                message: 'Called Jira API',
                path: '/jira/deployments/0.1/cloud/94d6d966-5444-4481-ad1f-11144585052f/bulk',
                responseStatus: 202,
                response: {
                    unknownIssueKeys: [],
                    acceptedBuilds: [],
                    rejectedBuilds: [
                        {
                            key: { pipelineId: '1438092308', buildNumber: 41013 },
                            errors: [{ message: 'Error 1' }, { message: 'Error 2' }],
                        },
                    ],
                    acceptedDeployments: [],
                    rejectedDeployments: [
                        {
                            key: { pipelineId: '1438092309', deploymentNumber: 2511 },
                            errors: [{ message: 'Deployment failed' }],
                        },
                    ],
                },
            },
        };

        const result = getResponseData(response);
        expect(result).toEqual([
            {
                pipelineId: '1438092308',
                statusType: 'rejectedBuild',
                errorMessage: 'Error 1; Error 2',
            },
            {
                pipelineId: '1438092309',
                statusType: 'rejectedDeployment',
                errorMessage: 'Deployment failed',
            },
        ]);
    });
});
