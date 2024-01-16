import React, { ReactNode, useState } from 'react';
import { cx } from '@emotion/css';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import Spinner from '@atlaskit/spinner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import {
	connectionPanelMainConnectedPendingSetUp,
	connectionPanelMainConnectedTabs,
	connectionPanelMainContainer,
	connectionPanelMainNotConnectedTabs,
	setUpGuideContainer,
	setUpGuideUpdateAvailableContainer,
	setUpGuideUpdateAvailableLoadingContainer
} from './ConnectionPanel.styles';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { NotConnectedState } from './NotConnectedState';
import { JenkinsServer } from '../../../../src/common/types';
import { ConnectedJenkinsServers } from './ConnectedJenkinsServers';
import { SetUpGuide, UpdateAvailable } from './SetUpGuide';
import { ConnectionPanelContent } from './ConnectionPanelContent';
import { getJenkinsServerWithSecret } from '../../api/getJenkinsServerWithSecret';
import {AnalyticsClient} from "../../common/analytics/analytics-client";
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from "../../common/analytics/analytics-events";

const analyticsClient = new AnalyticsClient();

type PanelProps = {
	children: ReactNode,
	connectedState?: ConnectedState,
	'data-testid'?: string
};

export const Panel = ({
	children,
	connectedState,
	'data-testid': testid
}: PanelProps) => {
	let className;

	if (testid === 'setUpGuidePanel') {
		className = setUpGuideContainer;
	} else if (connectedState === ConnectedState.CONNECTED || connectedState === ConnectedState.UPDATE_AVAILABLE) {
		className = connectionPanelMainConnectedTabs;
	} else {
		className = connectionPanelMainNotConnectedTabs;
	}
	return (
		<div className={cx(className)} data-testid={testid}>
			{children}
		</div>
	);
};

type ConnectionPanelMainProps = {
	jenkinsServer: JenkinsServer,
	refreshServers(serverToRefresh: JenkinsServer): void
	handleRefreshUpdateServer(serverUuidToUpdateUuid: string): void,
	updatedServer?: JenkinsServer,
	isUpdatingServer: boolean,
	uuidOfRefreshServer?: string,
};

