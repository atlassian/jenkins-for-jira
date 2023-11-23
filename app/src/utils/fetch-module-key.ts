const fetchModuleKey = async (request: any): Promise<string> => {
    const { moduleKey } = request.context;
    console.log('MODULE KEY: ', moduleKey);
    return moduleKey;
};

export { fetchModuleKey };
