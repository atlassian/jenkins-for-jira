import React from 'react';
import {
	act, fireEvent, render, screen
} from '@testing-library/react';
import { useParams } from 'react-router';
import { JenkinsSetup } from './JenkinsSetup';
import * as fetchGlobalPageUrlModule from '../../api/fetchGlobalPageUrl';
import * as getAllJenkinsServersModule from '../../api/getAllJenkinsServers';
import * as getJenkinsServerWithSecretModule from '../../api/getJenkinsServerWithSecret';
import * as getWebhookUrlModule from '../../common/util/jenkinsConnectionsUtils';
import { EventType, JenkinsServer } from '../../../../src/common/types';

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: jest.fn()
}));

jest.mock('../../api/fetchGlobalPageUrl');
jest.mock('../../api/getAllJenkinsServers');
jest.mock('../../api/getJenkinsServerWithSecret');
jest.mock('../../common/util/jenkinsConnectionsUtils');

document.execCommand = jest.fn();

afterAll(() => {
	jest.restoreAllMocks();
});

const server: JenkinsServer[] = [{
	name: 'server one',
	uuid: '56046af9-d0eb-4efb-8896-6c9d0da884fe',
	pluginConfig: {
		ipAddress: '10.10.10.10',
		lastUpdatedOn: new Date()
	},
	pipelines: [
		{
			name: '#74315',
			lastEventType: EventType.DEPLOYMENT,
			lastEventStatus: 'successful',
			lastEventDate: new Date()
		},
		{
			name: '#1234',
			lastEventType: EventType.BUILD,
			lastEventStatus: 'failed',
			lastEventDate: new Date()
		}
	]
}];

describe('JenkinsSetup Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockParams = { id: '12345678' };
	(useParams as jest.Mock).mockReturnValue(mockParams);

	it('should only display loader and title during loading state', async () => {
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([]);

		const { getByText, queryByText } = render(<JenkinsSetup />);
		expect(getByText('Connect Jenkins to Jira')).toBeInTheDocument();
		expect(queryByText('Server name:')).toBeNull();
	});

	it('should display the server name', async () => {
		(fetchGlobalPageUrlModule.fetchSiteName as jest.Mock).mockResolvedValueOnce('https://mocked-site-name.com');

		(getJenkinsServerWithSecretModule.getJenkinsServerWithSecret as jest.Mock).mockResolvedValueOnce({
			name: 'Mocked Server',
			secret: 'mocked-secret'
		});

		(getWebhookUrlModule.getWebhookUrl as jest.Mock).mockImplementationOnce(
			async (setWebhookUrl: (arg: string) => void): Promise<void> => {
				const mockedUrl = 'https://mockedwebhookurl.com';
				setWebhookUrl(mockedUrl);
			}
		);

		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(server);

		await act(async () => {
			render(<JenkinsSetup />);
		});

		expect(screen.getByText(/Server name:/i)).toBeInTheDocument();
		expect(screen.getByText(/Server name:/i)).toHaveTextContent('Mocked Server');
	});

	it('toggles between "My Jenkins admin" and "I am the Jenkins admin" views', async () => {
		(fetchGlobalPageUrlModule.fetchSiteName as jest.Mock).mockResolvedValueOnce('https://mocked-site-name.com');

		(getJenkinsServerWithSecretModule.getJenkinsServerWithSecret as jest.Mock).mockResolvedValueOnce({
			name: 'Mocked Server',
			secret: 'mocked-secret'
		});

		(getWebhookUrlModule.getWebhookUrl as jest.Mock).mockImplementationOnce(
			async (setWebhookUrl: (arg: string) => void): Promise<void> => {
				const mockedUrl = 'https://mockedwebhookurl.com';
				setWebhookUrl(mockedUrl);
			}
		);

		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(server);

		await act(async () => {
			render(<JenkinsSetup/>);
		});

		const { getByText, queryByText } = screen;

		fireEvent.click(getByText('My Jenkins admin'));
		expect(getByText('Copy the items below and give them to your Jenkins admin')).toBeInTheDocument();
		expect(queryByText('Log in to Jenkins in another window and use the items below to set up your server.')).not.toBeInTheDocument();

		fireEvent.click(getByText('I am (I\'m a Jenkins admin)'));
		expect(queryByText('Copy the items below and give them to your Jenkins admin')).not.toBeInTheDocument();
		expect(getByText('Log in to Jenkins in another window and use the items below to set up your server.')).toBeInTheDocument();
	});

	it('copies content to clipboard when "Copy" button is clicked', async () => {

		(fetchGlobalPageUrlModule.fetchSiteName as jest.Mock).mockResolvedValueOnce('https://mocked-site-name.com');

		(getJenkinsServerWithSecretModule.getJenkinsServerWithSecret as jest.Mock).mockResolvedValueOnce({
			name: 'Mocked Server',
			secret: 'mocked-secret'
		});

		(getWebhookUrlModule.getWebhookUrl as jest.Mock).mockImplementationOnce(
			async (setWebhookUrl: (arg: string) => void): Promise<void> => {
				const mockedUrl = 'https://mockedwebhookurl.com';
				setWebhookUrl(mockedUrl);
			}
		);

		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(server);

		await act(async () => {
			render(<JenkinsSetup/>);
		});

		const { getByText, getByTestId } = screen;

		fireEvent.click(getByText('My Jenkins admin'));

		await act(async () => {
			fireEvent.click(getByTestId('copy-webhook-url-guide'));
		});

		expect(document.execCommand).toHaveBeenCalledWith('copy');

		await act(async () => {
			fireEvent.click(getByTestId('copy-secret-token-guide'));
		});

		// Switch tabs
		await act(async () => {
			fireEvent.click(getByTestId('i-am-the-jenkins-admin'));
		});

		await act(async () => {
			fireEvent.click(getByTestId('copy-webhook-url'));
		});

		expect(document.execCommand).toHaveBeenCalledWith('copy');

		await act(async () => {
			fireEvent.click(getByTestId('copy-secret-token'));
		});

		expect(document.execCommand).toHaveBeenCalledWith('copy');
	});

	it('displays "Next" button when either "My Jenkins admin" or "I am the Jenkins admin" is selected', async () => {
		(fetchGlobalPageUrlModule.fetchSiteName as jest.Mock).mockResolvedValueOnce('https://mocked-site-name.com');

		(getJenkinsServerWithSecretModule.getJenkinsServerWithSecret as jest.Mock).mockResolvedValueOnce({
			name: 'Mocked Server',
			secret: 'mocked-secret'
		});

		(getWebhookUrlModule.getWebhookUrl as jest.Mock).mockImplementationOnce(
			async (setWebhookUrl: (arg: string) => void): Promise<void> => {
				const mockedUrl = 'https://mockedwebhookurl.com';
				setWebhookUrl(mockedUrl);
			}
		);

		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(server);

		await act(async () => {
			render(<JenkinsSetup/>);
		});

		const { getByText } = screen;

		fireEvent.click(getByText('My Jenkins admin'));
		expect(getByText('Next')).toBeInTheDocument();

		fireEvent.click(getByText('I am (I\'m a Jenkins admin)'));
		expect(getByText('Next')).toBeInTheDocument();
	});
});
