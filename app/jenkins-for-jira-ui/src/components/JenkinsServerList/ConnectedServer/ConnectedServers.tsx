import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import DynamicTable from '@atlaskit/dynamic-table';
import Avatar from '@atlaskit/avatar';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import Button from '@atlaskit/button';
import DropdownMenu, {
	DropdownItem,
	DropdownItemGroup
} from '@atlaskit/dropdown-menu';
import RecentIcon from '@atlaskit/icon/glyph/recent';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import moment from 'moment';

import { StyledButtonContainerConnectedServers } from '../../ConnectJenkins/ConnectJenkins.styles';
import { JenkinsIcon } from '../../icons/JenkinsIcon';
import {
	StyledConnectedServerTableHeaderTitleContainer,
	StyledConnectedServerTableCellIconContainer,
	StyledConnectedServerTableHeaderContainer,
	StyledConnectedServerTableContainer,
	StyledConnectedServerTableHeaderTitle, waitingForDeploymentText
} from './ConnectedServers.styles';
import {
	StyledConnectedServerContainer,
	StyledConnectedServerLatestEventIconContainer,
	StyledConnectedServerTableCellContainer,
	StyledConnectedServerTableCellDescription,
	StyledConnectedServerTableCellDescriptionEvent
} from './ConnectedServers.styles';
import { JenkinsPipeline, JenkinsServer } from '../../../../../src/common/types';
import { disconnectJenkinsServer } from '../../../api/disconnectJenkinsServer';
import { JenkinsModal } from './JenkinsModal';
import { InProgressIcon } from '../../icons/InProgressIcon';
import { FailedIcon } from '../../icons/FailedIcon';
import { RolledBackIcon } from '../../icons/RolledBackIcon';
import { CancelledIcon } from '../../icons/CancelledIcon';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../../common/analytics/analytics-client';

export const mapLastEventStatus = (
	lastEventStatus: string
): JenkinsPipeline | string => {
	switch (lastEventStatus) {
		case 'in_progress':
			return 'in-progress';
		case 'rolled_back':
			return 'rolled back';
		case 'cancelled':
			return 'canceled';
		default:
			return lastEventStatus;
	}
};

export const mapLastEventStatusIcons = (lastEventStatus: string): JSX.Element => {
	switch (lastEventStatus) {
		case 'in_progress':
			return <InProgressIcon />;
		case 'failed':
			return <FailedIcon />;
		case 'rolled_back':
			return <RolledBackIcon />;
		case 'pending':
			return (
				<RecentIcon
					label='Event pending'
					primaryColor='#0065FF'
					size='medium'
				/>
			);
		case 'cancelled':
			return <CancelledIcon />;
		case 'unknown':
			return (
				<QuestionCircleIcon
					label='Event unknown'
					primaryColor='#6B778C'
					size='medium'
				/>
			);
		default:
			return (
				<CheckCircleIcon
					label='Event successful'
					primaryColor='#36B27E'
					size='medium'
				/>
			);
	}
};

type ConnectedServersTableProps = {
	jenkinsServerList: JenkinsServer[],
	refreshServers(): void
};

type ConnectedServersProps = {
	jenkinsServerList: JenkinsServer[],
	refreshServers(): void
};

