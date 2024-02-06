import React from 'react';
import {
	act, fireEvent, render, screen, waitFor
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import * as ReactRouter from 'react-router';
import { invoke } from '@forge/bridge';
import { getSiteNameFromUrl, ServerManagement } from './ServerManagement';
import * as getAllJenkinsServersModule from '../../api/getAllJenkinsServers';
import * as redirectFromGetStartedModule from '../../api/redirectFromGetStarted';
import * as fetchGlobalPageUrlModule from '../../api/fetchGlobalPageUrl';
import * as fetchUserPermsModule from '../../api/fetchUserPerms';
import { EventType, JenkinsServer } from '../../../../src/common/types';
import { CONFIG_PAGE } from '../../common/constants';

const servers: JenkinsServer[] = [
	{
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
	},
	{
		name: 'server two',
		uuid: '56046af9-d0eb-4efb-8896-jsdfn8234234',
		pluginConfig: {
			ipAddress: '10.10.10.11',
			lastUpdatedOn: new Date()
		},
		pipelines: []
	},
	{
		name: 'server three',
		uuid: '56046af9-d0eb-4efb-8896-ehdf34bhsdf',
		pluginConfig: {
			ipAddress: '10.10.10.10',
			lastUpdatedOn: new Date()
		},
		pipelines: []
	},
	{
		name: 'server four',
		uuid: '56046af9-d0eb-4efb-8896-sjnd893rsd',
		pluginConfig: {
			ipAddress: '10.10.10.12',
			lastUpdatedOn: new Date()
		},
		pipelines: [
			{
				name: '#3456',
				lastEventType: EventType.BUILD,
				lastEventStatus: 'successful',
				lastEventDate: new Date()
			}
		]
	},
	{
		name: 'server five',
		uuid: '56046af9-d0eb-4efb-8896-ed182ende',
		pluginConfig: undefined,
		pipelines: [
			{
				name: '#6789',
				lastEventType: EventType.DEPLOYMENT,
				lastEventStatus: 'pending',
				lastEventDate: new Date()
			}
		]
	},
	{
		name: 'server six',
		uuid: '56046af9-d0eb-4efb-8896-hsdbf723rh2r',
		pluginConfig: {
			ipAddress: '10.10.10.10',
			lastUpdatedOn: new Date()
		},
		pipelines: [
			{
				name: '#3456',
				lastEventType: EventType.BUILD,
				lastEventStatus: 'successful',
				lastEventDate: new Date()
			}
		]
	},
	{
		name: 'server seven',
		uuid: '56046af9-d0eb-4efb-8896-iwer23rjesu',
		pluginConfig: {
			ipAddress: '10.10.10.10',
			lastUpdatedOn: new Date()
		},
		pipelines: []
	},
	{
		name: 'server eight',
		uuid: '56046af9-d0eb-4efb-8896-iwer23rjesu',
		pluginConfig: undefined,
		pipelines: []
	}
];

document.execCommand = jest.fn();
jest.mock('../../api/fetchGlobalPageUrl');
jest.mock('../../api/redirectFromGetStarted');
jest.mock('../../api/fetchUserPerms');
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useHistory: jest.fn()
}));

describe('getSiteNameFromUrlt', () => {
	test('correctly extracts site name from URL', async () => {
		const url = 'https://testjira.atlassian.net/jira/apps/blah-blah';
		const siteName = getSiteNameFromUrl(url);
		expect(siteName).toEqual('testjira.atlassian.net');
	});
});

