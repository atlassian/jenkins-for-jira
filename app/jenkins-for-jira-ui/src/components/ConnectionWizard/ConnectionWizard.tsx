import React, { useEffect } from 'react';
import { cx } from '@emotion/css';
import Button from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle';
import { useHistory, useParams } from 'react-router';
import {
	connectionWizardContentContainer,
	connectionWizardButton,
	connectionInfoContainer,
	iconContainer
} from './ConnectionWizard.styles';
import {
	connectionFlowContainer
} from '../../GlobalStyles.styles';
import { InProductHelpAction, InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import { ConnectionFlowHeader } from './ConnectionFlowHeader';
import { AnalyticsEventTypes, AnalyticsScreenEventsEnum } from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import { CONNECTION_WIZARD_SCREEN_NAME } from '../../common/constants';
import { InProductHelpIds } from '../InProductHelpDrawer/InProductHelpIds';
import { ParamTypes } from '../../common/types';

const analyticsClient = new AnalyticsClient();

const ConnectionWizard = (): JSX.Element => {
	const history = useHistory();
	const { path } = useParams<ParamTypes>();

	useEffect(() => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.ConnectionWizardScreenName
		);
	}, []);

	const handleNavigateToServerNameScreen = (e: React.MouseEvent) => {
		e.preventDefault();
		history.push(`/create-server/${path}`);
	};

	return (
		<div className={cx(connectionFlowContainer)} data-testid="connection-wizard">
			<ConnectionFlowHeader />

			<div className={cx(connectionWizardContentContainer)}>
				<p id="connection-wizard-instruction">To complete this connection you'll need:</p>
			</div>
			<div className={cx(connectionInfoContainer)}>
				<div style={{ display: 'flex', marginBottom: '5px' }}>
					<div className={cx(iconContainer)}>
						<CheckCircleIcon label='' size='small' primaryColor='grey'/>
					</div>
					<p>An active Jenkins server</p>
				</div>
				<div style={{ display: 'flex' }}>
					<div className={cx(iconContainer)}><UserAvatarCircleIcon label='' size='small' primaryColor='grey'/></div>
					<p>The help of your Jenkins admin, unless you're an admin yourself<br/>
						<InProductHelpAction
							label="What you'll be doing and how your team can help"
							type={InProductHelpActionType.HelpLink}
							searchQuery={InProductHelpIds.CONNECTION_WIZARD_DISCUSS_WITH_TEAM}
							screenName={CONNECTION_WIZARD_SCREEN_NAME}
						/>
					</p>
				</div>
			</div>
			<Button
				appearance="primary"
				className={cx(connectionWizardButton)}
				onClick={(e) => handleNavigateToServerNameScreen(e)}
				testId="continue"
			>
				Continue
				<ArrowRightIcon label="Continue to next screen" />
			</Button>
		</div>
	);
};

export { ConnectionWizard };
