export type RedirectFromGetStarted = {
    siteUrl: string,
    appId: string,
    environmentId: string,
    moduleKey: string
};

const redirectFromGetStarted = (request: any): RedirectFromGetStarted => {
    const { siteUrl, environmentId, moduleKey } = request.context;
    const appId = 'df76f661-4cbe-4768-a119-13992dc4ce2d';
    return {
        siteUrl,
        appId,
        environmentId,
        moduleKey
    };
};

export { redirectFromGetStarted };