describe('ServerManagement Component', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should render loader when the module key is "get-started-page"', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[4]]);
		jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce('get-started-page');
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

		await waitFor(() => render(<ServerManagement />));

		expect(screen.getByTestId('jenkins-spinner')).toBeInTheDocument();
	});

	test('should render the loader when there is an unknown module key', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[4]]);
		jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce('unknown-page');
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

		await waitFor(() => render(<ServerManagement />));

		expect(screen.getByTestId('jenkins-spinner')).toBeInTheDocument();
	});

	test.only('should render the ConnectionWizard when there are no servers', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([]);
		jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

		await waitFor(() => render(<ServerManagement />));

		expect(screen.getByTestId('connection-wizard')).toBeInTheDocument();
	});

	test('should copy to clipboard when "Copy to clipboard" is clicked', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[4]]);
		jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

		await waitFor(() => render(<ServerManagement />));
		await waitFor(() => fireEvent.click(screen.getByText('Share page')));
		await waitFor(() => fireEvent.click(screen.getByText('Copy to clipboard')));
		await waitFor(() => screen.getByText('Copied to clipboard'));
		expect(document.execCommand).toHaveBeenCalledWith('copy');
	});

	test('should close the share modal when "Close" is clicked', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(servers);
		jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

		await waitFor(() => render(<ServerManagement />));
		await waitFor(() => fireEvent.click(screen.getByText('Share page')));

		expect(screen.getByText('Copy to clipboard')).toBeInTheDocument();

		await waitFor(() => screen.getByText('Close'));

		fireEvent.click(screen.getByText('Close'));

		await waitFor(() => {
			expect(screen.queryByText('Copy to clipboard')).not.toBeInTheDocument();
		});
	});

	describe('Main panel states', () => {
		test('should render panel content for PENDING server', async () => {
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[7]]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

			await waitFor(() => render(<ServerManagement />));

			await waitFor(() => {
				expect(screen.getByText('PENDING')).toBeInTheDocument();
				expect(screen.getByText('Connection pending')).toBeInTheDocument();
			});
		});

		test('should render panel content for DUPLICATE server', async () => {
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[0], servers[2]]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
			jest.spyOn(fetchUserPermsModule, 'fetchUserPerms').mockResolvedValueOnce(true);

			await waitFor(() => render(<ServerManagement />));

			await waitFor(() => {
				expect(screen.getByText('DUPLICATE')).toBeInTheDocument();
				expect(screen.getByText('Duplicate server')).toBeInTheDocument();
			});
		});

		test('should render panel content for CONNECTED server without pipeline data', async () => {
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[1]]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

			await waitFor(() => render(<ServerManagement />));

			await act(async () => {
				await waitFor(() => {
					expect(screen.getByText('CONNECTED')).toBeInTheDocument();
					expect(screen.getByText('No data received')).toBeInTheDocument();
					expect(screen.queryByText('Pipeline')).not.toBeInTheDocument();
					expect(screen.queryByText('Event')).not.toBeInTheDocument();
					expect(screen.queryByText('Received')).not.toBeInTheDocument();
				});
			});
		});

		test('should render panel content for CONNECTED server with pipeline data', async () => {
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[3]]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

			await waitFor(() => render(<ServerManagement />));

			await waitFor(() => {
				expect(screen.getByText('CONNECTED')).toBeInTheDocument();
				expect(screen.queryByText('No data received')).not.toBeInTheDocument();
				expect(screen.getByText('Pipeline')).toBeInTheDocument();
				expect(screen.getByText('Event')).toBeInTheDocument();
				expect(screen.getByText('Received')).toBeInTheDocument();
			});
		});

		test('should render panel content for UPDATE_AVAILABLE server with pipeline data', async () => {
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[4]]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

			await waitFor(() => render(<ServerManagement />));

			await waitFor(() => {
				expect(screen.getByText('UPDATE AVAILABLE')).toBeInTheDocument();
				expect(screen.queryByText('No data received')).not.toBeInTheDocument();
				expect(screen.getByText('Pipeline')).toBeInTheDocument();
				expect(screen.getByText('Event')).toBeInTheDocument();
				expect(screen.getByText('Received')).toBeInTheDocument();
			});
		});

		test('should handle refreshing the panel for an UPDATE AVAILABLE server', async () => {
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[4]]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

			await waitFor(() => render(<ServerManagement />));

			await act(async () => {
				await waitFor(() => {
					expect(screen.getByText('UPDATE AVAILABLE')).toBeInTheDocument();
					expect(screen.getByText('Pipeline')).toBeInTheDocument();
					expect(screen.getByText('Event')).toBeInTheDocument();
					expect(screen.getByText('Received')).toBeInTheDocument();
					expect(screen.queryByText('Refresh')).not.toBeInTheDocument();
					expect(screen.queryByText('To receive build and deployment data from this server:')).not.toBeInTheDocument();
				});
			});

			// Change to set up guide tab
			await waitFor(() => {
				fireEvent.click(screen.getByText('Set up guide'));
				expect(screen.queryByText('To receive build and deployment data from this server:')).not.toBeInTheDocument();
				const refreshButton = screen.getByText('Refresh');
				fireEvent.click(refreshButton);
				expect(invoke).toHaveBeenCalledWith('getJenkinsServerWithSecret', { uuid: servers[4].uuid });
			});
		});

		test('should handle server deletion correctly for DUPLICATE SERVERS', async () => {
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[0], servers[2]]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
			jest.spyOn(fetchUserPermsModule, 'fetchUserPerms').mockResolvedValueOnce(true);

			await waitFor(() => render(<ServerManagement />));

			await waitFor(() => {
				// Both have IP address 10.10.10.10
				expect(screen.getByText(servers[0].name)).toBeInTheDocument();
				expect(screen.getByText(servers[2].name)).toBeInTheDocument();
			});

			expect(screen.queryByTestId(`delete-button-${servers[0].name}`)).not.toBeInTheDocument();

			const deleteButton = screen.getByTestId(`delete-button-${servers[2].name}`);
			// Confirm server that isn't a duplicate does not have a delete button
			fireEvent.click(deleteButton);

			await waitFor(() => {
				expect(screen.getByText(servers[0].name)).toBeInTheDocument();
				expect(screen.queryByText(servers[2].name)).not.toBeInTheDocument();
			});
		});
	});

	describe('Dropdown menu items', () => {
		test('should call useHistory when Rename is clicked', async () => {
			const historyMock = createMemoryHistory() as any;
			const mockUseHistory = jest.spyOn(ReactRouter, 'useHistory').mockReturnValue(historyMock);
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[0], servers[1]]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

			await waitFor(() => render(<ServerManagement />));

			await waitFor(() => {
				expect(screen.getByText(servers[0].name)).toBeInTheDocument();
				expect(screen.getByText(servers[1].name)).toBeInTheDocument();
			});

			const dropdownButton = screen.getByTestId(`dropdown-menu-${servers[1].name}`);
			fireEvent.click(dropdownButton);

			await waitFor(() => {
				expect(screen.getByText('Rename')).toBeInTheDocument();
				fireEvent.click(screen.getByText('Rename'));
			});

			expect(mockUseHistory).toHaveBeenCalled();
			mockUseHistory.mockRestore();
		});

		test('should call useHistory when Connection settings is clicked', async () => {
			const historyMock = createMemoryHistory() as any;
			const mockUseHistory = jest.spyOn(ReactRouter, 'useHistory').mockReturnValue(historyMock);
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[0], servers[1]]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

			await waitFor(() => render(<ServerManagement />));

			await waitFor(() => {
				expect(screen.getByText(servers[0].name)).toBeInTheDocument();
				expect(screen.getByText(servers[1].name)).toBeInTheDocument();
			});

			const dropdownButton = screen.getByTestId(`dropdown-menu-${servers[1].name}`);
			fireEvent.click(dropdownButton);

			await waitFor(() => {
				expect(screen.getByText('Connection settings')).toBeInTheDocument();
				fireEvent.click(screen.getByText('Connection settings'));
			});

			expect(mockUseHistory).toHaveBeenCalled();
			mockUseHistory.mockRestore();
		});

		test('should handle server disconnection and refreshing servers correctly', async () => {
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[0], servers[1]]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
			jest.spyOn(fetchUserPermsModule, 'fetchUserPerms').mockResolvedValueOnce(true);

			await waitFor(() => render(<ServerManagement />));

			await waitFor(() => {
				expect(screen.getByText(servers[0].name)).toBeInTheDocument();
				expect(screen.getByText(servers[1].name)).toBeInTheDocument();
			});

			const dropdownButton = screen.getByTestId(`dropdown-menu-${servers[1].name}`);
			fireEvent.click(dropdownButton);

			// Click Disconnect in the dropdown
			await waitFor(() => {
				expect(screen.getByText('Disconnect')).toBeInTheDocument();
				fireEvent.click(screen.getByText('Disconnect'));
			});

			// Confirm disconnect by clicking Disconnect in the modal
			await waitFor(() => {
				expect(screen.getByTestId('disconnectModal')).toBeInTheDocument();
				fireEvent.click(screen.getByText('Disconnect'));
			});

			await act(async () => {
				expect(invoke).toHaveBeenCalledWith('disconnectJenkinsServer', { uuid: servers[1].uuid });
			});

			await waitFor(() => {
				expect(screen.getByText(servers[0].name)).toBeInTheDocument();
				expect(screen.queryByText(servers[1].name)).not.toBeInTheDocument();
			});
		});
	});

	describe('Setup guide tab', () => {
		test('should render SetUpGuide component when there is pluginConfig data for a CONNECTED server', async () => {
			const server = {
				name: 'server with plugin config',
				uuid: '56046af9-d0eb-4efb-8896-ed182ende',
				pluginConfig: {
					ipAddress: '10.10.10.11',
					lastUpdatedOn: new Date()
				},
				pipelines: [
					{
						name: '#74315',
						lastEventType: EventType.DEPLOYMENT,
						lastEventStatus: 'in_progress' as const,
						lastEventDate: new Date()
					}
				]
			};

			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([server]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

			await waitFor(() => render(<ServerManagement />));

			await waitFor(() => {
				expect(screen.getByText(server.name)).toBeInTheDocument();

				fireEvent.click(screen.getByText('Set up guide'));
			});

			await waitFor(() => {
				const setUpGuideText =
					screen.getByText('To receive build and deployment data from this server:');
				expect(setUpGuideText).toBeInTheDocument();
			});
		});

		test('should render UpdateAvailable component when there is no pluginConfig data for a CONNECTED server', async () => {
			const server = {
				name: 'server with no plugin config',
				uuid: '56046af9-d0eb-4efb-8896-ed182ende',
				pluginConfig: undefined,
				pipelines: [
					{
						name: '#74315',
						lastEventType: EventType.DEPLOYMENT,
						lastEventStatus: 'successful' as const,
						lastEventDate: new Date()
					}
				]
			};

			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([server]);
			jest.spyOn(redirectFromGetStartedModule, 'redirectFromGetStarted').mockResolvedValueOnce(CONFIG_PAGE);
			jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

			await waitFor(() => render(<ServerManagement />));

			await waitFor(() => {
				expect(screen.getByText(server.name)).toBeInTheDocument();
				fireEvent.click(screen.getByText('Set up guide'));
			});

			await waitFor(() => {
				const updateAvailableText =
					screen.getByText('This server is connected to Jira and sending data, but is using an outdated Atlassian Software Cloud plugin.');
				expect(updateAvailableText).toBeInTheDocument();
			});
		});
	});
});
