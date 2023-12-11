import { invoke } from '@forge/bridge';

type FetchGlobalPageUrlContext = {
	siteUrl: string;
	appId: string;
	environmentId: string;
};

const fetchGlobalPageUrl = async (): Promise<string> => {
	const context: FetchGlobalPageUrlContext = await invoke('fetchAppData');
	const {
		siteUrl,
		appId,
		environmentId
	} = context;

	return `${siteUrl}/jira/settings/apps/${appId}/${environmentId}`;
};

export {
	fetchGlobalPageUrl
};
