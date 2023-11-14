import React from 'react';
import { cx } from '@emotion/css';
import {
	connectionPanelHeaderContainer,
	connectionPanelTopContainer,
	ipAddressStyle,
	serverName
} from './ConnectionPanel.styles';
import { ConnectedState, StatusLabel } from '../StatusLabel/StatusLabel';

type ConnectionPanelTopProps = {
	connectedState: ConnectedState,
	ipAddress: string
};

const connectedStateColors: Record<ConnectedState, { textColor: string; backgroundColor: string }> = {
	[ConnectedState.CONNECTED]: { textColor: '#206e4e', backgroundColor: '#dcfff1' },
	[ConnectedState.DUPLICATE]: { textColor: '#ae2e24', backgroundColor: '#ffecea' },
	[ConnectedState.PENDING]: { textColor: '#a54900', backgroundColor: '#fff7d6' }
};

const ConnectionPanelTop = ({ connectedState, ipAddress }: ConnectionPanelTopProps): JSX.Element => {
	const { textColor, backgroundColor } = connectedStateColors[connectedState];

	return (
		<div className={cx(connectionPanelTopContainer)}>
			<div className={cx(connectionPanelHeaderContainer)}>
				<h2 className={cx(serverName)}>Insert name</h2>
				<StatusLabel text={connectedState} color={textColor} backgroundColor={backgroundColor} />
			</div>
			<div>
				<p className={cx(ipAddressStyle)}>IP address: {ipAddress}</p>
			</div>
		</div>
	);
};

export { ConnectionPanelTop };