const ConnectionPanelMain = ({
	jenkinsServer,
	refreshServers,
	handleRefreshUpdateServer,
	updatedServer,
	isUpdatingServer,
	uuidOfRefreshServer
}: ConnectionPanelMainProps): JSX.Element => {
	const connectedState = jenkinsServer.connectedState || ConnectedState.PENDING;
	const [selectedTabIndex, setSelectedTabIndex] = useState(0);
	const [isCheckingPipelineData, setIsCheckingPipelineData] = useState<boolean>(false);
	const [serverWithUpdatedPipelines, setServerWithUpdatedPipelines] = useState<JenkinsServer>(jenkinsServer);

	const handleClickSetupGuide = () => {
		setSelectedTabIndex(1);
	};

	const handleTabSelect = async (index: number) => {
		if (index === 1) {
			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.UiEvent,
				AnalyticsUiEventsEnum.SetUpGuideName,
				{
					// TODO ARC-2648 set this with moduleKey
					source: AnalyticsScreenEventsEnum.ServerManagementScreenName
				}
			);
		}

		setSelectedTabIndex(index);
	};

	const handleRefreshToCheckServerPipelines = async (uuid: string) => {
		setIsCheckingPipelineData(true);

		try {
			const refreshedServer = await getJenkinsServerWithSecret(uuid);
			setServerWithUpdatedPipelines(refreshedServer);
			setIsCheckingPipelineData(false);
		} catch (e) {
			console.error('No Jenkins server found.');
		}
	};

	let setUpGuideUpdateAvailableContent;

	if (isUpdatingServer && uuidOfRefreshServer === jenkinsServer.uuid) {
		setUpGuideUpdateAvailableContent = (
			<Panel data-testid="updateAvailable">
				<div className={cx(setUpGuideUpdateAvailableLoadingContainer)}>
					<Spinner size='large' />
				</div>
			</Panel>
		);
	} else if (jenkinsServer.pluginConfig || updatedServer?.pluginConfig) {
		setUpGuideUpdateAvailableContent = (
			<Panel data-testid="setUpGuidePanel">
				<SetUpGuide pluginConfig={jenkinsServer.pluginConfig} />
			</Panel>
		);
	} else {
		setUpGuideUpdateAvailableContent = (
			<Panel data-testid="updateAvailable">
				<div className={cx(setUpGuideUpdateAvailableContainer)}>
					<UpdateAvailable
						refreshServerAfterUpdate={handleRefreshUpdateServer}
						serverUuid={jenkinsServer.uuid}
					/>
				</div>
			</Panel>
		);
	}

	let connectionPanelConnectedContent;

	if (isCheckingPipelineData) {
		connectionPanelConnectedContent = (
			<Panel data-testid="connectedServer">
				<div className={cx(setUpGuideUpdateAvailableLoadingContainer)}>
					<Spinner size='large' />
				</div>
			</Panel>
		);
	} else {
		connectionPanelConnectedContent = (
			<ConnectionPanelContent
				connectedState={connectedState}
				contentHeader="No data received"
				contentInstructionOne="This server is connected but hasn't sent any data to Jira yet."
				contentInstructionTwo="Use this server's set up guide to choose what data this server sends to Jira."
				buttonAppearance="primary"
				firstButtonLabel="Open set up guide"
				secondButtonLabel="Refresh"
				buttonOneOnClick={handleClickSetupGuide}
				buttonTwoOnClick={handleRefreshToCheckServerPipelines}
				jenkinsServerUuid={jenkinsServer.uuid}
			/>
		);
	}

	return (
		<div className={cx(connectionPanelMainContainer)}>
			{
				connectedState === ConnectedState.DUPLICATE
					? <NotConnectedState
						connectedState={connectedState}
						jenkinsServer={jenkinsServer}
						refreshServersAfterDelete={refreshServers}
						refreshServersAfterUpdate={handleRefreshUpdateServer}
					/>
					: <Tabs id="connection-panel-tabs" selected={selectedTabIndex} onChange={handleTabSelect}>
						<TabList>
							{
								connectedState === ConnectedState.PENDING
									? <Tab>Recent events (0)</Tab>
									: <Tab>Recent events ({jenkinsServer.pipelines.length})</Tab>
							}
							{
								connectedState === ConnectedState.CONNECTED ||
								connectedState === ConnectedState.UPDATE_AVAILABLE
									? <Tab>
										{
											!updatedServer && connectedState === ConnectedState.UPDATE_AVAILABLE
												? <WarningIcon label="plugin outdated" size="small" />
												: <></>
										}
										Set up guide
									</Tab>
									: <p className={cx(connectionPanelMainConnectedPendingSetUp)}>Set up guide</p>
							}
						</TabList>

						<TabPanel>
							{
								connectedState === ConnectedState.CONNECTED ||
								connectedState === ConnectedState.UPDATE_AVAILABLE
									?	<Panel connectedState={connectedState} data-testid="connectedServersPanel">
										{
											serverWithUpdatedPipelines.pipelines.length ||
											jenkinsServer.pipelines.length
												? <ConnectedJenkinsServers connectedJenkinsServer={jenkinsServer} />
												: <>{connectionPanelConnectedContent}</>
										}
									</Panel>
									: <Panel data-testid="notConnectedPanel">
										<NotConnectedState
											connectedState={connectedState}
											jenkinsServer={jenkinsServer}
											refreshServersAfterDelete={refreshServers}
											refreshServersAfterUpdate={handleRefreshUpdateServer}
											uuidOfRefreshServer={uuidOfRefreshServer}
											isUpdatingServer={isUpdatingServer}
										/>
									</Panel>
							}
						</TabPanel>
						<TabPanel>{setUpGuideUpdateAvailableContent}</TabPanel>
					</Tabs>
			}
		</div>
	);
};

export { ConnectionPanelMain };
