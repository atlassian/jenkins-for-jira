import { invoke } from '@forge/bridge';

type FetchSiteNameProps = {
	withProtocol: boolean
};

const fetchSiteName = async ({ withProtocol }: FetchSiteNameProps): Promise<string> => {
	const context: FetchGlobalPageUrlContext = await invoke('fetchAppData');
	const { siteUrl } = context;

	if (withProtocol) {
		return `${siteUrl}`;
	}

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
