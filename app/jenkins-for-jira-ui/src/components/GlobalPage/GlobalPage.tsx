import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '@atlaskit/page-header';
import Button from '@atlaskit/button/standard-button';
import { cx } from '@emotion/css';
import TextArea from '@atlaskit/textarea';
import { isEqual } from 'lodash';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { addConnectedState, ConnectionPanel } from '../ConnectionPanel/ConnectionPanel';
import { headerContainer } from '../JenkinsServerList/JenkinsServerList.styles';
import { TopPanel } from '../ServerManagement/TopPanel/TopPanel';
import { getSharePageMessage, updateServerOnRefresh } from '../ServerManagement/ServerManagement';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import { JenkinsModal } from '../JenkinsServerList/ConnectedServer/JenkinsModal';
import { shareModalInstruction } from '../ServerManagement/ServerManagement.styles';
import { fetchGlobalPageUrl } from '../../api/fetchGlobalPageUrl';
import { fetchModuleKey } from '../../api/fetchModuleKey';
import { GlobalPageEmptyState } from './GlobalPageEmptyState';
import { getJenkinsServerWithSecret } from '../../api/getJenkinsServerWithSecret';
import { fetchUserPerms } from '../../api/fetchUserPerms';
import { fetchFeatureFlagFromBackend } from '../../api/fetchFeatureFlagFromBackend';
import { FeatureFlags } from '../../common/featureFlags';

const analyticsClient = new AnalyticsClient();

export const GlobalPage = (): JSX.Element => {
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>();
	const [showSharePage, setshowSharePage] = useState<boolean>(false);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const isMountedRef = React.useRef<boolean>(true);
	const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
	const [globalPageUrl, setGlobalPageUrl] = useState<string>('');
	const [moduleKey, setModuleKey] = useState<string>();
	const [updatedServer, setUpdatedServer] = useState<JenkinsServer>();
	const [isUpdatingServer, setIsUpdatingServer] = useState<boolean>(false);
	const [uuidOfRefreshServer, setUuidOfRefreshServer] = useState<string>('');
	const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
	const [isFetchingFlag, setIsFetchingFlag] = useState<boolean>(false);
	const [checkUserPermissionsFlag, setCheckUserPermissionsFlag] = useState<boolean>(false);

	const getModuleKey = async () => {
		const currentModuleKey = await fetchModuleKey();
		setModuleKey(currentModuleKey);
	};

	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers() || [];
		const serversWithConnectedState = addConnectedState(servers);
		setJenkinsServers(serversWithConnectedState);
	};

	const fetchUserPermissions = async () => {
		console.log('fetching user perms...');
		const isAdmin = await fetchUserPerms();
		setUserIsAdmin(isAdmin);
	};

	useEffect(() => {
		let isMounted = true;
		const fetchData = async () => {
			setIsFetchingFlag(true);
			try {
				const checkUserPermissions = await fetchFeatureFlagFromBackend(
					FeatureFlags.CHECK_USER_PERMISSIONS
				);

				const url = await fetchGlobalPageUrl();
				setGlobalPageUrl(url);
				await fetchAllJenkinsServers();
				await getModuleKey();

				if (checkUserPermissionsFlag) {
					await fetchUserPermissions();
				}

				if (isMounted) {
					setCheckUserPermissionsFlag(checkUserPermissions);
					setIsFetchingFlag(false);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
				setIsFetchingFlag(false);
			}
		};

		fetchData();
		return () => {
			isMounted = false;
			// Cleanup function to set isMountedRef to false when the component is unmounted
			isMountedRef.current = false;
		};
	}, [checkUserPermissionsFlag]);

	console.log('isFetchingFlag', isFetchingFlag, checkUserPermissionsFlag);
	console.log('userIsAdmin', userIsAdmin);

	if (!jenkinsServers || !moduleKey || !isFetchingFlag) {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	const handleShowSharePageModal = async () => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.SharePageName,
			{
				source: AnalyticsScreenEventsEnum.GlobalPageScreenName,
				action: `clicked - ${AnalyticsUiEventsEnum.SharePageName}`,
				actionSubject: 'button'
			}
		);

		setshowSharePage(true);
	};

	const handleCopyToClipboard = async () => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.CopiedToClipboardName,
			{
				source: AnalyticsScreenEventsEnum.GlobalPageScreenName,
				action: `clicked - ${AnalyticsUiEventsEnum.CopiedToClipboardName}`,
				actionSubject: 'button'
			}
		);

		if (textAreaRef.current) {
			textAreaRef.current.select();
			document.execCommand('copy');
			textAreaRef.current.setSelectionRange(textAreaRef.current.value.length, textAreaRef.current.value.length);

			setIsCopiedToClipboard(true);

			setTimeout(() => {
				if (isMountedRef.current) {
					setIsCopiedToClipboard(false);
				}
			}, 2000);
		}
	};

	const handleCloseShowSharePageModal = async () => {
		setshowSharePage(false);
	};

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

	const pageHeaderAction = (
		<Button onClick={() => handleShowSharePageModal()}>Share page</Button>
	);

	const sharePageMessage = getSharePageMessage(globalPageUrl);

	return (
		<div>
			<div className={headerContainer}>
				<PageHeader actions={pageHeaderAction}>Jenkins for Jira</PageHeader>
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

			{
				showSharePage && <JenkinsModal
					dataTestId="share-page-modal"
					title="Share page"
					body={[
						<p key="share-message" className={cx(shareModalInstruction)}>
							Share this link with your project teams to help them set up what
							data they receive from Jenkins.
						</p>,
						<TextArea
							key="text-area"
							ref={textAreaRef}
							value={sharePageMessage}
							isReadOnly
							minimumRows={5}
						/>
					]}
					onClose={handleCloseShowSharePageModal}
					primaryButtonAppearance="subtle"
					primaryButtonLabel="Close"
					secondaryButtonAppearance="primary"
					secondaryButtonLabel="Copy to clipboard"
					secondaryButtonOnClick={handleCopyToClipboard}
					isCopiedToClipboard={isCopiedToClipboard}
				/>
			}
		</div>
	);
};
