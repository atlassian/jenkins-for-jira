import React from 'react';
import {
	fireEvent,
	render,
	screen,
	waitFor
} from '@testing-library/react';
import { ConnectionPanelTop } from './ConnectionPanelTop';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { addConnectedState, ConnectionPanel } from './ConnectionPanel';
import { EventType, JenkinsServer } from '../../../../src/common/types';
import * as getAllJenkinsServersModule from '../../api/getAllJenkinsServers';

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
	}
];

describe('addConnectedState', () => {
	it('should handle a single server', () => {
		const singleServer: JenkinsServer[] = [servers[0]];
		const result = addConnectedState(singleServer);

		expect(result[0].connectedState).toEqual(ConnectedState.CONNECTED);
	});

	it('should correctly set state for two servers with different IPs', () => {
		const twoServers: JenkinsServer[] = [servers[0], servers[1]];
		const result = addConnectedState(twoServers);

		expect(result[0].connectedState).toEqual(ConnectedState.CONNECTED);
		expect(result[1].connectedState).toEqual(ConnectedState.PENDING);
	});

	it('should correctly set state for multiple servers with duplicate IPs', () => {
		const multipleServers: JenkinsServer[] = [servers[0], servers[2], servers[3]];
		const result = addConnectedState(multipleServers);

		expect(result[0].connectedState).toEqual(ConnectedState.CONNECTED);
		expect(result[1].connectedState).toEqual(ConnectedState.CONNECTED);
		expect(result[2].connectedState).toEqual(ConnectedState.DUPLICATE);
	});

	it('should handle servers with no pluginConfig', () => {
		const noPluginConfig: JenkinsServer[] = [servers[4]];
		const result = addConnectedState(noPluginConfig);

		expect(result[0].connectedState).toEqual(ConnectedState.PENDING);
	});

	it('should correctly set state for multiple servers with duplicate IPs and no pipelines', () => {
		const duplicateServers: JenkinsServer[] = [servers[1], servers[5], servers[6]];
		const result = addConnectedState(duplicateServers);

		expect(result[0].connectedState).toEqual(ConnectedState.CONNECTED);
		expect(result[1].connectedState).toEqual(ConnectedState.PENDING);
		expect(result[2].connectedState).toEqual(ConnectedState.DUPLICATE);
	});
});

describe('ConnectionPanelTop', () => {
	describe('Connected states', () => {
		const refreshServers = jest.fn();
		test('renders with the correct content and styles for CONNECTED state', () => {
			const server: JenkinsServer = {
				name: 'my server',
				connectedState: ConnectedState.CONNECTED,
				pluginConfig: {
					ipAddress: '10.0.0.1',
					lastUpdatedOn: new Date(),
					autoBuildRegex: '',
					autoBuildEnabled: true,
					autoDeploymentsEnabled: false,
					autoDeploymentsRegex: ''
				},
				uuid: 'djsnfudin-jhsdwefwe-238hnfuwef',
				pipelines: []
			};

			render(
				<ConnectionPanelTop
					server={server}
					refreshServers={refreshServers}
				/>
			);

			const nameLabel = screen.getByText(server.name);
			const ipAddressLabel = screen.getByText(`IP address: ${server.pluginConfig?.ipAddress}`);
			const statusLabel = screen.getByTestId('status-label');

			expect(nameLabel).toBeInTheDocument();
			expect(ipAddressLabel).toBeInTheDocument();
			expect(statusLabel).toHaveStyle({ color: '#206e4e', backgroundColor: '#dcfff1' });
			expect(statusLabel).toHaveTextContent('CONNECTED');
		});

		test('renders with the correct content and styles for DUPLICATE state', () => {
			const server: JenkinsServer = {
				name: 'my server',
				connectedState: ConnectedState.DUPLICATE,
				pluginConfig: {
					ipAddress: '10.0.0.1',
					lastUpdatedOn: new Date(),
					autoBuildRegex: '',
					autoBuildEnabled: true,
					autoDeploymentsEnabled: false,
					autoDeploymentsRegex: ''
				},
				uuid: 'djsnfudin-jhsdwefwe-238hnfuwef',
				pipelines: []
			};

			render(
				<ConnectionPanelTop
					server={server}
					refreshServers={refreshServers}
				/>
			);

			const nameLabel = screen.getByText(server.name);
			const ipAddressLabel = screen.getByText(`IP address: ${server.pluginConfig?.ipAddress}`);
			const statusLabel = screen.getByTestId('status-label');

			expect(nameLabel).toBeInTheDocument();
			expect(ipAddressLabel).toBeInTheDocument();
			expect(statusLabel).toHaveStyle({ color: '#ae2e24', backgroundColor: '#ffecea' });
			expect(statusLabel).toHaveTextContent('DUPLICATE');
		});

		test('renders with the correct content and styles for PENDING state', () => {
			const server: JenkinsServer = {
				name: 'my server',
				connectedState: ConnectedState.PENDING,
				pluginConfig: {
					ipAddress: '10.0.0.1',
					lastUpdatedOn: new Date(),
					autoBuildRegex: '',
					autoBuildEnabled: true,
					autoDeploymentsEnabled: false,
					autoDeploymentsRegex: ''
				},
				uuid: 'djsnfudin-jhsdwefwe-238hnfuwef',
				pipelines: []
			};

			render(
				<ConnectionPanelTop
					server={server}
					refreshServers={refreshServers}
				/>
			);

			const nameLabel = screen.getByText(server.name);
			const ipAddressLabel = screen.getByText(`IP address: ${server.pluginConfig?.ipAddress}`);
			const statusLabel = screen.getByTestId('status-label');

			expect(nameLabel).toBeInTheDocument();
			expect(ipAddressLabel).toBeInTheDocument();
			expect(statusLabel).toHaveStyle({ color: '#a54900', backgroundColor: '#fff7d6' });
			expect(statusLabel).toHaveTextContent('PENDING');
		});
	});

	describe('Functionality', () => {
		const mockServers = [
			{
				name: 'test server 1',
				uuid: 'ieufn9283rn2-12u23r92-12eu1e19',
				pipelines: [],
				pluginConfig: {
					ipAddress: '127.0.0.2',
					lastUpdatedOn: new Date()
				}
			},
			{
				name: 'test server 2',
				uuid: '11213123jn0r-12u23r92-12eu1e19',
				pipelines: [],
				pluginConfig: {
					ipAddress: '127.0.0.2',
					lastUpdatedOn: new Date()
				}
			}
		];

		test('fetches and displays servers on mount', async () => {
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(mockServers);

			render(<ConnectionPanel />);

			await waitFor(() => {
				expect(screen.getByText('test server 1')).toBeInTheDocument();
				expect(screen.getByText('test server 2')).toBeInTheDocument();
			});
		});

		test('handles server disconnection and refreshing correctly', async () => {
			jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(mockServers);

			render(<ConnectionPanel />);

			await waitFor(() => {
				expect(screen.getByText('test server 1')).toBeInTheDocument();
				expect(screen.getByText('test server 2')).toBeInTheDocument();
			});

			const dropdownButton = screen.getByRole('button');
			fireEvent.click(dropdownButton);
			fireEvent.click(screen.getByText('Disconnect'));

			await waitFor(() => {
				expect(screen.getByText('test server 1')).toBeInTheDocument();
				expect(screen.queryByText('test server 2')).toBeNull();
			});
		});
	});
});