const ConnectedServersTable = ({ jenkinsServerList, refreshServers }: ConnectedServersTableProps): JSX.Element => {
	const history = useHistory();

	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>([]);
	const [serverToDisconnect, setServerToDisconnect] = useState<JenkinsServer>();
	const [showConfirmServerDisconnect, setShowConfirmServerDisconnect] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const analyticsClient = new AnalyticsClient();
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName
		);

		setJenkinsServers(jenkinsServerList);
	}, [jenkinsServerList]);

	const onClickManage = async (jenkinsServerUuid: string, serverName: string) => {
		const analyticsClient = new AnalyticsClient();
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.ManageConnectionConfiguredStateName,
			{
				source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName,
				action: 'clickedManageConnectionConfiguredState',
				actionSubject: 'button',
				serverName
			}
		);

		history.push(`/manage/${jenkinsServerUuid}`);
	};

	const onClickPendingDeployment = async (jenkinsServerUuid: string) => {
		const analyticsClient = new AnalyticsClient();
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.PendingDeploymentConfiguredStateName,
			{
				source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName,
				actionSubject: 'button'
			}
		);

		history.push(`/pending/${jenkinsServerUuid}`);
	};

	const onClickDisconnect = async (serverToDelete: JenkinsServer) => {
		setServerToDisconnect(serverToDelete);
		setShowConfirmServerDisconnect(true);

		const analyticsClient = new AnalyticsClient();
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.DisconnectServerConfiguredStateName,
			{
				source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName,
				actionSubject: 'button'
			}
		);
	};

	const disconnectJenkinsServerHandler = async (
		serverToDelete: JenkinsServer
	) => {
		const analyticsClient = new AnalyticsClient();
		setIsLoading(true);
		await disconnectJenkinsServer(serverToDelete.uuid);
		const updatedServerList = jenkinsServers.filter(
			(server) => server.uuid !== serverToDelete.uuid
		);
		setJenkinsServers(updatedServerList);

		if (updatedServerList.length === 0) {
			refreshServers();
		}

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.DisconnectServerConfirmConfiguredStateName,
			{
				source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName,
				action: 'clickedDisconnectServer',
				actionSubject: 'button'
			}
		);

		closeConfirmServerDisconnect();
	};

	const closeConfirmServerDisconnect = async () => {
		setShowConfirmServerDisconnect(false);
		setIsLoading(false);

		const analyticsClient = new AnalyticsClient();

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.DisconnectServerModalClosedConfiguredStateName,
			{
				source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName,
				action: 'clickedCancelOrDisconnectedServer',
				actionSubject: 'button'
			}
		);
	};

	const tableHead = (pipelines: JenkinsPipeline[]) => {
		const pipelineCount = pipelines?.length > 0 ? pipelines?.length : 0;
		return {
			cells: [
				{
					key: 'job',
					content: `Last ${pipelineCount} active pipelines`
				},
				{
					key: 'event',
					content: 'Last event'
				},
				{
					key: 'time',
					content: 'Event time'
				}
			]
		};
	};

	const rows = (serverName: string, serverId: string, pipelines: JenkinsPipeline[] = []) => {
		if (!pipelines.length) {
			return [{
				cells: [
					{
						key: 'job',
						content: (
							<span className={waitingForDeploymentText}>
								<Button appearance="subtle-link" onClick={() =>
									onClickPendingDeployment(serverId)
								}>
									Waiting for build or deployment event
								</Button>
							</span>
						)
					},
					{
						key: 'event',
						content: ('')
					},
					{
						key: 'time',
						content: ('')
					}
				]
			}];
		}

		return (
			pipelines.map((pipeline) => ({
				cells: [
					{
						key: 'job',
						content: (
							<StyledConnectedServerTableCellContainer>
								<StyledConnectedServerTableCellIconContainer>
									<Avatar
										name='Server avatar'
										size='medium'
										appearance='square'
									/>
								</StyledConnectedServerTableCellIconContainer>
								<StyledConnectedServerTableCellDescription>
									{pipeline.name}
								</StyledConnectedServerTableCellDescription>
							</StyledConnectedServerTableCellContainer>
						)
					},
					{
						key: 'event',
						content: (
							<StyledConnectedServerTableCellContainer>
								<>
									<StyledConnectedServerLatestEventIconContainer>
										{mapLastEventStatusIcons(pipeline.lastEventStatus)}
									</StyledConnectedServerLatestEventIconContainer>
								</>
								<StyledConnectedServerTableCellDescriptionEvent>
									{mapLastEventStatus(pipeline.lastEventStatus)} {pipeline.lastEventType}
								</StyledConnectedServerTableCellDescriptionEvent>
							</StyledConnectedServerTableCellContainer>
						)
					},
					{
						key: 'time',
						content: (
							<StyledConnectedServerTableCellContainer>
								<StyledConnectedServerTableCellDescriptionEvent>
									Received {moment(new Date(pipeline.lastEventDate)).format('hh:mma, Do MMMM YYYY')}
								</StyledConnectedServerTableCellDescriptionEvent>
							</StyledConnectedServerTableCellContainer>
						)
					}
				]
			}))
		);
	};

	return (
		<>
			{jenkinsServers.map(
				(server, index): JSX.Element => (
					<StyledConnectedServerTableContainer {...server} key={index}>
						<StyledConnectedServerTableHeaderContainer>
							<StyledConnectedServerTableHeaderTitleContainer>
								<JenkinsIcon />
								<StyledConnectedServerTableHeaderTitle>
									{server.name}
								</StyledConnectedServerTableHeaderTitle>
							</StyledConnectedServerTableHeaderTitleContainer>

							<StyledButtonContainerConnectedServers>
								<Button onClick={() => onClickManage(server.uuid, server.name)}>
									Manage connection
								</Button>
								<DropdownMenu testId="action-drop-down">
									<DropdownItemGroup>
										<DropdownItem onClick={() => onClickDisconnect(server)} testId="disconnect-jenkins-server-item">
											Disconnect Jenkins server
										</DropdownItem>
									</DropdownItemGroup>
								</DropdownMenu>
							</StyledButtonContainerConnectedServers>
						</StyledConnectedServerTableHeaderContainer><DynamicTable
							head={tableHead(server.pipelines)}
							rows={rows(server.name, server.uuid, server.pipelines)}
							loadingSpinnerSize='large'
						/>
					</StyledConnectedServerTableContainer>
				)
			)}
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
		</>
	);
};

const ConnectedServers = ({ jenkinsServerList, refreshServers }: ConnectedServersProps): JSX.Element => {
	return (
		<StyledConnectedServerContainer aria-label='connected Jenkins servers'>
			<h3>Connected Jenkins servers</h3>

			<ConnectedServersTable jenkinsServerList={jenkinsServerList} refreshServers={refreshServers} />
		</StyledConnectedServerContainer>
	);
};

export const DISCONNECT_MODAL_TEST_ID = 'disconnectModal';

export {
	ConnectedServers
};
