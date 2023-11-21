import React from 'react';
import { cx } from '@emotion/css';
import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import {
	connectionPanelHeaderContainer,
	connectionPanelHeaderContentContainer,
	connectionPanelTopContainer,
	ipAddressStyle,
	serverName
} from './ConnectionPanel.styles';
import { ConnectedState, StatusLabel } from '../StatusLabel/StatusLabel';

type ConnectionPanelTopProps = {
	connectedState: ConnectedState,
	ipAddress: string,
	name: string
};

const connectedStateColors: Record<ConnectedState, { textColor: string; backgroundColor: string }> = {
	[ConnectedState.CONNECTED]: { textColor: '#206e4e', backgroundColor: '#dcfff1' },
	[ConnectedState.DUPLICATE]: { textColor: '#ae2e24', backgroundColor: '#ffecea' },
	[ConnectedState.PENDING]: { textColor: '#a54900', backgroundColor: '#fff7d6' }
};

const ConnectionPanelTop = ({ connectedState, ipAddress, name }: ConnectionPanelTopProps): JSX.Element => {
	const { textColor, backgroundColor } = connectedStateColors[connectedState];

	return (
		<div className={cx(connectionPanelTopContainer)}>
			<div className={cx(connectionPanelHeaderContainer)}>
				<div className={cx(connectionPanelHeaderContentContainer)}>
					<h2 className={cx(serverName)}>{name}</h2>
					<StatusLabel text={connectedState} color={textColor} backgroundColor={backgroundColor} />
				</div>
				<div>
					<p className={cx(ipAddressStyle)}>IP address: {ipAddress}</p>
				</div>
			</div>
			<DropdownMenu
				trigger={({ triggerRef, ...props }) => (
					<Button
						{...props}
						iconBefore={<MoreIcon label="more" />}
						ref={triggerRef}
					/>
				)}
			>
				<DropdownItemGroup>
					{/* TODO: add onClick for all dropdown items */}
					<DropdownItem>Rename</DropdownItem>
					<DropdownItem>Connection settings</DropdownItem>
					<DropdownItem>Disconnect</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
		</div>
	);
};

export { ConnectionPanelTop };
