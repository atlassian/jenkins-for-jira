import { JenkinsServer } from '../common/types';
import { connectJenkinsServer } from './connect-jenkins-server';

describe('Connect Jenkins Server Suite', () => {
	it('Should store Jenkins server configuration to Forge Storage', async () => {
		const jenkinsServer: JenkinsServer = {
			name: 'test-jenkins-sever',
			uuid: 'unique-uid',
			secret: 'secret!!!',
			pipelines: []
		};
		const result = await connectJenkinsServer(jenkinsServer, 'cloudId', '');
		expect(result).toBeTruthy();
	});
});
