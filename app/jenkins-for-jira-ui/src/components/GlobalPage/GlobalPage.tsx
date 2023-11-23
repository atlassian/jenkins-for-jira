import React, { useEffect, useState } from 'react';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { JenkinsServer } from '../../../../src/common/types';

type GlobalPageProps = {
	moduleKey: string
};

export const GlobalPage = (props: GlobalPageProps): JSX.Element => {
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>();
	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers() || [];
		setJenkinsServers(servers);
	};

	useEffect(() => {
		fetchAllJenkinsServers();
	}, []);

	console.log('JENKINS SERVERS: ', jenkinsServers, props.moduleKey);

	if (!jenkinsServers) {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	return (
		<>
			{jenkinsServers?.length
				? <div>render data</div>
				: <>
					<div>No Jenkins servers...</div>
				</>
			}
		</>
	);
};
