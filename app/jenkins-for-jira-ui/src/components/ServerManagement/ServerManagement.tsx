import React, { useCallback, useEffect, useState } from 'react';
import PageHeader from '@atlaskit/page-header';
import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import { headerContainer } from '../JenkinsServerList/JenkinsServerList.styles';
import { mainPageContainer } from './ServerManagement.styles';
import { addConnectedState, ConnectionPanel } from '../ConnectionPanel/ConnectionPanel';
import { TopPanel } from './TopPanel/TopPanel';
import { JenkinsServer } from '../../../../src/common/types';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { redirectFromGetStarted } from '../../api/redirectFromGetStarted';
import { ConnectionWizard } from '../ConnectionWizard/ConnectionWizard';

const ServerManagement = (): JSX.Element => {
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>([]);
	const [moduleKey, setModuleKey] = useState<string>();
	const isMountedRef = React.useRef<boolean>(true);

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
		fetchAllJenkinsServers();
		redirectToAdminPage();

		return () => {
			// Cleanup function to set isMountedRef to false when the component is unmounted
			isMountedRef.current = false;
		};
	}, [redirectToAdminPage]);

	if (!jenkinsServers || !moduleKey || moduleKey === 'get-started-page') {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	const pageHeaderActions = (
		<ButtonGroup>
			{/* TODO - add onClick event (will be done when I build the new server name form */}
			<Button appearance="primary">
				Connect a new Jenkins server
			</Button>
			{/* TODO - add onClick event (will be done after spike for ARC-2691 */}
			<Button>Share page</Button>
		</ButtonGroup>
	);

	let contentToRender;

	if (jenkinsServers?.length && moduleKey === 'jenkins-for-jira-ui-admin-page') {
		contentToRender = (
			<>
				<div className={mainPageContainer}>
					<div className={headerContainer}>
						<PageHeader actions={pageHeaderActions}>Jenkins for Jira</PageHeader>
					</div>

					<TopPanel />

					<ConnectionPanel jenkinsServers={jenkinsServers} setJenkinsServers={setJenkinsServers} />
				</div>
			</>
		);
	} else if (moduleKey === 'get-started-page') {
		contentToRender = (
			<>
				<div className={headerContainer}>
					<PageHeader>Jenkins configuration</PageHeader>
				</div>
				<JenkinsSpinner />
			</>
		);
	} else {
		contentToRender = (
			<div className={mainPageContainer}>
				<ConnectionWizard />
			</div>
		);
	}

	return (
		<>{contentToRender}</>
	);
};

export { ServerManagement };
