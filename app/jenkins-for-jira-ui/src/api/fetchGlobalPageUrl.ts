import { invoke } from '@forge/bridge';

const fetchSiteName = async (): Promise<string> => {
	const context: FetchGlobalPageUrlContext = await invoke('fetchAppData');
	const { siteUrl } = context;
	return siteUrl.replace(/^https?:\/\//, '');
};

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

	return `${siteUrl}/jira/apps/${appId}/${environmentId}`;
};

export {
	fetchGlobalPageUrl,
	fetchSiteName
};
