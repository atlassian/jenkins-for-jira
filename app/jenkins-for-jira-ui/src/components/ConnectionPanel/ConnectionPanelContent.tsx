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

type ConnectionPanelContentProps = {
	connectedState: ConnectedState;
	contentHeader: string,
	contentInstructionOne: string,
	contentInstructionTwo?: string,
	primaryButtonAppearance?: Appearance,
	primaryButtonLabel?: string,
	secondaryButtonLabel?: string,
	primaryActionOnClick?(data?: any): void,
	secondaryActionOnClick?(data: any): void,
	primaryButtonTestId?: string,
	isPrimaryButtonInProductHelp?: boolean,
	jenkinsServerUuid?: string
};

const ConnectionPanelContent = ({
	connectedState,
	contentHeader,
	contentInstructionOne,
	contentInstructionTwo,
	primaryButtonAppearance,
	primaryButtonLabel,
	secondaryButtonLabel,
	primaryActionOnClick,
	secondaryActionOnClick,
	primaryButtonTestId,
	isPrimaryButtonInProductHelp,
	jenkinsServerUuid
}: ConnectionPanelContentProps): JSX.Element => {
	let icon;

	if (connectedState === ConnectedState.UPDATE_AVAILABLE) {
		icon = <NoDataIcon />;
	} else if (connectedState === ConnectedState.PENDING) {
		icon = <ConnectionPendingIcon />;
	} else {
		icon = <DuplicateServerIcon />;
	}

	return (
		<div className={cx(connectionPanelContainerContainer)}>
			{icon}
			<h3 className={cx(connectionPanelContainerHeader)}>{contentHeader}</h3>
			<p className={cx(connectionPanelContainerParagraph)}>{contentInstructionOne}</p>
			<p className={cx(connectionPanelContainerParagraph)}>{contentInstructionTwo}</p>
			<ButtonGroup>
				{
					isPrimaryButtonInProductHelp && primaryButtonLabel
						? <InProductHelpAction
							label={primaryButtonLabel}
							appearance={InProductHelpActionButtonAppearance.Primary}
							type={InProductHelpActionType.HelpButton}
							searchQuery={InProductHelpIds.PENDING_SERVER_LEARN_MORE}/>
						: <Button
							appearance={primaryButtonAppearance}
							onClick={primaryActionOnClick}
							testId={primaryButtonTestId}>
							{primaryButtonLabel}
						</Button>
				}
				{
					secondaryButtonLabel &&
					<Button
						onClick={() => secondaryActionOnClick?.(jenkinsServerUuid)}>
						{secondaryButtonLabel}
					</Button>
				}
			</ButtonGroup>
		</div>
	);
};

export { ConnectionPanelContent };
