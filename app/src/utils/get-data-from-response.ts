type CommonKey = {
    pipelineId: string;
};

export type RejectedBuildData = {
    key: CommonKey & {
        buildNumber?: number;
    };
    errors?: {
        message: string;
    }[];
};

export type RejectedDeploymentData = {
    key: CommonKey & {
        deploymentNumber?: number;
    };
    errors?: {
        message: string;
    }[];
};

type CommonAcceptedData = {
    pipelineId: string;
};

export type AcceptedBuilds = CommonAcceptedData & {
    buildNumber?: number;
};

export type AcceptedDeployments = CommonAcceptedData & {
    environmentId: string;
    deploymentSequenceNumber: string;
};

interface CommonResponseData {
    unknownIssueKeys: string[];
}

export interface BuildResponse extends CommonResponseData {
    type: 'BuildResponse'; // Discriminator property
    acceptedBuilds: AcceptedBuilds[];
    rejectedBuilds: RejectedBuildData[];
}

export interface DeploymentResponse extends CommonResponseData {
    type: 'DeploymentResponse'; // Discriminator property
    acceptedDeployments: AcceptedDeployments[];
    rejectedDeployments: RejectedDeploymentData[];
    unknownAssociations?: [
        {
            values: string[],
            associationType: string
        }
    ];
}

export type InfoData = {
    pipelineId: string;
    statusType: string;
    errorMessage?: string;
};

const getRejectedInfo = (rejectedData: RejectedBuildData | RejectedDeploymentData, statusType: string): InfoData => {
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
    data: AcceptedDeployments[],
    statusType: string
): InfoData[] => {
    return data.flatMap((item) =>
        ({
            pipelineId: item.pipelineId,
            statusType,
        }));
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

    return [];
};
