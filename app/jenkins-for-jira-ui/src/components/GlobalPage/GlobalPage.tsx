import React, { useEffect, useState } from 'react';
import { cx } from '@emotion/css';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { TopPanel } from '../MainPage/TopPanel/TopPanel';
import { ConnectionPanel } from '../ConnectionPanel/ConnectionPanel';
import { globalPageContainer } from './GlobalPage.styles';

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

	return (
		<div className={cx(globalPageContainer)}>
			{jenkinsServers?.length
				? <>
					<TopPanel />

					<ConnectionPanel />
				</>
				: <>
					{/* TODO - add empty state (to be done in ARC-2648) */}
					<div>No Jenkins servers...</div>
				</>
			}
		</div>
	);
};
