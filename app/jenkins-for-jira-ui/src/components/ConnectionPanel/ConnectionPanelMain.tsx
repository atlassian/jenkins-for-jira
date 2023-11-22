import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { connectionPanelMainContainer, connectionPanelMainTabs, setUpGuideContainer } from './ConnectionPanel.styles';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { NotConnectedState } from './NotConnectedState';
import { SetUpGuide } from './SetUpGuide';

export const Panel = ({
	children,
	'data-testid': testid
}: {
	children: ReactNode;
	'data-testid'?: string;
}) => (
	<div className={cx(testid === 'setUpGuidePanel'
		? setUpGuideContainer : connectionPanelMainTabs)} data-testid={testid }>
		{children}
	</div>
);

type ConnectionPanelMainProps = {
	connectedState: ConnectedState
};

const ConnectionPanelMain = ({ connectedState }: ConnectionPanelMainProps): JSX.Element => {
	return (
		<div className={cx(connectionPanelMainContainer)}>
			{
				connectedState === ConnectedState.DUPLICATE
					? <NotConnectedState connectedState={connectedState} />
					: <Tabs id="connection-panel-tabs">
						<TabList>
							{/* TODO - update (0) for connected state */}
							<Tab>Recent events (0)</Tab>
							<Tab>Set up guide</Tab>
						</TabList>
						<TabPanel>
							{
								connectedState === ConnectedState.CONNECTED
									? <Panel data-testid="connectedServersPanel">List of servers goes here</Panel>
									: <Panel data-testid="notConnectedPanel"><NotConnectedState connectedState={connectedState} /></Panel>
							}
						</TabPanel>
						<TabPanel>
							<Panel data-testid="setUpGuidePanel">
								<SetUpGuide />
							</Panel>
						</TabPanel>
					</Tabs>
			}
		</div>
	);
};

export { ConnectionPanelMain };
