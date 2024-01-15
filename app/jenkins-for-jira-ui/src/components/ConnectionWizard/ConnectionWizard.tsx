import React, { useEffect } from 'react';
import { cx } from '@emotion/css';
import Button from '@atlaskit/button';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import { useHistory } from 'react-router';
import {
	connectionWizardNestedOrderedListItem,
	connectionWizardOrderedListItem,
	connectionWizardContentContainer,
	connectionWizardButton
} from './ConnectionWizard.styles';
import {
	connectionFlowContainer,
	orderedList,
	orderedListItem
} from '../../GlobalStyles.styles';
import { InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import { ConnectionFlowHeader } from './ConnectionFlowHeader';
import { InfoPanel } from '../InfoPanel/InfoPanel';
import { AnalyticsEventTypes, AnalyticsScreenEventsEnum } from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';

const analyticsClient = new AnalyticsClient();

const ConnectionWizard = (): JSX.Element => {
	const history = useHistory();

	useEffect(() => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.ConnectionWizardScreenName
		);
	}, []);

	const handleNavigateToServerNameScreen = (e: React.MouseEvent) => {
		e.preventDefault();
		history.push('/create-server');
	};

	return (
		<div className={cx(connectionFlowContainer)} data-testid="connection-wizard">
			<ConnectionFlowHeader />

			<div className={cx(connectionWizardContentContainer)}>
				<p id="connection-wizard-instruction">To complete this connection you'll need:</p>

				<ol className={cx(orderedList)}>
					<li className={cx(orderedListItem, connectionWizardOrderedListItem)}>An active Jenkins server</li>
					<li className={cx(orderedListItem, connectionWizardOrderedListItem)}>Team knowledge</li>
					<p className={cx(connectionWizardNestedOrderedListItem)}>
						How your teams use Jenkins
					</p>
					<li
						className={cx(orderedListItem, connectionWizardOrderedListItem)}
					>
						The help of your Jenkins admin
					</li>
					<p className={cx(connectionWizardNestedOrderedListItem)}>
						Unless you're an admin yourself
					</p>
				</ol>
			</div>

			<InfoPanel
				content="If this is your first time connecting a Jenkins server, take a few minutes to talk to your team."
				iphContainerWidth="340px"
				iphLabel="What to discuss with your team before connecting Jenkins"
				iphType={InProductHelpActionType.HelpLink}
				screenName='home-page-empty-state'
			/>

			<Button
				appearance="primary"
				className={cx(connectionWizardButton)}
				onClick={(e) => handleNavigateToServerNameScreen(e)}
			>
				I've gathered my team
				<ArrowRightIcon label="Continue to next screen" />
			</Button>
		</div>
	);
};

export { ConnectionWizard };
