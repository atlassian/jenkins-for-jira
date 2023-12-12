import React from 'react';
import {
	act, fireEvent, render, screen, waitFor
} from '@testing-library/react';
import { invoke } from '@forge/bridge';
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
	},
	{
		name: 'server eight',
		uuid: '56046af9-d0eb-4efb-8896-iwer23rjesu',
		pluginConfig: undefined,
		pipelines: []
	}
];

describe('Connection Panel Suite', () => {
	test('fetches and displays servers on mount', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(servers);

		render(<ConnectionPanel jenkinsServers={servers} setJenkinsServers={jest.fn()} />);

		await waitFor(() => {
			expect(screen.getByText(servers[0].name)).toBeInTheDocument();
			expect(screen.getByText(servers[1].name)).toBeInTheDocument();
			expect(screen.getByText(servers[2].name)).toBeInTheDocument();
			expect(screen.getByText(servers[3].name)).toBeInTheDocument();
			expect(screen.getByText(servers[4].name)).toBeInTheDocument();
			expect(screen.getByText(servers[5].name)).toBeInTheDocument();
			expect(screen.getByText(servers[6].name)).toBeInTheDocument();
		});
	});

	describe('addConnectedState', () => {
		it('should handle a single server', () => {
			const singleServer: JenkinsServer[] = [servers[0]];
			const result = addConnectedState(singleServer);

			expect(result[0].connectedState).toEqual(ConnectedState.CONNECTED);
		});

		it('should correctly set state for multiple servers with duplicate IPs', () => {
			const multipleServers: JenkinsServer[] = [servers[0], servers[2], servers[3], servers[7]];
			const results = addConnectedState(multipleServers);

			expect(results[0].connectedState).toEqual(ConnectedState.CONNECTED);
			expect(results[1].connectedState).toEqual(ConnectedState.CONNECTED);
			expect(results[2].connectedState).toEqual(ConnectedState.DUPLICATE);
			expect(results[3].connectedState).toEqual(ConnectedState.PENDING);
		});

		it('should handle servers with missing data', () => {
			const noPluginConfigAndNoPipelines: JenkinsServer[] = [servers[7]];
			const noPluginConfigButHasPipelines: JenkinsServer[] = [servers[4]];
			const hasPluginConfigButNoPipelines: JenkinsServer[] = [servers[6]];

			const noPluginConfigAndNoPipelinesResult = addConnectedState(noPluginConfigAndNoPipelines);
			const noPluginConfigButHasPipelinesResult = addConnectedState(noPluginConfigButHasPipelines);
			const hasPluginConfigButNoPipelinesResult = addConnectedState(hasPluginConfigButNoPipelines);

			expect(noPluginConfigButHasPipelinesResult[0].connectedState).toEqual(ConnectedState.CONNECTED);
			expect(noPluginConfigAndNoPipelinesResult[0].connectedState).toEqual(ConnectedState.PENDING);
			expect(hasPluginConfigButNoPipelinesResult[0].connectedState).toEqual(ConnectedState.CONNECTED);
		});

		it('should correctly set state for multiple servers with duplicate IPs and no pipelines', () => {
			const duplicateServers: JenkinsServer[] = [servers[1], servers[5], servers[6]];
			const result = addConnectedState(duplicateServers);

			expect(result[0].connectedState).toEqual(ConnectedState.CONNECTED);
			expect(result[1].connectedState).toEqual(ConnectedState.CONNECTED);
			expect(result[2].connectedState).toEqual(ConnectedState.DUPLICATE);
			expect(result[2].originalConnection).toEqual(servers[5].name);
		});
	});

	describe('ConnectionPanelTop', () => {
		const refreshServers = jest.fn();

		describe('Connected states', () => {
			test('should render the correct content and styles for CONNECTED state', () => {
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

			test('should render the correct content and styles for DUPLICATE state', () => {
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

			test('should render the correct content and styles for PENDING state', () => {
				const server: JenkinsServer = {
					name: 'my server',
					connectedState: ConnectedState.PENDING,
					pluginConfig: undefined,
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
				const ipAddressLabel = screen.queryByText(`IP address: ${server.pluginConfig?.ipAddress}`);
				const statusLabel = screen.getByTestId('status-label');

				expect(nameLabel).toBeInTheDocument();
				expect(ipAddressLabel).not.toBeInTheDocument();
				expect(statusLabel).toHaveStyle({ color: '#a54900', backgroundColor: '#fff7d6' });
				expect(statusLabel).toHaveTextContent('PENDING');
			});
		});

		describe('IP address', () => {
			test('should render a server with the IP address if there is pluginConfig data', () => {
				render(
					<ConnectionPanelTop
						server={servers[0]}
						refreshServers={refreshServers}
					/>
				);

				expect(screen.getByText('IP address: 10.10.10.10')).toBeInTheDocument();
			});

			test('should render a server without the IP address if there is no pluginConfig data', () => {
				render(
					<ConnectionPanelTop
						server={servers[4]}
						refreshServers={refreshServers}
					/>
				);

				expect(screen.queryByText('IP address:', { exact: false })).not.toBeInTheDocument();
			});
		});
	});
});
