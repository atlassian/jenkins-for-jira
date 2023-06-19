import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import PageHeader from '@atlaskit/page-header';
import { EmptyState } from '../EmptyState/EmptyState';
import { ConnectedServers } from './ConnectedServer/ConnectedServers';
import { StyledDescription, headerContainer } from './JenkinsServerList.styles';
// import analyticsClient from '../../common/analytics/analytics-client';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsServer } from '../../../../src/common/types';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { AnalyticsClient } from '../../common/analytics/analytics-client';

const JenkinsServerList = (): JSX.Element => {
	const history = useHistory();
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>();
	const eventType = 'screen';
	const eventName = 'Home Screen empty';

	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers();
		setJenkinsServers(servers);
	};

	// TODO: Remove after finishing testing
	const fireEventsFE = () => {
		const analyticsClient = new AnalyticsClient();
		analyticsClient.sendAnalytics('track', 'clicking', {
			actionSubject: 'button',
			action: 'clicked',
			source: 'something',
			subject: 'whatever'
		});
	};

	useEffect(() => {
		const analyticsClient = new AnalyticsClient();
		analyticsClient.sendAnalytics(eventType, eventName);

		fetchAllJenkinsServers();
	}, []);

	if (!jenkinsServers) {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	const onClickConnect = () => {
		history.push('/install');
	};

	const pageHeaderActions = (
		<ButtonGroup>
			<Button appearance="primary" onClick={() => onClickConnect()}>
				Connect a Jenkins server
			</Button>
		</ButtonGroup>
	);

	return jenkinsServers?.length ? (
		<>
			<div className={headerContainer}>
				<PageHeader actions={pageHeaderActions}>Jenkins configuration</PageHeader>
			</div>

			<button onClick={fireEventsFE}>Fire Events in frontend</button>

			<StyledDescription>
				After you connect your Jenkins server to Jira and send a deployment
				event from your CI/CD tool, you will be able to view development
				information within your linked Jira issue and view deployment pipelines
				over a timeline with insights.
			</StyledDescription>

			<ConnectedServers jenkinsServerList={jenkinsServers} refreshServers={fetchAllJenkinsServers} />
		</>
	) : (
		<>
			<div className={headerContainer}>
				<PageHeader>Jenkins configuration</PageHeader>
			</div>
			<EmptyState />
		</>
	);
};

export {
	JenkinsServerList
};
