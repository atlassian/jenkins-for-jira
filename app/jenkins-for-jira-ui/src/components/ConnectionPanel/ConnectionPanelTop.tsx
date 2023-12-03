import React, { useEffect, useState } from 'react';
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
// import { disconnectJenkinsServer } from '../../api/disconnectJenkinsServer';
import { JenkinsModal } from '../JenkinsServerList/ConnectedServer/JenkinsModal';
import { DISCONNECT_MODAL_TEST_ID } from '../JenkinsServerList/ConnectedServer/ConnectedServers';
import { JenkinsServer } from '../../../../src/common/types';

type ConnectionPanelTopProps = {
	server: JenkinsServer,
	jenkinsServerList: JenkinsServer[],
	refreshServers(): void
};

const connectedStateColors: Record<ConnectedState, { textColor: string; backgroundColor: string }> = {
	[ConnectedState.CONNECTED]: { textColor: '#206e4e', backgroundColor: '#dcfff1' },
	[ConnectedState.DUPLICATE]: { textColor: '#ae2e24', backgroundColor: '#ffecea' },
	[ConnectedState.PENDING]: { textColor: '#a54900', backgroundColor: '#fff7d6' }
};

const ConnectionPanelTop = ({
	server,
	jenkinsServerList,
	refreshServers
}: ConnectionPanelTopProps): JSX.Element => {
	const connectedState = server.connectedState || ConnectedState.PENDING;
	const { textColor, backgroundColor } = connectedStateColors[connectedState];
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>([]);
	const [serverToDisconnect, setServerToDisconnect] = useState<JenkinsServer>();
	const [showConfirmServerDisconnect, setShowConfirmServerDisconnect] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setJenkinsServers(jenkinsServerList);
	}, [jenkinsServerList]);

	const onClickDisconnect = async (serverToDelete: JenkinsServer) => {
		console.log('cLikcing');
		setServerToDisconnect(serverToDelete);
		setShowConfirmServerDisconnect(true);
	};

	const disconnectJenkinsServerHandler = async (
		serverToDelete: JenkinsServer
	) => {
		setIsLoading(true);

		try {
			// await disconnectJenkinsServer(serverToDelete.uuid);
		} catch (e) {
			console.log('Failed to disconnect server', e);
		}

		const updatedServerList = jenkinsServers.filter(
			(jenkinsServer: JenkinsServer) => jenkinsServer.uuid !== serverToDelete.uuid
		);
		setJenkinsServers(updatedServerList);

		if (updatedServerList.length === 0) {
			refreshServers();
		}

		closeConfirmServerDisconnect();
	};

	const closeConfirmServerDisconnect = async () => {
		setShowConfirmServerDisconnect(false);
		setIsLoading(false);
	};

	return (
		<div className={cx(connectionPanelTopContainer)}>
			<div className={cx(connectionPanelHeaderContainer)}>
				<div className={cx(connectionPanelHeaderContentContainer)}>
					<h2 className={cx(serverName)}>{server.name}</h2>
					<StatusLabel text={connectedState} color={textColor} backgroundColor={backgroundColor} />
				</div>
				<div>
					{
						server.pluginConfig?.ipAddress &&
							<p className={cx(ipAddressStyle)}>IP address: {server.pluginConfig?.ipAddress}</p>
					}
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
					{/* TODO: add onClick (will be done when I build the server name screen) */}
					<DropdownItem>Rename</DropdownItem>
					{/* TODO: add onClick - will be done when I build the new set up jenkins screen */}
					<DropdownItem>Connection settings</DropdownItem>
					<DropdownItem onClick={() => onClickDisconnect(server)}>Disconnect</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>

			<JenkinsModal
				dataTestId={DISCONNECT_MODAL_TEST_ID}
				server={serverToDisconnect}
				show={showConfirmServerDisconnect}
				modalAppearance='warning'
				title='Disconnect this Jenkins server?'
				body={[
					'Are you sure that you want to disconnect your Jenkins server, ',
					<strong>{serverToDisconnect?.name}</strong>,
					'? This means that you disconnect all associated Jenkins jobs, and will have to add a new server in Jira if you ever want to reconnect.'
				]}
				onClose={closeConfirmServerDisconnect}
				primaryButtonAppearance='subtle'
				primaryButtonLabel='Cancel'
				secondaryButtonAppearance='warning'
				secondaryButtonLabel='Disconnect'
				secondaryButtonOnClick={disconnectJenkinsServerHandler}
				isLoading={isLoading}
			/>
		</div>
	);
};

export { ConnectionPanelTop };
