import React, { useEffect, useState } from 'react';
import PageHeader from '@atlaskit/page-header';
import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import { cx } from '@emotion/css';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { ConnectionPanel } from '../ConnectionPanel/ConnectionPanel';
import { headerContainer } from '../JenkinsServerList/JenkinsServerList.styles';
import { TopPanel } from '../ServerManagement/TopPanel/TopPanel';
import { NoServersConnectedIcon } from '../icons/NoServersConnectedIcon';
import { globalStateEmptyStateContainer } from './GlobalPage.styles';

export const GlobalPageEmptyState = (): JSX.Element => {
	return (
		<div className={cx(globalStateEmptyStateContainer)}>
			<NoServersConnectedIcon containerClassName="blah" />
			<h3>No servers connected</h3>
			<p>Once a site admin has conneted a server, you'll see it listed here together with its set up guide.</p>
		</div>
	);
};

export const GlobalPage = (): JSX.Element => {
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>();
	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers() || [];
		setJenkinsServers(servers);
	};

	useEffect(() => {
		fetchAllJenkinsServers();
	}, []);

	if (!jenkinsServers) {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	const pageHeaderActions = (
		<ButtonGroup>
			{/* TODO - add onClick event (will be done in ARC-2723 */}
			<Button>Share page</Button>
		</ButtonGroup>
	);

	return (
		<div>
			<div className={headerContainer}>
				<PageHeader actions={pageHeaderActions}>Jenkins for Jira</PageHeader>
			</div>

			<TopPanel />

			{jenkinsServers?.length
				? <>

					<ConnectionPanel />
				</>
				: <>
					{/* TODO - add empty state (to be done in ARC-2648) */}
					<GlobalPageEmptyState />
				</>
			}
		</div>
	);
};
