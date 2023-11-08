export const extractAppIdFromLocalId = (localId: string): string => {
    const regex = /\/([^/]+)\//;
    const matches = localId.match(regex);
    return matches ? matches[1] : '';
};
