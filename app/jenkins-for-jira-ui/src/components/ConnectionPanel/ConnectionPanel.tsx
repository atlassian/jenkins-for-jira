import React, { useEffect, useState } from 'react';
import { cx } from '@emotion/css';
import { ConnectionPanelMain } from './ConnectionPanelMain';
import { ConnectionPanelTop } from './ConnectionPanelTop';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { connectionPanelContainer } from './ConnectionPanel.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { fetchModuleKey } from '../../api/fetchModuleKey';

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
	const [moduleKey, setModuleKey] = useState<string>('');

	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers() || [];
		const serversWithConnectedState = addConnectedState(servers);
		setJenkinsServers(serversWithConnectedState);
	};

	const getModuleKey = async () => {
		const currentModuleKey = await fetchModuleKey();
		setModuleKey(currentModuleKey);
	};

	useEffect(() => {
		getModuleKey();
		fetchAllJenkinsServers();
	}, []);

	console.log('moduleKey asdfafs', moduleKey);

	return (
		<>
			{jenkinsServers.map(
				(server: JenkinsServer, index: number): JSX.Element => {
					const ipAddress = server.pluginConfig?.ipAddress;
					return (
						<div className={cx(connectionPanelContainer)} key={index}>
							<ConnectionPanelTop
								name={server.name}
								connectedState={server.connectedState || ConnectedState.PENDING}
								ipAddress={ipAddress}
								moduleKey={moduleKey}
							/>
							<ConnectionPanelMain
								connectedState={server.connectedState || ConnectedState.PENDING}
								jenkinsServer={server}
								moduleKey={moduleKey}
							/>
						</div>
					);
				}
			)}
		</>
	);
};

export { ConnectionPanel };
