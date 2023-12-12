import { extractAppIdFromLocalId } from './extract-app-id-from-local-id';

export type FetchAppDataProps = {
    siteUrl: string,
    appId: string,
    environmentId: string,
    moduleKey: string
};

const fetchAppData = (request: any): FetchAppDataProps => {
    const {
        localId,
        siteUrl,
        environmentId,
        moduleKey
    } = request.context;
    const appId = extractAppIdFromLocalId(localId);

    return {
        siteUrl,
        appId,
        environmentId,
        moduleKey
    };
};

export { fetchAppData };
