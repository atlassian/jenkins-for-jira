const fetchModuleKey = async (request: any): Promise<string> => {
    const { moduleKey } = request.context;
    return moduleKey;
};

export { fetchModuleKey };
