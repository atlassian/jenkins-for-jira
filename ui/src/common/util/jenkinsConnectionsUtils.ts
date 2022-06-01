import { SetStateAction } from 'react';
import { fetchWebTriggerUrl } from '../../api/fetchWebTriggerUrl';

export const getWebhookUrl = async (setWebhookUrl: (arg: string) => void, uuid: string): Promise<void> => {
	const jenkinsServerUuid = `?jenkins_server_uuid=${uuid}`;
	const url = await fetchWebTriggerUrl('fetchJenkinsEventHandlerUrl') + jenkinsServerUuid;
	setWebhookUrl(url);
	// TODO: Add catch for errors
};

export const setName = async (event: React.ChangeEvent<HTMLInputElement>, setServerName: (arg0: string) => void) => {
	setServerName(event.target.value);
};

export const isFormValid = (
	value: string,
	setHasError: {
		(value: SetStateAction<boolean>): void; (value: SetStateAction<boolean>): void; (arg0: boolean): void;
	},
	setErrorMessage: {
		(value: SetStateAction<string>): void; (value: SetStateAction<string>): void; (arg0: string): void;
	}
): boolean => {
	if (!value) {
		setHasError(true);
		setErrorMessage('This field is required.');
		return false;
	}

	if (value.length > 100) {
		setHasError(true);
		setErrorMessage('Server name exceeds 100 characters. Choose a shorter server name and try again.');
		return false;
	}

	setHasError(false);
	setErrorMessage('');
	return true;
};
