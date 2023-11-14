import React from 'react';
import { cx } from '@emotion/css';
import {
	connectionPanelHeaderContainer,
	connectionPanelTopContainer,
	ipAddress,
	serverName
} from './ConnectionPanel.styles';
import { StatusLabel } from '../StatusLabel/StatusLabel';

const ConnectionPanelTop = (): JSX.Element => {
	return (
		<div className={cx(connectionPanelTopContainer)}>
			<div className={cx(connectionPanelHeaderContainer)}>
				<h2 className={cx(serverName)}>Insert name</h2>
				<StatusLabel text="PENDING" color="#A54800" backgroundColor="#fff7d6" />
			</div>
			<div>
				<p className={cx(ipAddress)}>IP address: 10.0.0.1</p>
			</div>
		</div>
	);
};

export { ConnectionPanelTop };
