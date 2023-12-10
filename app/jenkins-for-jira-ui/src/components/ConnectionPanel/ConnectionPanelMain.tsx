import React, { ReactNode, useState } from 'react';
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
import { ConnectionPanelContent } from './ConnectionPanelContent';

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
	const [selectedTabIndex, setSelectedTabIndex] = useState(0);

	const handleClickSetupGuide = () => {
		setSelectedTabIndex(1);
	};

	const handleTabSelect = (index: number) => {
		setSelectedTabIndex(index);
	};

	const handleRefreshPanel = () => {
		// TODO - ARC-2738 refresh functionality
	};

	return (
		<div className={cx(connectionPanelMainContainer)}>
			{
				connectedState === ConnectedState.DUPLICATE
					? <NotConnectedState
						connectedState={connectedState}
						jenkinsServer={jenkinsServer}
						refreshServers={refreshServers}
						handleRefreshPanel={handleRefreshPanel}
					/>
					: <Tabs id="connection-panel-tabs" selected={selectedTabIndex} onChange={handleTabSelect}>
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
										{
											jenkinsServer.pipelines.length
												? <ConnectedJenkinsServers connectedJenkinsServer={jenkinsServer} />
												: <ConnectionPanelContent
													connectedState={connectedState}
													contentHeader="No data received"
													contentInstructionOne="This server is connected but hasn't sent any data to Jira yet."
													contentInstructionTwo="Use this server's set up guide to choose what data this server sends to Jira."
													buttonAppearance="primary"
													firstButtonLabel="Open set up guide"
													secondButtonLabel="Refresh"
													buttonOneOnClick={handleClickSetupGuide}
													buttonTwoOnClick={handleRefreshPanel}
												/>
										}
									</Panel>
									: <Panel data-testid="notConnectedPanel">
										<NotConnectedState
											connectedState={connectedState}
											jenkinsServer={jenkinsServer}
											refreshServers={refreshServers}
											handleRefreshPanel={handleRefreshPanel}
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
