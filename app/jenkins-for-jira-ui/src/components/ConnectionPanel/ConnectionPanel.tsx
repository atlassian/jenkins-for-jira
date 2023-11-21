import React, { useEffect, useState } from 'react';
import { cx } from '@emotion/css';
import { ConnectionPanelMain } from './ConnectionPanelMain';
import { ConnectionPanelTop } from './ConnectionPanelTop';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { connectionPanelContainer } from './ConnectionPanel.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';

// TODO - add DUPLICATE state once I'm pulling in new data from backend
export const addConnectedState = (servers: JenkinsServer[]): JenkinsServer[] => {
	return servers.map((server: JenkinsServer) => ({
		...server,
		connectedState: server.pipelines.length === 0 ? ConnectedState.PENDING : ConnectedState.CONNECTED
	}));
};

const ConnectionPanel = (): JSX.Element => {
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>([]);

	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers() || [];
		const serversWithConnectedState = addConnectedState(servers);
		setJenkinsServers(serversWithConnectedState);
	};

	useEffect(() => {
		fetchAllJenkinsServers();
	}, []);

	return (
		<>
			{jenkinsServers.map(
				(server: JenkinsServer, index: number): JSX.Element => (
					<div className={cx(connectionPanelContainer)} key={index}>
						<ConnectionPanelTop connectedState={server.connectedState || ConnectedState.PENDING} ipAddress="10.10.0.10"/>
						<ConnectionPanelMain
							connectedState={server.connectedState || ConnectedState.PENDING}
							jenkinsServer={server}
						/>
					</div>
				)
			)}
		</>
	);
};

export { ConnectionPanel };
