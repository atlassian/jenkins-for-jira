import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { cx } from '@emotion/css';
import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { router } from '@forge/bridge';
import {
	connectionPanelHeaderContainer,
	connectionPanelHeaderContentContainer,
	connectionPanelTopContainer,
	ipAddressStyle,
	serverName
} from './ConnectionPanel.styles';
import { ConnectedState, StatusLabel } from '../StatusLabel/StatusLabel';
import { disconnectJenkinsServer } from '../../api/disconnectJenkinsServer';
import { JenkinsModal } from '../JenkinsServerList/ConnectedServer/JenkinsModal';
import { JenkinsServer } from '../../../../src/common/types';
import { CONFIG_PAGE, DISCONNECT_MODAL_TEST_ID } from '../../common/constants';
import {
	AnalyticsEventTypes,
	AnalyticsTrackEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import { fetchGlobalPageUrl } from '../../api/fetchGlobalPageUrl';

const analyticsClient = new AnalyticsClient();

const connectedStateColors: Record<ConnectedState, { textColor: string; backgroundColor: string }> = {
	[ConnectedState.CONNECTED]: { textColor: '#206e4e', backgroundColor: '#dcfff1' },
	[ConnectedState.DUPLICATE]: { textColor: '#ae2e24', backgroundColor: '#ffecea' },
	[ConnectedState.PENDING]: { textColor: '#a54900', backgroundColor: '#fff7d6' },
	[ConnectedState.UPDATE_AVAILABLE]: { textColor: '#0054cb', backgroundColor: '#e8f2ff' }
};

type ConnectionPanelTopProps = {
	server: JenkinsServer,
	refreshServers(serverToRemove: JenkinsServer): void,
	updatedServer?: JenkinsServer,
	isUpdatingServer: boolean,
	moduleKey: string,
	userIsAdmin?: boolean
};
const ConnectionPanelTop = ({
	server,
	refreshServers,
	moduleKey,
	userIsAdmin
}: ConnectionPanelTopProps): JSX.Element => {
	const history = useHistory();
	const connectedState = server.connectedState || ConnectedState.PENDING;
	const { textColor, backgroundColor } = connectedStateColors[connectedState];
	const [serverToDisconnect, setServerToDisconnect] = useState<JenkinsServer>();
	const [showConfirmServerDisconnect, setShowConfirmServerDisconnect] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [disconnectError, setDisconnectError] = useState<boolean>(false);
	const [globalPageUrl, setGlobalPageUrl] = useState<string>('');
	const isAdminPage = moduleKey === CONFIG_PAGE;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const url = await fetchGlobalPageUrl();
				setGlobalPageUrl(url);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	const onClickDisconnect = async (serverToDelete: JenkinsServer) => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.DisconnectServerName,
			{
				action: `clicked - ${AnalyticsUiEventsEnum.DisconnectServerName}`,
				actionSubject: 'button'
			}
		);

		setServerToDisconnect(serverToDelete);
		setShowConfirmServerDisconnect(true);
	};

	const onClickConnectionSettings = async (serverToOpen: JenkinsServer) => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.ConnectionSettingsName,
			{
				action: `clicked - ${AnalyticsUiEventsEnum.ConnectionSettingsName}`,
				actionSubject: 'button'
			}
		);

		const connectionSettingsPath = `/setup/${serverToOpen.uuid}/connection-settings/admin`;

		if (isAdminPage) {
			history.push(connectionSettingsPath);
		} else {
			router.navigate(`${globalPageUrl}${connectionSettingsPath}`);
		}
	};

	const onClickRename = async (serverToRename: JenkinsServer) => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.RenameServerName,
			{
				action: `clicked - ${AnalyticsUiEventsEnum.RenameServerName}`,
				actionSubject: 'button'
			}
		);

		const updateServerNamePath = `/update-server-name/${serverToRename.uuid}/admin`;

		if (isAdminPage) {
			history.push(updateServerNamePath);
		} else {
			router.navigate(`${globalPageUrl}${updateServerNamePath}`);
		}
	};

	const disconnectJenkinsServerHandler = async (
		serverToDelete: JenkinsServer
	) => {
		setDisconnectError(false);
		setIsLoading(true);

		try {
			await disconnectJenkinsServer(serverToDelete.uuid);
			refreshServers(serverToDelete);
			closeConfirmServerDisconnect();

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.DisconnectServerSuccessName,
				{
					action: `submitted ${AnalyticsTrackEventsEnum.DisconnectServerSuccessName}`,
					actionSubject: 'form'
				}
			);
		} catch (e) {
			console.log('Failed to disconnect server', e);
			setDisconnectError(true);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.DisconnectServerFailureName,
				{
					action: `submitted ${AnalyticsTrackEventsEnum.DisconnectServerFailureName}`,
					actionSubject: 'form'
				}
			);
		} finally {
			setIsLoading(false);
		}
	};

	const closeConfirmServerDisconnect = async () => {
		setShowConfirmServerDisconnect(false);
		setIsLoading(false);
	};

	const serverIsNotDuplicate = server.connectedState !== ConnectedState.DUPLICATE;
	const isConfigPage = userIsAdmin || (moduleKey && moduleKey === CONFIG_PAGE);

	const buttonAndIconAppearance = disconnectError ? 'danger' : 'warning';
	const modalTitleMessage =
		disconnectError ? 'An error occurred while deleting your server' : 'Disconnect this Jenkins server?';
	const modalBodyMessage = disconnectError ? [
		'Something went wrong while disconnecting ',
		<strong>{serverToDisconnect?.name}</strong>,
		', please try again.'
	] : [
		'Are you sure that you want to disconnect your Jenkins server, ',
		<strong>{serverToDisconnect?.name}</strong>,
		'? This means that you disconnect all associated Jenkins jobs, and will have to add a new server in Jira if you ever want to reconnect.'
	];
	const secondaryButtonLabel = disconnectError ? 'Try again' : 'Disconnect';

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

			{serverIsNotDuplicate && isConfigPage &&
				<DropdownMenu
					trigger={({ triggerRef, ...props }) => (
						<Button
							{...props}
							iconBefore={<MoreIcon label="more" />}
							ref={triggerRef}
							testId={`dropdown-menu-${server.name}`}
						/>
					)}
				>
					<DropdownItemGroup>
						<DropdownItem onClick={() => onClickRename(server)}>Rename</DropdownItem>
						<DropdownItem onClick={() => onClickConnectionSettings(server)}>
							Connection settings
						</DropdownItem>
						<DropdownItem onClick={() => onClickDisconnect(server)}>Disconnect</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			}
			{
				showConfirmServerDisconnect && <JenkinsModal
					dataTestId={DISCONNECT_MODAL_TEST_ID}
					server={serverToDisconnect}
					modalAppearance={buttonAndIconAppearance}
					title={modalTitleMessage}
					body={modalBodyMessage}
					onClose={closeConfirmServerDisconnect}
					primaryButtonAppearance='subtle'
					primaryButtonLabel='Cancel'
					secondaryButtonAppearance={buttonAndIconAppearance}
					secondaryButtonLabel={secondaryButtonLabel}
					secondaryButtonOnClick={disconnectJenkinsServerHandler}
					isLoading={isLoading}
				/>
			}
		</div>
	);
};

export { ConnectionPanelTop };
