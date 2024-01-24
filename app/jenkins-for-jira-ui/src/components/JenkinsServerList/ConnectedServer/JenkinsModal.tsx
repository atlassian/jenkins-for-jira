import Button, { LoadingButton, Appearance } from '@atlaskit/button';
import React from 'react';
import Modal, {
	KeyboardOrMouseEvent,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
	Appearance as ModalAppearance
} from '@atlaskit/modal-dialog';
import { cx } from '@emotion/css';
import { JenkinsServer } from '../../../../../src/common/types';
import { deleteLoadingIcon, loadingIcon } from './JenkinsModal.styles';
import { secondaryButtonContainer } from '../../ServerManagement/ServerManagement.styles';
import { CopiedToClipboard } from '../../CopiedToClipboard/CopiedToClipboard';
import { DELETE_MODAL_TEST_ID, DISCONNECT_MODAL_TEST_ID } from '../../../common/constants';

type ModalProps = {
	server?: JenkinsServer;
	modalAppearance?: ModalAppearance;
	title: string;
	body: (string | React.ReactElement<any>)[];
	onClose(e: KeyboardOrMouseEvent): void;
	primaryButtonAppearance: Appearance;
	primaryButtonLabel: string;
	secondaryButtonAppearance: Appearance;
	secondaryButtonLabel: string | React.ReactElement<any>;
	secondaryButtonOnClick(
		event: JenkinsServer | undefined | KeyboardOrMouseEvent
	): Promise<void> | void;
	dataTestId: string;
	isLoading?: boolean;
	isCopiedToClipboard?: boolean;
};

const JenkinsModal: React.FC<ModalProps> = ({
	dataTestId,
	server,
	modalAppearance,
	title,
	body,
	onClose,
	primaryButtonAppearance,
	primaryButtonLabel,
	secondaryButtonAppearance,
	secondaryButtonLabel,
	secondaryButtonOnClick,
	isLoading,
	isCopiedToClipboard
}: ModalProps): JSX.Element => {
	console.log('hello?? ', dataTestId);
	const loadingButtonWidthClassName = dataTestId === DELETE_MODAL_TEST_ID ? deleteLoadingIcon : loadingIcon;

	return (
		<ModalTransition>
			<Modal onClose={onClose} testId={dataTestId}>
				<ModalHeader>
					{
						modalAppearance
							? (
								<ModalTitle appearance={modalAppearance}>{title}</ModalTitle>
							)
							: (
								<ModalTitle>{title}</ModalTitle>
							)
					}
				</ModalHeader>
				<ModalBody>{body}</ModalBody>
				<ModalFooter>
					<Button appearance={primaryButtonAppearance} onClick={onClose} testId='closeButton'>
						{primaryButtonLabel}
					</Button>

					{
						isLoading
							? (
								<LoadingButton
									appearance={modalAppearance}
									isLoading
									className={loadingButtonWidthClassName}
								/>
							) : (
								<div className={cx(secondaryButtonContainer)}>
									<Button
										appearance={secondaryButtonAppearance}
										onClick={(event: JenkinsServer | KeyboardOrMouseEvent) =>
											(
												dataTestId === DISCONNECT_MODAL_TEST_ID ||
												dataTestId === DELETE_MODAL_TEST_ID
													? secondaryButtonOnClick(server)
													: secondaryButtonOnClick(event))
										}
										testId='secondaryButton'
									>
										{secondaryButtonLabel}
									</Button>

									{isCopiedToClipboard && <CopiedToClipboard leftPositionPercent="70%" />}
								</div>
							)}

				</ModalFooter>
			</Modal>
		</ModalTransition>
	);
};

export { JenkinsModal };
