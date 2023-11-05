import React, { useEffect } from 'react';
import Button from '@atlaskit/button';
import EmptyState from '@atlaskit/empty-state';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { useHistory } from 'react-router';
import { router } from '@forge/bridge';
import PlugInImage from '../assets/PlugIn.svg';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';

const analyticsClient = new AnalyticsClient();

const EmptyStateJenkins = () => {
	const history = useHistory();

	useEffect(() => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.ConfigurationEmptyStateScreenName
		);
	}, []);

	const onClickConnect = () => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.ConnectJenkinsServerEmptyStateName,
			{
				source: AnalyticsScreenEventsEnum.ConfigurationEmptyStateScreenName,
				action: 'clicked Connect Jenkins server empty state',
				actionSubject: 'button'
			}
		);
		history.push('/install');
	};

	const onClickLearnMore = () => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.LearnMoreEmptyStateName,
			{
				source: AnalyticsScreenEventsEnum.ConfigurationEmptyStateScreenName,
				action: 'clicked Learn more empty state',
				actionSubject: 'button'
			}
		);
		router.open('https://plugins.jenkins.io/atlassian-jira-software-cloud/');
	};

	return (
		<EmptyState
			header="Connect Jenkins to Jira Software"
			description="WHAT"
			primaryAction={
				<Button appearance="primary" onClick={() => onClickConnect()}>
					Connect a Jenkins server TEST
				</Button>
			}
			secondaryAction={
				<Button
					onClick={() => onClickLearnMore()}
					width={128}
					iconAfter={<ShortcutIcon label="Learn more" size="medium" />}
				>
					Learn more
				</Button>
			}
			imageUrl={PlugInImage}
			maxImageHeight={160}
			maxImageWidth={332}
		/>
	);
};

export { EmptyStateJenkins as EmptyState };
