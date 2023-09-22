import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import Button from '@atlaskit/button';
import { JiraSoftwareIcon } from '@atlaskit/logo';
import { B200, B400 } from '@atlaskit/theme/colors';
import Spinner from '@atlaskit/spinner';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {
	subheadingText,
	descriptionText,
	pendingDeploymentContainer,
	pendingDeploymentIconContainer,
	checkSpacer,
	pendingDeploymentInnerContainer
} from './PendingDeploymentState.styles';
import { JenkinsIcon } from '../../icons/JenkinsIcon';
import { getJenkinsServerWithSecret } from '../../../api/getJenkinsServerWithSecret';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../../common/analytics/analytics-client';
import {
	headerContainer,
	navigateBackContainer
} from '../../ManageConnection/ManageConnection.styles';

const analyticsClient = new AnalyticsClient();

interface ParamTypes {
	id: string;
	name: string;
}

const PendingDeploymentState = () => {
	const history = useHistory();
	const [serverName, setServerName] = useState('');
	const { id: jenkinsServerUuid } = useParams<ParamTypes>();

	const onClickManage = async () => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.ManageConnectionPendingStateName,
			{
				source: AnalyticsScreenEventsEnum.PendingDeploymentStateScreenName,
				action: 'clicked Manage connection pending deployment',
				actionSubject: 'button'
			}
		);

		history.push(`/manage/${jenkinsServerUuid}`);
	};

	const getServer = useCallback(async () => {
		const { name } = await getJenkinsServerWithSecret(jenkinsServerUuid);
		setServerName(name);
	}, [jenkinsServerUuid]);

	useEffect(() => {
		getServer();

		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.PendingDeploymentStateScreenName
		);
	}, [getServer, jenkinsServerUuid]);

	const handleNavigateBackClick = async (): Promise<void> => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.NavigateBackPendingDeploymentStateName,
			{
				source: AnalyticsScreenEventsEnum.PendingDeploymentStateScreenName,
				action: 'clicked back pending deployment state',
				actionSubject: 'button'
			}
		);

		history.push('/');
	};

	const handleNavigateBackKeyDown = async (event: React.KeyboardEvent): Promise<void> => {
		if (event.code === 'Enter') {
			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.UiEvent,
				AnalyticsUiEventsEnum.NavigateBackPendingDeploymentStateName,
				{
					source: AnalyticsScreenEventsEnum.PendingDeploymentStateScreenName,
					action: 'pressed enter key pending deployment state',
					actionSubject: 'keydown'
				}
			);
			history.push('/');
		}
	};

	return (
		<div className={pendingDeploymentContainer}>
			<header className={headerContainer}>
				<button
					className={navigateBackContainer}
					onClick={handleNavigateBackClick}
					onKeyDown={handleNavigateBackKeyDown}
				>
					<ArrowLeftIcon label="Go back" />
				</button>
			</header>

			<div className={pendingDeploymentInnerContainer}>
				<h2>Waiting for {serverName} deployment event...</h2>
				<p className={subheadingText}>
					Include issue keys in your commit messages to start tracking your deployments.{' '}
					Check back here after a few deployments to verify that it’s working.
				</p>

				<div className={pendingDeploymentIconContainer}>
					<JiraSoftwareIcon
						iconColor={B200}
						iconGradientStart={B400}
						iconGradientStop={B200}
						size='large'
					/>
					<span className={checkSpacer} />
					<Spinner size='large' />
					<span className={checkSpacer} />
					<JenkinsIcon data-testid="jenkins-icon-connect" />
				</div>

				<p className={descriptionText}>
					If you have already sent a deployment event,{' '}
					check that your integration configuration or Jenkinsfile is correct.
				</p>
				<Button onClick={() => onClickManage()}>
					Manage connection
				</Button>
			</div>
		</div>
	);
};

export {
	PendingDeploymentState
};
