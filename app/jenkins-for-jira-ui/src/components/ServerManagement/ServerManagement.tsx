import React, {
	ReactElement,
	useCallback, useEffect, useState
} from 'react';
import PageHeader from '@atlaskit/page-header';
import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import { useHistory } from 'react-router';
import { isEqual } from 'lodash';
import { headerContainer } from '../JenkinsServerList/JenkinsServerList.styles';
import { serverManagementContainer } from './ServerManagement.styles';
import { addConnectedState, ConnectionPanel } from '../ConnectionPanel/ConnectionPanel';
import { TopPanel } from './TopPanel/TopPanel';
import { JenkinsServer } from '../../../../src/common/types';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { redirectFromGetStarted } from '../../api/redirectFromGetStarted';
import { ConnectionWizard } from '../ConnectionWizard/ConnectionWizard';
import { getJenkinsServerWithSecret } from '../../api/getJenkinsServerWithSecret';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import { updateJenkinsServer } from '../../api/updateJenkinsServer';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import { SharePage } from '../SharePage/SharePage';

const analyticsClient = new AnalyticsClient();

export const getSiteNameFromUrl = (url: string): string => {
	try {
		const urlObject = new URL(url);
		return urlObject.hostname;
	} catch (error) {
		console.error('Error extracting site name:', error);
		return '';
	}
};

export const contentToRenderServerManagementScreen = (
	moduleKey: string | undefined,
	servers: JenkinsServer[],
	pageHeaderActions: ReactElement<any, string>,
	setJenkinsServers: (updatedServers: JenkinsServer[]) => void,
	updatedServer: JenkinsServer | undefined,
	isUpdatingServer: boolean,
	uuidOfRefreshServer: string,
	handleRefreshUpdateServer: (uuid: string) => void
) => {
	let contentToRender;

	switch (moduleKey) {
		case 'jenkins-for-jira-ui-admin-page':
			if (servers?.length) {
				contentToRender = (
					<>
						<div className={serverManagementContainer}>
							<div className={headerContainer}>
								<PageHeader actions={pageHeaderActions}>Jenkins server management</PageHeader>
							</div>

							<TopPanel />

							<ConnectionPanel
								jenkinsServers={servers}
								setJenkinsServers={setJenkinsServers}
								updatedServer={updatedServer}
								isUpdatingServer={isUpdatingServer}
								uuidOfRefreshServer={uuidOfRefreshServer}
								handleRefreshUpdateServer={handleRefreshUpdateServer}
								moduleKey={moduleKey}
							/>
						</div>
					</>
				);
			} else {
				contentToRender = (
					<div className={serverManagementContainer}>
						<ConnectionWizard />
					</div>
				);
			}
			break;

		case 'get-started-page':
			contentToRender = (
				<>
					<div className={headerContainer}>
						<PageHeader>Jenkins configuration</PageHeader>
					</div>
					<JenkinsSpinner />
				</>
			);
			break;

		default:
			contentToRender = <JenkinsSpinner secondaryClassName={spinnerHeight} />;
			break;
	}

	return contentToRender;
};

export const addConnectedStateToServer =
	(allServers: JenkinsServer[], singleServer: JenkinsServer, ipAddress?: string): JenkinsServer => {
		const isDuplicate =
		ipAddress &&
		allServers.some((server: JenkinsServer) =>
			server !== singleServer && server.pluginConfig?.ipAddress === ipAddress);

		let updatedServer: JenkinsServer;

		if (isDuplicate) {
			updatedServer = { ...singleServer, connectedState: ConnectedState.DUPLICATE };
		} else if (singleServer.pipelines.length && !singleServer.pluginConfig) {
			updatedServer = { ...singleServer, connectedState: ConnectedState.UPDATE_AVAILABLE };
		} else if (singleServer.pluginConfig) {
			updatedServer = { ...singleServer, connectedState: ConnectedState.CONNECTED };
		} else {
			updatedServer = { ...singleServer, connectedState: ConnectedState.PENDING };
		}

		return updatedServer;
	};

