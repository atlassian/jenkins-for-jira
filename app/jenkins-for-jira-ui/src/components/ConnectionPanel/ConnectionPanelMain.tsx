import React, { ReactNode } from 'react';
import { cx } from '@emotion/css';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { connectionPanelMainContainer, connectionPanelMainTabs } from './ConnectionPanel.styles';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { NotConnectedState } from './NotConnectedState';

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
	connectedState: ConnectedState
};

const ConnectionPanelMain = ({ connectedState }: ConnectionPanelMainProps): JSX.Element => {
	return (
		<div className={cx(connectionPanelMainContainer)}>
			{connectedState === ConnectedState.DUPLICATE
				? <NotConnectedState connectedState={connectedState} />
				: <Tabs
					id="default"
				>
					<TabList>
						<Tab>Recent events (0)</Tab>
						<Tab>Set up guide</Tab>
					</TabList>
					<TabPanel>
						{connectedState === ConnectedState.CONNECTED
							? <Panel>List of servers goes here</Panel>
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
