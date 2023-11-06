import { invoke, router } from '@forge/bridge';
import { redirectFromGetStarted } from './redirectFromGetStarted';

describe('redirectFromGetStarted', () => {
	it('should call invoke and router.navigate with the correct parameters', async () => {
		const contextData = {
			siteUrl: 'https://testjirasite.com',
			appId: '1234-567-890',
			environmentId: '93-2348248121-3428-345734593'
		};

		(invoke as jest.Mock).mockResolvedValue(contextData);
		await redirectFromGetStarted();
		expect(invoke).toHaveBeenCalledWith('redirectFromGetStarted');
		expect(router.navigate).toHaveBeenCalledWith(
			`${contextData.siteUrl}/jira/settings/apps/${contextData.appId}/${contextData.environmentId}/`
		);
	});

	it('should handle errors gracefully', async () => {
		(invoke as jest.Mock).mockRejectedValue(new Error('Test error'));
		await expect(redirectFromGetStarted()).rejects.toThrow('Test error');
	});
});
