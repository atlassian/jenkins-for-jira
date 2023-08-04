import { BuildResponse, DeploymentResponse, getResponseData } from './get-data-from-response';

describe('getResponseData', () => {
    it('should return an empty array if both rejectedBuilds and rejectedDeployments are empty', () => {
        const response: BuildResponse = {
            type: 'BuildResponse',
            unknownIssueKeys: [],
            unknownAssociations: [],
            acceptedBuilds: [],
            rejectedBuilds: [],
        };

        const result = getResponseData(response);
        expect(result).toEqual([]);
    });

    it('should return an array with pipelineId for accepted builds', () => {
        const response: BuildResponse = {
            type: 'BuildResponse',
            unknownIssueKeys: [],
            unknownAssociations: [],
            acceptedBuilds: [
                { pipelineId: '13424335354', buildNumber: 5 },
                { pipelineId: '23942945834', buildNumber: 6 },
            ],
            rejectedBuilds: [],
        };

        const result = getResponseData(response);
        expect(result).toEqual([
            { pipelineId: '13424335354', statusType: 'acceptedBuild' },
            { pipelineId: '23942945834', statusType: 'acceptedBuild' },
        ]);
    });

    it('should return an array with pipelineId for accepted deployments', () => {
        const response: DeploymentResponse = {
            type: 'DeploymentResponse',
            unknownIssueKeys: [],
            unknownAssociations: [],
            acceptedDeployments: [
                {
                    deployments: [
                        {
                            deploymentSequenceNumber: 12090,
                            environment: {
                                id: 'stage-d',
                            },
                            pipeline: {
                                id: '1438092307',
                                url: '/url/to/pipeline',
                            },
                        },
                    ],
                },
            ],
            rejectedDeployments: [],
        };

        const result = getResponseData(response);
        expect(result).toEqual([
            { pipelineId: '1438092307', statusType: 'acceptedDeployment' },
        ]);
    });

    it('should return an array with pipelineId and errorMessage for rejected builds', () => {
        const response: BuildResponse = {
            type: 'BuildResponse',
            unknownIssueKeys: ['TEST-123'],
            unknownAssociations: [],
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
        const response: DeploymentResponse = {
            type: 'DeploymentResponse',
            unknownIssueKeys: [],
            unknownAssociations: [],
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
});
