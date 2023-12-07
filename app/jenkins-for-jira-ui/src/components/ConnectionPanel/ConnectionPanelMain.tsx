import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import {
	connectionPanelMainContainer,
	connectionPanelMainConnectedTabs,
	connectionPanelMainNotConnectedTabs,
	setUpGuideContainer,
	setUpGuideUpdateAvailableContainer, connectionPanelMainConnectedPendingSetUp
} from './ConnectionPanel.styles';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { NotConnectedState } from './NotConnectedState';
import { JenkinsServer } from '../../../../src/common/types';
import { ConnectedJenkinsServers } from './ConnectedJenkinsServers';
import { SetUpGuide, UpdateAvailable } from './SetUpGuide';

type PanelProps = {
	children: ReactNode,
	connectedState?: ConnectedState,
	'data-testid'?: string
};

export const Panel = ({
	children,
	connectedState,
	'data-testid': testid
}: PanelProps) => {
	let className;

	if (testid === 'setUpGuidePanel') {
		className = setUpGuideContainer;
	} else if (connectedState === ConnectedState.CONNECTED) {
		className = connectionPanelMainConnectedTabs;
	} else {
		className = connectionPanelMainNotConnectedTabs;
	}
	return (
		<div className={cx(className)} data-testid={testid}>
			{children}
		</div>
	);
};

type ConnectionPanelMainProps = {
	connectedState: ConnectedState,
	jenkinsServer: JenkinsServer,
	refreshServers(serverToRemove: JenkinsServer): void
};

const ConnectionPanelMain = ({
	connectedState,
	jenkinsServer,
	refreshServers
}: ConnectionPanelMainProps): JSX.Element => {
	return (
		<div className={cx(connectionPanelMainContainer)}>
			{
				connectedState === ConnectedState.DUPLICATE
					? <NotConnectedState
						connectedState={connectedState}
						jenkinsServer={jenkinsServer}
						refreshServers={refreshServers}
					/>
					: <Tabs id="connection-panel-tabs">
						<TabList>
							{
								connectedState === ConnectedState.PENDING
									? <Tab>Recent events (0)</Tab>
									: <Tab>Recent events ({jenkinsServer.pipelines.length})</Tab>
							}
							{
								connectedState === ConnectedState.CONNECTED
									? <Tab>Set up guide</Tab>
									: <p className={cx(connectionPanelMainConnectedPendingSetUp)}>Set up guide</p>
							}
						</TabList>

						<TabPanel>
							{
								connectedState === ConnectedState.CONNECTED
									?	<Panel connectedState={connectedState} data-testid="connectedServersPanel">
										<ConnectedJenkinsServers connectedJenkinsServer={jenkinsServer} />
									</Panel>
									: <Panel data-testid="notConnectedPanel">
										<NotConnectedState
											connectedState={connectedState}
											jenkinsServer={jenkinsServer}
											refreshServers={refreshServers}
										/>
									</Panel>
							}
						</TabPanel>
						<TabPanel>
							{
								jenkinsServer.pluginConfig
									? <Panel data-testid="setUpGuidePanel">
										<SetUpGuide pluginConfig={jenkinsServer.pluginConfig}/>
									</Panel>
									: <Panel data-testid="updateAvailable">
										<div className={cx(setUpGuideUpdateAvailableContainer)}>
											<UpdateAvailable />
										</div>
									</Panel>
							}
						</TabPanel>
					</Tabs>
			}
		</div>
	);
};

export { ConnectionPanelMain };
