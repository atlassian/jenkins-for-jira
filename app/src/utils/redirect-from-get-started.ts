import { extractAppIdFromLocalId } from './extract-app-id-from-local-id';

export type RedirectFromGetStarted = {
    siteUrl: string,
    appId: string,
    environmentId: string,
    moduleKey: string
};

const redirectFromGetStarted = (request: any): RedirectFromGetStarted => {
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

export { redirectFromGetStarted };
