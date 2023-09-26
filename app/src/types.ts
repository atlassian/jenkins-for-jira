export interface ResolverContext {
    localId: string,
    cloudId: string,
    environmentId: string,
    environmentType: string,
    moduleKey: string,
    siteUrl: string,
    extension: { type: string },
    installContext: string,
    accountId: string,
    license: string,
    jobId: string
}
