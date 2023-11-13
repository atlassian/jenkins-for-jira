import React, { useCallback, useEffect, useState } from 'react';
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
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';
import { redirectFromGetStarted } from '../../api/redirectFromGetStarted';
import { FeatureFlags } from '../../hooks/useFeatureFlag';
import { fetchCloudId } from '../../api/fetchCloudId';
import { fetchFeatureFlagFromBackend } from '../../api/fetchFeatureFlagFromBackend';
import { TopPanel } from './TopPanel/TopPanel';

const JenkinsServerList = (): JSX.Element => {
	const history = useHistory();
	const analyticsClient = new AnalyticsClient();
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>();
	const [moduleKey, setModuleKey] = useState<string>();
	const [cloudId, setCloudId] = useState<string>();
	const [renovateConfigFlag, setRenovateConfigFlag] = useState<boolean>(false);

	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers() || [];
		setJenkinsServers(servers);
	};

	const getCloudId = async () => {
		const id = await fetchCloudId();
		setCloudId(id);
	};

	const redirectToAdminPage = useCallback(async () => {
		const currentModuleKey = await redirectFromGetStarted();
		setModuleKey(currentModuleKey);
	}, []);

	const fetchFeatureFlag = useCallback(async () => {
		const renovatedJenkinsFeatureFlag = await fetchFeatureFlagFromBackend(
			FeatureFlags.RENOVATED_JENKINS_FOR_JIRA_CONFIG_FLOW
		);
		setRenovateConfigFlag(renovatedJenkinsFeatureFlag);
	}, []);

	useEffect(() => {
		fetchAllJenkinsServers();
		redirectToAdminPage();
		getCloudId();
		fetchFeatureFlag();
	}, [redirectToAdminPage, cloudId, fetchFeatureFlag]);

	if (!jenkinsServers || !moduleKey || moduleKey === 'get-started-page') {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	const onClickConnect = () => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.ConnectJenkinsServerConfiguredStateName,
			{
				source: AnalyticsScreenEventsEnum.ConfigurationConfiguredStateScreenName,
				action: 'clicked connect Jenkins server configured state',
				actionSubject: 'button'
			}
		);

		history.push('/install');
	};

	const pageHeaderActions = (
		<ButtonGroup>
			<Button appearance="primary" onClick={() => onClickConnect()}>
				{renovateConfigFlag ? 'Connect a new Jenkins server' : 'Connect a Jenkins server'}
			</Button>
			{/* TODO - add onClick event */}
			{renovateConfigFlag && <Button>Share page</Button>}
		</ButtonGroup>
	);

	const headerText = renovateConfigFlag ? 'Jenkins for Jira' : 'Jenkins configuration';

	let contentToRender;

	if (jenkinsServers?.length && moduleKey === 'jenkins-for-jira-ui-admin-page') {
		contentToRender = (
			<>
				<div className={headerContainer}>
					<PageHeader actions={pageHeaderActions}>{headerText}</PageHeader>
				</div>

				{!renovateConfigFlag && <StyledDescription>
					After you connect your Jenkins server to Jira and send a deployment
					event from your CI/CD tool, you will be able to view development
					information within your linked Jira issue and view deployment pipelines
					over a timeline with insights.
				</StyledDescription>}

				{renovateConfigFlag && <TopPanel />}
				<ConnectedServers jenkinsServerList={jenkinsServers} refreshServers={fetchAllJenkinsServers} />
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
			<>
				<div className={headerContainer}>
					<PageHeader>Jenkins configuration</PageHeader>
				</div>
				<EmptyState />
			</>
		);
	}

	return contentToRender;
};

export {
	JenkinsServerList
};
