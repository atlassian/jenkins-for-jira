import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import {
	connectionPanelMainContainer,
	connectionPanelMainConnectedTabs,
	connectionPanelMainNotConnectedTabs, setUpGuideContainer
} from './ConnectionPanel.styles';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { NotConnectedState } from './NotConnectedState';
import { JenkinsServer } from '../../../../src/common/types';
import { ConnectedJenkinsServers } from './ConnectedJenkinsServers';
import { SetUpGuide } from './SetUpGuide';

// TODO - remove ? for children and connectedState once set up guide is merged
type PanelProps = {
	children?: ReactNode,
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
	jenkinsServer: JenkinsServer
};

const ConnectionPanelMain = ({ connectedState, jenkinsServer }: ConnectionPanelMainProps): JSX.Element => {
	return (
		<div className={cx(connectionPanelMainContainer)}>
			{
				connectedState === ConnectedState.DUPLICATE
					? <NotConnectedState connectedState={connectedState} />
					: <Tabs id="connection-panel-tabs">
						<TabList>
							{
								connectedState === ConnectedState.PENDING
									? <Tab>Recent events (0)</Tab>
									: <Tab>Recent events ({jenkinsServer.pipelines.length})</Tab>
							}
							<Tab>Set up guide</Tab>
						</TabList>

						<TabPanel>
							{
								connectedState === ConnectedState.CONNECTED
									?	<Panel connectedState={connectedState} testId="connectedServersPanel">
										<ConnectedJenkinsServers connectedJenkinsServer={jenkinsServer} />
									</Panel>
									: <Panel testId="notConnectedPanel"><NotConnectedState connectedState={connectedState} /></Panel>
							}
						</TabPanel>
						<TabPanel>
							<Panel testId="setUpGuidePanel">
								<SetUpGuide />
							</Panel>
						</TabPanel>
					</Tabs>
			}
		</div>
	);
};

export { ConnectionPanelMain };
