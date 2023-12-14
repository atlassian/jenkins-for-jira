import React, { useState } from 'react';
import { cx } from '@emotion/css';
import { ConnectionPanelMain } from './ConnectionPanelMain';
import { ConnectionPanelTop } from './ConnectionPanelTop';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { connectionPanelContainer } from './ConnectionPanel.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { getJenkinsServerWithSecret } from '../../api/getJenkinsServerWithSecret';

export const addConnectedState = (servers: JenkinsServer[]): JenkinsServer[] => {
	const ipAddressSet = new Set<string>();

	return servers
		.slice() // Create a shallow copy to avoid mutating the original array
		.sort((a, b) => b.pipelines.length - a.pipelines.length)
		.map((server: JenkinsServer, index, array) => {
			const ipAddress = server.pluginConfig?.ipAddress;
			let connectedState = ConnectedState.PENDING;
			let originalConnection: string | undefined;

			if (ipAddress && ipAddressSet.has(ipAddress)) {
				connectedState = ConnectedState.DUPLICATE;

				// Find the original connection with the same IP address
				const originalServer = array.find(
					(s) => s !== server && s.pluginConfig?.ipAddress === ipAddress &&
						s.connectedState !== ConnectedState.DUPLICATE
				);

				if (originalServer) {
					originalConnection = originalServer.name;
				}
			} else if (server.pluginConfig) {
				connectedState = ConnectedState.CONNECTED;
				if (ipAddress) ipAddressSet.add(ipAddress);
			} else if (!server.pluginConfig && server.pipelines.length) {
				connectedState = ConnectedState.UPDATE_AVAILABLE;
				if (ipAddress) ipAddressSet.add(ipAddress);
			}

			return {
				...server,
				connectedState,
				originalConnection
			};
		});
};

const addConnectedStateToSingleServer = (singleServer: JenkinsServer, allServers: JenkinsServer[]): JenkinsServer => {
	const ipAddress = singleServer.pluginConfig?.ipAddress;

	const isDuplicate =
		ipAddress &&
		allServers.some((server: JenkinsServer) =>
			server !== singleServer && server.pluginConfig?.ipAddress === ipAddress);

	const connectedState: ConnectedState = isDuplicate ? ConnectedState.DUPLICATE : ConnectedState.CONNECTED;

	return {
		...singleServer,
		connectedState
	};
};

type ConnectionPanelProps = {
	jenkinsServers: JenkinsServer[],
	setJenkinsServers(updatedServers: JenkinsServer[]): void
};

const ConnectionPanel = ({ jenkinsServers, setJenkinsServers }: ConnectionPanelProps): JSX.Element => {
	const [isLoading, setIsLoading] = useState(false);
	const [updatedServer, setUpdatedServer] = useState<JenkinsServer>();
	const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);

	const handleServerRefresh = (serverToRemove: JenkinsServer) => {
		const refreshedServers = jenkinsServers.filter(
			(server) => server.uuid !== serverToRemove.uuid
		);
		setJenkinsServers(refreshedServers);
	};

	const handleRefreshUpdateServer = async (uuid: string) => {
		setIsUpdatingServer(true);

		try {
			const server = await getJenkinsServerWithSecret(uuid);

			if (server.pluginConfig) {
				setUpdatedServer(addConnectedStateToSingleServer(server, jenkinsServers));
			}

			setIsUpdatingServer(false);
		} catch (e) {
			console.error('No Jenkins server found.');
		}
	};

	return (
		<>
			{jenkinsServers.map(
				(server: JenkinsServer, index: number): JSX.Element => {
					return (
						<div className={cx(connectionPanelContainer)} key={index}>
							<ConnectionPanelTop
								server={server}
								refreshServers={handleServerRefresh}
								updatedServer={updatedServer}
								isUpdatingServer={isUpdatingServer}
							/>
							<ConnectionPanelMain
								jenkinsServer={server}
								refreshServers={handleServerRefresh}
								handleRefreshUpdateServer={handleRefreshUpdateServer}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
								updatedServer={updatedServer}
								isUpdatingServer={isUpdatingServer}
							/>
						</div>
					);
				}
			)}
		</>
	);
};

export { ConnectionPanel };
