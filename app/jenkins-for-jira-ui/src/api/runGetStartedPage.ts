import { invoke, router } from '@forge/bridge';

interface Context {
	siteUrl: string;
	appId: string;
	environmentId: string;
}

const runGetStartedPage = async () => {
	const context: Context = await invoke('runGetStartedPage');
	const { siteUrl, appId, environmentId } = context;
	console.log('NAVIGATING TO HOME PAGE');
	router.navigate(`${siteUrl}/jira/settings/apps/${appId}/${environmentId}/`);
};

export {
	runGetStartedPage
};
