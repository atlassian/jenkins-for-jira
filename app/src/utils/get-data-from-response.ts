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

type ResponseData = {
    eventType: string;
    data: {
        message: string;
        path: string;
        responseStatus: number;
        response: {
            unknownIssueKeys: string[];
            acceptedBuilds: AcceptedData[];
            rejectedBuilds: RejectedData[];
            acceptedDeployments: AcceptedData[];
            rejectedDeployments: RejectedData[];
        };
    };
};

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

export const getResponseData = (response: ResponseData): InfoData[] => {
    const {
        acceptedBuilds,
        rejectedBuilds,
        acceptedDeployments,
        rejectedDeployments
    } =
        response.data.response;

    const acceptedBuildsInfo = getInfo(acceptedBuilds, 'acceptedBuild');
    const acceptedDeploymentsInfo = getInfo(acceptedDeployments, 'acceptedDeployment');

    const rejectedBuildsInfo = rejectedBuilds?.map((rejectedData) => getRejectedInfo(rejectedData, 'rejectedBuild')) ?? [];
    const rejectedDeploymentsInfo = rejectedDeployments?.map((rejectedData) => getRejectedInfo(rejectedData, 'rejectedDeployment')) ?? [];

    return [
        ...acceptedBuildsInfo,
        ...acceptedDeploymentsInfo,
        ...rejectedBuildsInfo,
        ...rejectedDeploymentsInfo,
    ];
};
