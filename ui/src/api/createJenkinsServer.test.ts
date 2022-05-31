import { createJenkinsServer } from './createJenkinsServer';

describe('createJenkinsServer', (): void => {
	it('should return 1st parenthesis for empty value argument', async (): Promise<void> => {
		const jenkinsServerPayload = {
			name: 'my-server',
			uuid: '5d65b278-9449-11ec-b909-0242ac120002',
			secret: 'my-secret',
			pipelines: []
		};

		const jenkinsServer = await createJenkinsServer(jenkinsServerPayload);

		expect(jenkinsServer).toEqual(jenkinsServerPayload);
	});
});
