import React, { useEffect, useState } from 'react';
import { cx } from '@emotion/css';
import { ConnectionPanelMain } from './ConnectionPanelMain';
import { ConnectionPanelTop } from './ConnectionPanelTop';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { connectionPanelContainer } from './ConnectionPanel.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { fetchModuleKey } from '../../api/fetchModuleKey';
import { AnalyticsEventTypes, AnalyticsScreenEventsEnum } from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';

const analyticsClient = new AnalyticsClient();

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
			}

			return {
				...server,
				connectedState,
				originalConnection
			};
		});
};

const connectedStateCount = (jenkinsServers: JenkinsServer[], connectedState: ConnectedState): number => {
	const stateCount =
		jenkinsServers.filter((server: JenkinsServer) => server.connectedState === connectedState);
	return stateCount.length;
};

type ConnectionPanelProps = {
	jenkinsServers: JenkinsServer[],
	setJenkinsServers(updatedServers: JenkinsServer[]): void,
	updatedServer: JenkinsServer | undefined,
	isUpdatingServer: boolean,
	uuidOfRefreshServer: string,
	handleRefreshUpdateServer(uuid: string): void
};

const ConnectionPanel = ({
	jenkinsServers,
	setJenkinsServers,
	updatedServer,
	isUpdatingServer,
	uuidOfRefreshServer,
	handleRefreshUpdateServer
}: ConnectionPanelProps): JSX.Element => {
	const [moduleKey, setModuleKey] = useState<string>('');

	const handleServerRefresh = (serverToRemove: JenkinsServer) => {
		const refreshedServers = jenkinsServers.filter(
			(server) => server.uuid !== serverToRemove.uuid
		);
		setJenkinsServers(refreshedServers);
	};

	const getModuleKey = async () => {
		const currentModuleKey = await fetchModuleKey();
		setModuleKey(currentModuleKey);
	};

	useEffect(() => {
		getModuleKey();

		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.ServerNameScreenName,
			{
				numberOfServers: jenkinsServers.length,
				numberOfPendingServers: connectedStateCount(jenkinsServers, ConnectedState.PENDING),
				numberOfUpdateAvailableServers: connectedStateCount(jenkinsServers, ConnectedState.UPDATE_AVAILABLE),
				numberOfConnectedServers: connectedStateCount(jenkinsServers, ConnectedState.CONNECTED),
				numberOfDuplicateServers: connectedStateCount(jenkinsServers, ConnectedState.DUPLICATE)
			}
		);
	}, [jenkinsServers]);

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
								moduleKey={moduleKey}
							/>
							<ConnectionPanelMain
								jenkinsServer={server}
								refreshServers={handleServerRefresh}
								handleRefreshUpdateServer={handleRefreshUpdateServer}
								updatedServer={updatedServer}
								isUpdatingServer={isUpdatingServer}
								uuidOfRefreshServer={uuidOfRefreshServer}
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
