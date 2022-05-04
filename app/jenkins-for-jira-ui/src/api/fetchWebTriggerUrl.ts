// eslint-disable-next-line
import { invoke } from "@forge/bridge";

export interface FetchWebhookUrlResponse {
	url: string
}

const fetchWebTriggerUrl = async (urlHandler: string) => {
	const response : FetchWebhookUrlResponse = await invoke(urlHandler);
	return response?.url;
};

export {
	fetchWebTriggerUrl
};
