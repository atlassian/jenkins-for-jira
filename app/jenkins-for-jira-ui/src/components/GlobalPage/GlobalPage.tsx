import React, { useEffect, useState } from 'react';
import PageHeader from '@atlaskit/page-header';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { ConnectionPanel } from '../ConnectionPanel/ConnectionPanel';
import { headerContainer } from '../JenkinsServerList/JenkinsServerList.styles';
import { TopPanel } from '../ServerManagement/TopPanel/TopPanel';

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

	// TODO - pass props to connection panel

	return (
		<div>
			<div className={headerContainer}>
				<PageHeader>Jenkins for Jira</PageHeader>
			</div>
			{jenkinsServers?.length
				? <>
					<TopPanel />

					<ConnectionPanel jenkinsServers={jenkinsServers} />
				</>
				: <>
					{/* TODO - add empty state (to be done in ARC-2648) */}
					<div>No Jenkins servers...</div>
				</>
			}
		</div>
	);
};