export const updateServerOnRefresh =
	async (server: JenkinsServer, allServers: JenkinsServer[]): Promise<JenkinsServer> => {
		const ipAddress = server.pluginConfig?.ipAddress;
		const updatedServer = addConnectedStateToServer(allServers, server, ipAddress);

		if (server !== updatedServer) {
			await updateJenkinsServer(updatedServer);
		}

		return updatedServer;
	};

const ServerManagement = (): JSX.Element => {
	const history = useHistory();
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>([]);
	const [moduleKey, setModuleKey] = useState<string>();
	const isMountedRef = React.useRef<boolean>(true);
	const [updatedServer, setUpdatedServer] = useState<JenkinsServer>();
	const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
	const [uuidOfRefreshServer, setUuidOfRefreshServer] = useState<string>('');

	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers() || [];
		const serversWithConnectedState = addConnectedState(servers);
		setJenkinsServers(serversWithConnectedState);
	};

	const redirectToAdminPage = useCallback(async () => {
		try {
			if (isMountedRef.current) {
				const currentModuleKey = await redirectFromGetStarted();
				setModuleKey(currentModuleKey);
			}
		} catch (error) {
			console.error('Error redirecting to admin page:', error);
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				await fetchAllJenkinsServers();
				await redirectToAdminPage();

				await analyticsClient.sendAnalytics(
					AnalyticsEventTypes.ScreenEvent,
					AnalyticsScreenEventsEnum.ServerManagementScreenName
				);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();

		return () => {
			// Cleanup function to set isMountedRef to false when the component is unmounted
			isMountedRef.current = false;
		};
	}, [redirectToAdminPage]);

	const handleNavigateToServerNameScreen = async (e: React.MouseEvent) => {
		e.preventDefault();

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.ConnectANewJenkinsServerName,
			{
				source: AnalyticsScreenEventsEnum.ServerManagementScreenName,
				action: `clicked - ${AnalyticsUiEventsEnum.ConnectANewJenkinsServerName}`,
				actionSubject: 'button'
			}
		);

		history.push('/connection-info/admin');
	};

	// Refresh for PENDING and UPDATE AVAILABLE servers
	const handleRefreshUpdateServer = async (uuid: string) => {
		setIsUpdatingServer(true);
		setUuidOfRefreshServer(uuid);

		try {
			const server = await getJenkinsServerWithSecret(uuid);
			const updatedServerData = await updateServerOnRefresh(server, jenkinsServers);
			const index = jenkinsServers.findIndex((s) => s.uuid === updatedServerData?.uuid);

			if (index !== -1 && updatedServerData) {
				const isDifferent = !isEqual(jenkinsServers[index], updatedServerData);

				if (isDifferent) {
					const newJenkinsServers = [...jenkinsServers];
					newJenkinsServers[index] = updatedServerData;
					setJenkinsServers(newJenkinsServers);
				}
			}

			setUpdatedServer(updatedServerData);
			setIsUpdatingServer(false);
		} catch (e) {
			console.error('No Jenkins server found.');
		} finally {
			setIsUpdatingServer(false);
		}
	};

	const pageHeaderActions = (
		<ButtonGroup>
			<Button
				appearance="primary"
				onClick={(e) => handleNavigateToServerNameScreen(e)}
			>
				Connect a new Jenkins server
			</Button>
			<SharePage
				analyticsScreenEventNameEnum={AnalyticsScreenEventsEnum.ServerManagementScreenName}/>
		</ButtonGroup>
	);

	const contentToRender =
		contentToRenderServerManagementScreen(
			moduleKey,
			jenkinsServers,
			pageHeaderActions,
			setJenkinsServers,
			updatedServer,
			isUpdatingServer,
			uuidOfRefreshServer,
			handleRefreshUpdateServer
		);

	return (
		<>
			{contentToRender}
		</>
	);
};

export { ServerManagement };
