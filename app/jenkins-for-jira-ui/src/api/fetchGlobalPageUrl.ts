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

const fetchAdminPath = async (): Promise<string> => {
	const context: FetchGlobalPageUrlContext = await invoke('fetchAppData');
	const { appId, environmentId } = context;

	return `/jira/settings/apps/${appId}/${environmentId}`;
};

export {
	fetchGlobalPageUrl,
	fetchSiteName,
	fetchAdminPath
};
