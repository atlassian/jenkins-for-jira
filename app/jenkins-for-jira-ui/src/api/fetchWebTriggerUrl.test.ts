import { invoke } from '@forge/bridge';
import { fetchWebTriggerUrl } from './fetchWebTriggerUrl';

describe('fetchWebTriggerUrl', (): void => {
	it('should return 1st parenthesis for empty value argument', async (): Promise<void> => {
		await fetchWebTriggerUrl('fetchJenkinsEventHandlerUrl');
		expect(invoke).toHaveBeenCalledWith('fetchJenkinsEventHandlerUrl');
	});
});
