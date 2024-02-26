import React, { useEffect, useState } from 'react';
import PageHeader from '@atlaskit/page-header';
import Button from '@atlaskit/button/standard-button';
import { isEqual } from 'lodash';
import { ButtonGroup } from '@atlaskit/button';
import { router } from '@forge/bridge';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { addConnectedState, ConnectionPanel } from '../ConnectionPanel/ConnectionPanel';
import { headerContainer } from '../JenkinsServerList/JenkinsServerList.styles';
import { TopPanel } from '../ServerManagement/TopPanel/TopPanel';
import { updateServerOnRefresh } from '../ServerManagement/ServerManagement';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import { fetchAdminPath } from '../../api/fetchGlobalPageUrl';
import { fetchModuleKey } from '../../api/fetchModuleKey';
import { GlobalPageEmptyState } from './GlobalPageEmptyState';
import { getJenkinsServerWithSecret } from '../../api/getJenkinsServerWithSecret';
import { fetchUserPerms } from '../../api/fetchUserPerms';
import { SharePage } from '../SharePage/SharePage';

const analyticsClient = new AnalyticsClient();

type GlobalPageProps = {
	checkUserPermissionsFlag: boolean
};

export const GlobalPage = ({ checkUserPermissionsFlag }: GlobalPageProps): JSX.Element => {
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>();
	const isMountedRef = React.useRef<boolean>(true);
	const [moduleKey, setModuleKey] = useState<string>();
	const [updatedServer, setUpdatedServer] = useState<JenkinsServer>();
	const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
	const [uuidOfRefreshServer, setUuidOfRefreshServer] = useState<string>('');
	const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
	const [isFetchingAdminPerms, setIsFetchingAdminPerms] = useState<boolean>(false);

	const getModuleKey = async () => {
		const currentModuleKey = await fetchModuleKey();
		setModuleKey(currentModuleKey);
	};

	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers() || [];
		const serversWithConnectedState = addConnectedState(servers);
		setJenkinsServers(serversWithConnectedState);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				await fetchAllJenkinsServers();
				await getModuleKey();

				if (checkUserPermissionsFlag) {
					setIsFetchingAdminPerms(true);
					const isAdmin = await fetchUserPerms();
					setUserIsAdmin(isAdmin);
					setIsFetchingAdminPerms(false);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
		return () => {
			// Cleanup function to set isMountedRef to false when the component is unmounted
			isMountedRef.current = false;
		};
	}, [checkUserPermissionsFlag]);

	if (!jenkinsServers || !moduleKey || isFetchingAdminPerms) {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

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

	const handleNavigateToServerNameScreen = async (e: React.MouseEvent) => {
		e.preventDefault();
		const adminPath = await fetchAdminPath();

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.ConnectANewJenkinsServerName,
			{
				source: AnalyticsScreenEventsEnum.GlobalPageScreenName,
				action: `clicked - ${AnalyticsUiEventsEnum.ConnectANewJenkinsServerName}`,
				actionSubject: 'button'
			}
		);

		router.navigate(`${adminPath}/connection-info/global`);
	};

	const pageHeaderActions = (
		<ButtonGroup>
			{
				userIsAdmin && <Button
					appearance="primary"
					onClick={(e) => handleNavigateToServerNameScreen(e)}
				>
					Connect a new Jenkins server
				</Button>
			}
			<SharePage
				analyticsScreenEventNameEnum={AnalyticsScreenEventsEnum.GlobalPageScreenName}
				buttonAppearance='primary'/>
		</ButtonGroup>
	);

	return (
		<div>
			<div className={headerContainer}>
				<PageHeader actions={pageHeaderActions}>Jenkins for Jira</PageHeader>
			</div>
			{jenkinsServers?.length
				? <>
					<TopPanel />

					<ConnectionPanel
						jenkinsServers={jenkinsServers}
						setJenkinsServers={setJenkinsServers}
						updatedServer={updatedServer}
						isUpdatingServer={isUpdatingServer}
						uuidOfRefreshServer={uuidOfRefreshServer}
						handleRefreshUpdateServer={handleRefreshUpdateServer}
						moduleKey={moduleKey}
						userIsAdmin={userIsAdmin}
					/>
				</>
				: <>
					<TopPanel />
					<GlobalPageEmptyState />
				</>
			}
		</div>
	);
};
