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

type AcceptedData = {
    pipelineId: string;
    buildNumber?: number;
    deploymentNumber?: number;
};

interface ResponseData {
        unknownIssueKeys: string[];
        unknownAssociations: string[];
}

interface BuildResponse extends ResponseData {
    type: 'BuildResponse'; // Discriminator property
    acceptedBuilds: AcceptedData[];
    rejectedBuilds: RejectedData[];
}

interface DeploymentResponse extends ResponseData {
    type: 'DeploymentResponse'; // Discriminator property
    acceptedDeployments: AcceptedData[];
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

const getInfo = <T extends { pipelineId: string }>(
    data: T[],
    statusType: string
): InfoData[] => {
    return data?.map((item) => {
        const { pipelineId } = item;
        return { pipelineId, statusType };
    }) ?? [];
};

export const getResponseData = (response: BuildResponse | DeploymentResponse): InfoData[] => {
    if (response.type === 'BuildResponse') {
        const {
            acceptedBuilds,
            rejectedBuilds,
        } = response;

        const acceptedBuildsInfo = getInfo(acceptedBuilds, 'acceptedBuild');
        const rejectedBuildsInfo = rejectedBuilds?.map((rejectedData) => getRejectedInfo(rejectedData, 'rejectedBuild')) ?? [];

        return [
            ...acceptedBuildsInfo,
            ...rejectedBuildsInfo,
        ];
    }

    if (response.type === 'DeploymentResponse') {
        const {
            acceptedDeployments,
            rejectedDeployments,
        } = response;

        const acceptedDeploymentsInfo = getInfo(acceptedDeployments, 'acceptedDeployment');
        const rejectedDeploymentsInfo = rejectedDeployments?.map((rejectedData) => getRejectedInfo(rejectedData, 'rejectedDeployment')) ?? [];

        return [
            ...acceptedDeploymentsInfo,
            ...rejectedDeploymentsInfo,
        ];
    }

    // Handle any other cases or return an empty array if necessary.
    return [];
};
