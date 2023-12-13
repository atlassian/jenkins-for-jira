import React from 'react';
import { cx } from '@emotion/css';
import Button, { Appearance, ButtonGroup } from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import {
	connectionPanelContainerContainer,
	connectionPanelContainerHeader,
	connectionPanelContainerParagraph,
	connectionPanelContentOptionalIphLink,
	notConnectedSpinnerContainer
} from './ConnectionPanel.styles';
import { ConnectionPendingIcon } from '../icons/ConnectionPendingIcon';
import { NoDataIcon } from '../icons/NoDataIcon';
import { DuplicateServerIcon } from '../icons/DuplicateServerIcon';
import { InProductHelpAction, InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';

type NotConnectedStateProps = {
	connectedState: ConnectedState;
	contentHeader: string,
	contentInstructionOne: string,
	contentInstructionTwo?: string,
	buttonAppearance: Appearance,
	firstButtonLabel: string,
	secondButtonLabel?: string,
	buttonOneOnClick(data?: any): void,
	buttonTwoOnClick?(): void,
	testId?: string,
	isLoading: boolean
};

const ConnectionPanelContent = ({
	connectedState,
	contentHeader,
	contentInstructionOne,
	contentInstructionTwo,
	buttonAppearance,
	firstButtonLabel,
	secondButtonLabel,
	buttonOneOnClick,
	buttonTwoOnClick,
	testId,
	isLoading
}: NotConnectedStateProps): JSX.Element => {
	let icon;

	if (connectedState === ConnectedState.CONNECTED) {
		icon = <NoDataIcon />;
	} else if (connectedState === ConnectedState.PENDING) {
		icon = <ConnectionPendingIcon />;
	} else {
		icon = <DuplicateServerIcon />;
	}

	return (
		<div className={cx(connectionPanelContainerContainer)}>
			{
				isLoading
					? <div className={cx(notConnectedSpinnerContainer)}>
						<Spinner size='large' />
					</div>
					: <>
						{icon}
						<h3 className={cx(connectionPanelContainerHeader)}>{contentHeader}</h3>
						<p className={cx(connectionPanelContainerParagraph)}>{contentInstructionOne}</p>
						<p className={cx(connectionPanelContainerParagraph)}>{contentInstructionTwo}</p>
						<ButtonGroup>
							<Button
								appearance={buttonAppearance}
								onClick={buttonOneOnClick}
								testId={testId}
							>
								{firstButtonLabel}
							</Button>
							{
								secondButtonLabel
									? <Button onClick={buttonTwoOnClick}>{secondButtonLabel}</Button>
									: <></>
							}
						</ButtonGroup>
					</>
			}

			<div className={cx(connectionPanelContentOptionalIphLink)}>
				<InProductHelpAction
					label="Learn more"
					type={InProductHelpActionType.HelpLink}
					appearance="link"
				/>
			</div>
		</div>
	);
};

export { ConnectionPanelContent };
