import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { connectionPanelMainContainer, connectionPanelMainTabs } from './ConnectionPanel.styles';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { NotConnectedState } from './NotConnectedState';
import { JenkinsServer } from '../../../../src/common/types';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { ConnectedJenkinsServers } from './ConnectedJenkinsServers';

export const Panel = ({
	children,
	testId
}: {
	children: ReactNode;
	testId?: string;
}) => (
	<div className={cx(connectionPanelMainTabs)} data-testid={testId}>
		{children}
	</div>
);

type ConnectionPanelMainProps = {
	connectedState: ConnectedState,
	jenkinsServers: JenkinsServer[]
};

const ConnectionPanelMain = ({ connectedState, jenkinsServers }: ConnectionPanelMainProps): JSX.Element => {
	if (!jenkinsServers) {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	// TODO - update each server item to include CONNECTED, DUPLICATE, PENDING states
	return (
		<div className={cx(connectionPanelMainContainer)}>
			{
				connectedState === ConnectedState.DUPLICATE
					? <NotConnectedState connectedState={connectedState} />
					: <Tabs id="connection-panel-tabs">
						<TabList>
							{/* TODO - update (0) for connected state */}
							{
								connectedState === ConnectedState.PENDING
									? <Tab>Recent events (0)</Tab>
									: <Tab>Recent events (12)</Tab>
							}
							<Tab>Set up guide</Tab>
						</TabList>
						<TabPanel>
							{
								connectedState === ConnectedState.CONNECTED
									?	<Panel>
										<ConnectedJenkinsServers connectedJenkinsServers={jenkinsServers} />
									</Panel>
									: <Panel><NotConnectedState connectedState={connectedState} /></Panel>
							}
						</TabPanel>
						<TabPanel>
							<Panel>Set up guide info to go here</Panel>
						</TabPanel>
					</Tabs>
			}
		</div>
	);
};

export { ConnectionPanelMain };
