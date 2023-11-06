import { invoke, router } from '@forge/bridge';

interface Context {
	siteUrl: string;
	appId: string;
	environmentId: string;
}

const redirectFromGetStarted = async () => {
	const context: Context = await invoke('redirectFromGetStarted');
	const { siteUrl, appId, environmentId } = context;
	router.navigate(`${siteUrl}/jira/settings/apps/${appId}/${environmentId}/`);
};

export {
	redirectFromGetStarted
};
