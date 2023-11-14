import React, { useEffect, useState } from 'react';
import { cx } from '@emotion/css';
import { ConnectionPanelMain } from './ConnectionPanelMain';
import { ConnectionPanelTop } from './ConnectionPanelTop';
import { connectionPanelContainer } from './ConnectionPanel.styles';
import { ConnectedState } from '../StatusLabel/StatusLabel';

const ConnectionPanel = (): JSX.Element => {
	// TODO - remove temp state and define pending/duplicate/connected state from data
	const [connectedState, setConnectState] = useState<ConnectedState>(ConnectedState.PENDING);

	useEffect(() => {
		// TODO - update this based on data
		setConnectState(ConnectedState.DUPLICATE);
	}, []);

	return (
		<div className={cx(connectionPanelContainer)}>
			<ConnectionPanelTop connectedState={connectedState} ipAddress="10.10.0.10"/>
			<ConnectionPanelMain />
		</div>
	);
};

export { ConnectionPanel };
