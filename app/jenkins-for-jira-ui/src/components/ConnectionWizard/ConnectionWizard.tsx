import React from 'react';
import { cx } from '@emotion/css';
import Button from '@atlaskit/button';
import PeopleGroup from '@atlaskit/icon/glyph/people-group';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import {
	connectionWizardContainer, connectionWizardHeader, connectionWizardInfoPanel,
	connectionWizardNestedOrderedListItem,
	connectionWizardOrderedListItem,
	connectionWizardContentContainer,
	connectionWizardInProductHelpLink, connectionWizardButton
} from './ConnectionWizard.styles';
import {
	infoPanel, orderedList, orderedListItem
} from '../../GlobalStyles.styles';
import { InProductHelpAction, InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import { JenkinsSyncJiraIcon } from '../icons/JenkinsSyncJiraIcon';

const ConnectionWizard = (): JSX.Element => {
	const handleNavigateToServerNameScreen = (e: React.MouseEvent) => {
		e.preventDefault();
		// TODO - add onclick in build new server name
	};

	return (
		<div className={cx(connectionWizardContainer)} data-testid="connection-wizard">
			<JenkinsSyncJiraIcon />
			<h3 className={cx(connectionWizardHeader)}>Connect Jenkins to Jira</h3>
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
				<p>
					If this is your first time connecting a Jenkins server, take a few minutes to talk to your team.
					<InProductHelpAction
						label="Here’s what to discuss."
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
