import React, { useEffect, useState } from 'react';
import { cx } from '@emotion/css';
import { ConnectionPanelMain } from './ConnectionPanelMain';
import { ConnectionPanelTop } from './ConnectionPanelTop';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { connectionPanelContainer } from './ConnectionPanel.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';

export const addConnectedState = (servers: JenkinsServer[]): JenkinsServer[] => {
	const ipAddressSet = new Set<string>();

	return servers
		.slice() // Create a shallow copy to avoid mutating the original array
		.sort((a, b) => b.pipelines.length - a.pipelines.length)
		.map((server: JenkinsServer) => {
			const ipAddress = server.pluginConfig?.ipAddress;
			let connectedState = ConnectedState.PENDING;

			if (ipAddress && ipAddressSet.has(ipAddress)) {
				connectedState = ConnectedState.DUPLICATE;
			} else if (server.pipelines.length > 0 && ipAddress) {
				connectedState = ConnectedState.CONNECTED;
				ipAddressSet.add(ipAddress);
			}

			return {
				...server,
				connectedState
			};
		});
};

const ConnectionPanel = (): JSX.Element => {
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers() || [];
		const serversWithConnectedState = addConnectedState(servers);
		setJenkinsServers(serversWithConnectedState);
	};

	useEffect(() => {
		fetchAllJenkinsServers();
	}, []);

	const handleServerRefresh = (serverToRemove: JenkinsServer) => {
		const updatedServers = jenkinsServers.filter(
			(server) => server.uuid !== serverToRemove.uuid
		);
		setJenkinsServers(updatedServers);
		setIsLoading(false);
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
							/>
							<ConnectionPanelMain
								connectedState={server.connectedState || ConnectedState.PENDING}
								jenkinsServer={server}
								refreshServers={handleServerRefresh}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
							/>
						</div>
					);
				}
			)}
		</>
	);
};

export { ConnectionPanel };
