import React from 'react';
import { cx } from '@emotion/css';
import Button, { Appearance, ButtonGroup } from '@atlaskit/button';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import {
	connectionPanelContainerContainer,
	connectionPanelContainerHeader,
	connectionPanelContainerParagraph
} from './ConnectionPanel.styles';
import { ConnectionPendingIcon } from '../icons/ConnectionPendingIcon';
import { NoDataIcon } from '../icons/NoDataIcon';
import { DuplicateServerIcon } from '../icons/DuplicateServerIcon';
import { InProductHelpAction, InProductHelpActionButtonAppearance, InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import { InProductHelpIds } from '../InProductHelpDrawer/InProductHelpIds';

type NotConnectedStateProps = {
	connectedState: ConnectedState;
	contentHeader: string,
	contentInstructionOne: string,
	contentInstructionTwo?: string,
	buttonOneAppearance?: Appearance,
	firstButtonLabel?: string,
	secondButtonLabel?: string,
	buttonOneOnClick?(data?: any): void,
	buttonTwoOnClick?(data: any): void,
	buttonTwoTestId?: string,
	isButtonOneIph?: boolean,
	jenkinsServerUuid?: string
};

const ConnectionPanelContent = ({
	connectedState,
	contentHeader,
	contentInstructionOne,
	contentInstructionTwo,
	buttonOneAppearance,
	firstButtonLabel,
	secondButtonLabel,
	buttonOneOnClick,
	buttonTwoOnClick,
	buttonTwoTestId,
	isButtonOneIph,
	jenkinsServerUuid
}: NotConnectedStateProps): JSX.Element => {
	let icon;
	console.log('button one ', buttonOneAppearance);

	if (connectedState === ConnectedState.UPDATE_AVAILABLE) {
		icon = <NoDataIcon />;
	} else if (connectedState === ConnectedState.PENDING) {
		icon = <ConnectionPendingIcon />;
	} else {
		icon = <DuplicateServerIcon />;
	}

	let firstButton;

	if (isButtonOneIph) {
		firstButton =
			firstButtonLabel &&
			<InProductHelpAction
				label={firstButtonLabel}
				appearance={InProductHelpActionButtonAppearance.Primary}
				type={InProductHelpActionType.HelpButton}
				searchQuery={InProductHelpIds.PENDING_SERVER_LEARN_MORE}
			/>;
	} else {
		console.log('button one not iph ', buttonOneAppearance);
		firstButton =
			firstButtonLabel &&
			<Button
				appearance={buttonOneAppearance}
				onClick={buttonOneOnClick}
			>
				{firstButtonLabel}
			</Button>;
	}

	return (
		<div className={cx(connectionPanelContainerContainer)}>
			{icon}
			<h3 className={cx(connectionPanelContainerHeader)}>{contentHeader}</h3>
			<p className={cx(connectionPanelContainerParagraph)}>{contentInstructionOne}</p>
			<p className={cx(connectionPanelContainerParagraph)}>{contentInstructionTwo}</p>
			<ButtonGroup>
				{
					<>{ firstButton }</>
				}
				{
					secondButtonLabel &&
					<Button
						onClick={() => buttonTwoOnClick?.(jenkinsServerUuid)}
						testId={buttonTwoTestId}>
						{secondButtonLabel}
					</Button>
				}
			</ButtonGroup>
		</div>
	);
};

export { ConnectionPanelContent };
