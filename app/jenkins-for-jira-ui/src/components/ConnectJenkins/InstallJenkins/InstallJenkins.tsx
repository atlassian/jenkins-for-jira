import React, { useEffect } from 'react';
import Button from '@atlaskit/button';
import { useHistory } from 'react-router';
import { ConfigurationSteps } from '../ConfigurationSteps/ConfigurationSteps';
import { ConnectLogos } from '../ConnectLogos/ConnectLogos';
import {
	BoldSpan,
	StyledButtonContainerInstallJenkins,
	StyledH1,
	StyledInstallationContainer,
	StyledInstallationContent
} from '../ConnectJenkins.styles';
import { AnalyticsClient } from '../../../common/analytics/analytics-client';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../../common/analytics/analytics-events';

const analyticsClient = new AnalyticsClient();

const InstallJenkins = () => {
	const history = useHistory();

	useEffect(() => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.InstallJenkinsScreenName
		);
	}, []);

	const onClickNext = () => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.NextInstallJenkinsName,
			{
				source: AnalyticsScreenEventsEnum.InstallJenkinsScreenName,
				action: 'clickedNextInstallJenkins',
				actionSubject: 'button'
			}
		);
		history.push('/create');
	};

	return (
		<StyledInstallationContainer>
			<ConfigurationSteps
				currentStage='install'
			/>
			<ConnectLogos />

			<StyledH1>Before you continue, install plugin on Jenkins</StyledH1>

			<StyledInstallationContent>
				<h3>On your Jenkins server, install the “Atlassian Jira Software Cloud” plugin.
					You must be an admin to do this.</h3>
				<ol>
					<li>Open your Jenkins server</li>
					<li>Navigate to <BoldSpan>Manage Jenkins &gt; Manage plugins</BoldSpan></li>
					<li>In the <BoldSpan>Available</BoldSpan> tab, search for
						“<BoldSpan>Atlassian Jira Software Cloud</BoldSpan>”</li>
					<li>Check the "<BoldSpan>Install</BoldSpan>" checkbox</li>
					<li>Click "<BoldSpan>Download now and install after restart</BoldSpan>"</li>
				</ol>
				<p>Once you’ve installed the plugin on Jenkins, click "Next".</p>

				<StyledButtonContainerInstallJenkins>
					<Button appearance="primary" onClick={() => onClickNext()}>
						Next
					</Button>
				</StyledButtonContainerInstallJenkins>
			</StyledInstallationContent>
		</StyledInstallationContainer>
	);
};

export {
	InstallJenkins
};
