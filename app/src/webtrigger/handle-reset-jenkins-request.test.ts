import { when } from 'jest-when';
import { getAllJenkinsServers } from '../storage/get-all-jenkins-servers';
import { mockSingleJenkinsPipeline } from '../storage/mockData';
import { disconnectJenkinsServer } from '../storage/disconnect-jenkins-server';
import { resetJenkinsServer, deleteBuildsAndDeployments } from './handle-reset-jenkins-request';
import { deleteBuilds } from '../jira-client/delete-builds';
import { deleteDeployments } from '../jira-client/delete-deployments';

jest.mock('../storage/get-all-jenkins-servers');
jest.mock('../storage/disconnect-jenkins-server');
jest.mock('../jira-client/delete-builds');
jest.mock('../jira-client/delete-deployments');

const CLOUD_ID = '97eaf652-4b6e-46cf-80c2-d99327a63bc1';

describe('Reset Jenkins Server Suite', () => {
	when(disconnectJenkinsServer).mockImplementation(() => Promise.resolve(true));
	when(getAllJenkinsServers).mockImplementation(() => Promise.resolve([mockSingleJenkinsPipeline]));

	it('Should delete all Jenkins server configuration from Forge Storage', async () => {
		await resetJenkinsServer(CLOUD_ID);
		expect(getAllJenkinsServers).toBeCalled();
		expect(disconnectJenkinsServer).toBeCalledWith(mockSingleJenkinsPipeline.uuid);
		expect(deleteBuilds).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
		expect(deleteDeployments).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
	});

	it('Should not delete excluded server from Forge Storage', async () => {
		await resetJenkinsServer(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
		expect(getAllJenkinsServers).toBeCalled();
		expect(disconnectJenkinsServer).toBeCalledTimes(0);
		expect(deleteBuilds).toBeCalledTimes(0);
		expect(deleteDeployments).toBeCalledTimes(0);
	});

	it('Should delete builds and deployments', async () => {
		await deleteBuildsAndDeployments(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
		expect(deleteBuilds).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
		expect(deleteDeployments).toBeCalledWith(CLOUD_ID, mockSingleJenkinsPipeline.uuid);
	});
});
