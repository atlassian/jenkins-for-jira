type RejectedData = {
    key: {
        pipelineId: string;
        buildNumber?: number;
        deploymentNumber?: number;
    };
    errors?: {
        message: string;
    }[];
};

type AcceptedBuildData = {
    pipelineId: string;
    buildNumber?: number;
};

type AcceptedDeploymentData = {
    deployments: [
        {
            deploymentSequenceNumber: number,
            environment: {
                id: string
            },
            pipeline: {
                id: string,
                url: string
            }
        }
    ];
};

interface ResponseData {
        unknownIssueKeys: string[];
        unknownAssociations: string[];
}

export interface BuildResponse extends ResponseData {
    type: 'BuildResponse'; // Discriminator property
    acceptedBuilds: AcceptedBuildData[];
    rejectedBuilds: RejectedData[];
}

export interface DeploymentResponse extends ResponseData {
    type: 'DeploymentResponse'; // Discriminator property
    acceptedDeployments: AcceptedDeploymentData[];
    rejectedDeployments: RejectedData[];
}

type InfoData = {
    pipelineId: string;
    statusType: string;
    errorMessage?: string;
};

const getRejectedInfo = (rejectedData: RejectedData, statusType: string): InfoData => {
    const { pipelineId } = rejectedData.key;
    const errorMessage = rejectedData.errors?.map((error) => error.message).join('; ');
    return { pipelineId, statusType, errorMessage };
};

export const getInfo = <T extends { pipelineId: string }>(
    data: T[],
    statusType: string
): InfoData[] => {
    return data.map((item) => {
        const { pipelineId } = item;
        return { pipelineId, statusType };
    });
};

export const getDeploymentInfo = (
    data: AcceptedDeploymentData[],
    statusType: string
): InfoData[] => {
    return data.flatMap((item) =>
        item.deployments.map((deployment) => ({
            pipelineId: deployment.pipeline.id,
            statusType,
		})));
};

export const getResponseData = (response: BuildResponse | DeploymentResponse): InfoData[] => {
    if (response.type === 'BuildResponse') {
        const { acceptedBuilds, rejectedBuilds } = response;

        const acceptedBuildsInfo = getInfo(acceptedBuilds, 'acceptedBuild');
        const rejectedBuildsInfo = rejectedBuilds?.map((rejectedData) => getRejectedInfo(rejectedData, 'rejectedBuild')) ?? [];

        return [
            ...acceptedBuildsInfo,
            ...rejectedBuildsInfo,
        ];
    }

    if (response.type === 'DeploymentResponse') {
        const { acceptedDeployments, rejectedDeployments } = response;

        const acceptedDeploymentsInfo = getDeploymentInfo(acceptedDeployments, 'acceptedDeployment');
        const rejectedDeploymentsInfo = rejectedDeployments?.map((rejectedData) => getRejectedInfo(rejectedData, 'rejectedDeployment')) ?? [];

        return [
            ...acceptedDeploymentsInfo,
            ...rejectedDeploymentsInfo,
        ];
    }

    // Handle any other cases or return an empty array if necessary.
    return [];
};
