export type RedirectFromGetStarted = {
    siteUrl: string,
    appId: string,
    environmentId: string
};

const redirectFromGetStarted = (request: any): RedirectFromGetStarted => {
    const { siteUrl, environmentId } = request.context;
    const appId = 'df76f661-4cbe-4768-a119-13992dc4ce2d';
    return { siteUrl, appId, environmentId };
};

export { redirectFromGetStarted };
