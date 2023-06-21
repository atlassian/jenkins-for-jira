import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import PageHeader from '@atlaskit/page-header';
import { EmptyState } from '../EmptyState/EmptyState';
import { ConnectedServers } from './ConnectedServer/ConnectedServers';
import { StyledDescription, headerContainer } from './JenkinsServerList.styles';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsServer } from '../../../../src/common/types';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import {
	AnalyticsClient,
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';

const JenkinsServerList = (): JSX.Element => {
	const history = useHistory();
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>();
	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers();
		setJenkinsServers(servers);
	};

	useEffect(() => {
		fetchAllJenkinsServers();
	}, []);

	const analyticsClient = new AnalyticsClient();
	const jiraHost = window.location.ancestorOrigins['0'];

	if (!jenkinsServers) {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.ConfigurationEmptyStateScreenName,
			{ jiraHost }
		);
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	if (jenkinsServers.length) {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName,
			{ jiraHost }
		);
	}

	const onClickConnect = () => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.ConnectJenkinsServerConfiguredStateName,
			{
				source: AnalyticsUiEventsEnum.ConnectJenkinsServerConfiguredStateName,
				action: 'clickedConnectJenkinsServerConfiguredState',
				actionSubject: 'button',
				jiraHost
			}
		);
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
