import { invoke, router } from '@forge/bridge';

interface Context {
	siteUrl: string;
	appId: string;
	environmentId: string;
	moduleKey: string;
}

const redirectFromGetStarted = async (): Promise<string> => {
	const context: Context = await invoke('redirectFromGetStarted');
	const {
		siteUrl,
		appId,
		environmentId,
		moduleKey
	} = context;

	if (moduleKey === 'get-started-page') {
		router.navigate(`${siteUrl}/jira/settings/apps/${appId}/${environmentId}/`);
	}

	return moduleKey;
};

export {
	redirectFromGetStarted
};
