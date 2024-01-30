import React, { useEffect } from 'react';
import { cx } from '@emotion/css';
import { ConnectionPanelMain } from './ConnectionPanelMain';
import { ConnectionPanelTop } from './ConnectionPanelTop';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { connectionPanelContainer } from './ConnectionPanel.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { AnalyticsEventTypes, AnalyticsScreenEventsEnum } from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import { CONFIG_PAGE } from '../../common/constants';

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
	return stateCount.length || 0;
};

type ConnectionPanelProps = {
	jenkinsServers: JenkinsServer[],
	setJenkinsServers(updatedServers: JenkinsServer[]): void,
	updatedServer: JenkinsServer | undefined,
	isUpdatingServer: boolean,
	uuidOfRefreshServer: string,
	handleRefreshUpdateServer(uuid: string): void,
	moduleKey: string,
	userIsAdmin?: boolean
};

const ConnectionPanel = ({
	jenkinsServers,
	setJenkinsServers,
	updatedServer,
	isUpdatingServer,
	uuidOfRefreshServer,
	handleRefreshUpdateServer,
	moduleKey,
	userIsAdmin
}: ConnectionPanelProps): JSX.Element => {
	const handleServerRefresh = (serverToRemove: JenkinsServer) => {
		const refreshedServers = jenkinsServers.filter(
			(server) => server.uuid !== serverToRemove.uuid
		);

		if (setJenkinsServers) {
			setJenkinsServers(refreshedServers);
		}
	};

	const screenEvent =
		moduleKey ===
		CONFIG_PAGE ? AnalyticsScreenEventsEnum.ServerNameScreenName : AnalyticsScreenEventsEnum.GlobalPageScreenName;

	useEffect(() => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			screenEvent,
			{
				numberOfServers: jenkinsServers.length,
				numberOfPendingServers: connectedStateCount(jenkinsServers, ConnectedState.PENDING),
				numberOfUpdateAvailableServers: connectedStateCount(jenkinsServers, ConnectedState.UPDATE_AVAILABLE),
				numberOfConnectedServers: connectedStateCount(jenkinsServers, ConnectedState.CONNECTED),
				numberOfDuplicateServers: connectedStateCount(jenkinsServers, ConnectedState.DUPLICATE)
			}
		);
	}, [jenkinsServers, screenEvent]);

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
								userIsAdmin={userIsAdmin}
							/>
							<ConnectionPanelMain
								jenkinsServer={server}
								refreshServers={handleServerRefresh}
								handleRefreshUpdateServer={handleRefreshUpdateServer}
								updatedServer={updatedServer}
								isUpdatingServer={isUpdatingServer}
								uuidOfRefreshServer={uuidOfRefreshServer}
								moduleKey={moduleKey}
								userIsAdmin={userIsAdmin}
							/>
						</div>
					);
				}
			)}
		</>
	);
};

export { ConnectionPanel };
