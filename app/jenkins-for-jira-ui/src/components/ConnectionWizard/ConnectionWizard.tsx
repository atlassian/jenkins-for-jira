import React from 'react';
import { cx } from '@emotion/css';
import Button from '@atlaskit/button';
import PeopleGroup from '@atlaskit/icon/glyph/people-group';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import { useHistory } from 'react-router';
import {
	connectionWizardInfoPanel,
	connectionWizardNestedOrderedListItem,
	connectionWizardOrderedListItem,
	connectionWizardContentContainer,
	connectionWizardInProductHelpLink,
	connectionWizardButton,
	connectionWizardInfoPaneIphLink
} from './ConnectionWizard.styles';
import {
	connectionFlowContainer,
	infoPanel,
	orderedList,
	orderedListItem
} from '../../GlobalStyles.styles';
import { InProductHelpAction, InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import { ConnectionFlowHeader } from './ConnectionFlowHeader';

const ConnectionWizard = (): JSX.Element => {
	const history = useHistory();

	const handleNavigateToServerNameScreen = (e: React.MouseEvent) => {
		e.preventDefault();
		history.push('/create-server');
	};

	return (
		<div className={cx(connectionFlowContainer)} data-testid="connection-wizard">
			<ConnectionFlowHeader />

			<div className={cx(connectionWizardContentContainer)}>
				<p>To complete this connection you'll need:</p>

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
						Unless you’re an admin yourself
					</p>
				</ol>
			</div>

			<div className={cx(infoPanel, connectionWizardInfoPanel)}>
				<PeopleGroup label="people-group" />
				<p className={cx(connectionWizardInfoPaneIphLink)}>
					If this is your first time connecting a Jenkins server, take a few minutes to talk to your team.
					<InProductHelpAction
						label="What to discuss with your team before connecting Jenkins"
						type={InProductHelpActionType.HelpLink}
						appearance="link"
						className={connectionWizardInProductHelpLink}
					/>
				</p>
			</div>

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
