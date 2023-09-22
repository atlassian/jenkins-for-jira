import {
	AcceptedBuilds,
	AcceptedDeployments,
	BuildResponse,
	DeploymentResponse,
	getDeploymentInfo,
	getResponseData,
	InfoData,
	RejectedBuildData,
	RejectedDeploymentData
} from './get-data-from-response';

describe('getResponseData', () => {
	// Define sample data for testing
	const acceptedBuilds: AcceptedBuilds[] = [
		{ pipelineId: 'pipeline-1', buildNumber: 123 },
		{ pipelineId: 'pipeline-2', buildNumber: 456 }
	];

	const rejectedBuilds: RejectedBuildData[] = [
		{
			key: { pipelineId: 'pipeline-3' },
			errors: [{ message: 'Error 1' }]
		},
		{
			key: { pipelineId: 'pipeline-4', buildNumber: 789 },
			errors: [{ message: 'Error 2' }]
		}
	];

	const acceptedDeployments: AcceptedDeployments[] = [
		{
			pipelineId: 'pipeline-5',
			environmentId: 'env-1',
			deploymentSequenceNumber: 'deploy-1'
		}
	];

	const rejectedDeployments: RejectedDeploymentData[] = [
		{
			key: { pipelineId: 'pipeline-6' },
			errors: [{ message: 'Error 3' }]
		}
	];

	test('should return correct info data for BuildResponse', () => {
		const response: BuildResponse = {
			type: 'BuildResponse',
			unknownIssueKeys: [],
			acceptedBuilds,
			rejectedBuilds
		};

		const expected: InfoData[] = [
			{ pipelineId: 'pipeline-1', statusType: 'acceptedBuild' },
			{ pipelineId: 'pipeline-2', statusType: 'acceptedBuild' },
			{ pipelineId: 'pipeline-3', statusType: 'rejectedBuild', errorMessage: 'Error 1' },
			{ pipelineId: 'pipeline-4', statusType: 'rejectedBuild', errorMessage: 'Error 2' }
		];

		const result = getResponseData(response);
		expect(result).toEqual(expected);
	});

	test('should return correct info data for DeploymentResponse', () => {
		const response: DeploymentResponse = {
			type: 'DeploymentResponse',
			unknownIssueKeys: [],
			acceptedDeployments,
			rejectedDeployments
		};

		const expected: InfoData[] = [
			{ pipelineId: 'pipeline-5', statusType: 'acceptedDeployment' },
			{ pipelineId: 'pipeline-6', statusType: 'rejectedDeployment', errorMessage: 'Error 3' }
		];

		const result = getResponseData(response);
		expect(result).toEqual(expected);
	});
});

describe('getDeploymentInfo', () => {
	test('should return correct info data for AcceptedDeployments', () => {
		const data: AcceptedDeployments[] = [
			{
				pipelineId: 'pipeline-7',
				environmentId: 'env-2',
				deploymentSequenceNumber: 'deploy-2'
			},
			{
				pipelineId: 'pipeline-8',
				environmentId: 'env-3',
				deploymentSequenceNumber: 'deploy-3'
			}
		];

		const statusType = 'acceptedDeployment';
		const expected: InfoData[] = [
			{ pipelineId: 'pipeline-7', statusType },
			{ pipelineId: 'pipeline-8', statusType }
		];

		const result = getDeploymentInfo(data, statusType);
		expect(result).toEqual(expected);
	});
});
