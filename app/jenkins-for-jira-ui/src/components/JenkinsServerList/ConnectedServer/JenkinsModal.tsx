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
import EditorSuccessIcon from '@atlaskit/icon/glyph/editor/success';
import { cx } from '@emotion/css';
import { JenkinsServer } from '../../../../../src/common/types';
import { loadingIcon } from './JenkinsModal.styles';
import {
	copyToClipboard,
	copyToClipboardContainer,
	secondaryButtonContainer
} from '../../ServerManagement/ServerManagement.styles';

type ModalProps = {
	server?: JenkinsServer;
	show: boolean;
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
	show,
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
	return (
		<ModalTransition>
			{show && (
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
									<LoadingButton appearance='warning' isLoading className={loadingIcon} />
								) : (
									<div className={cx(secondaryButtonContainer)}>
										<Button
											appearance={secondaryButtonAppearance}
											onClick={(event: JenkinsServer | KeyboardOrMouseEvent) =>
												(dataTestId === 'disconnectModal'
													? secondaryButtonOnClick(server)
													: secondaryButtonOnClick(event))
											}
											testId='secondaryButton'
										>
											{secondaryButtonLabel}
										</Button>

										{isCopiedToClipboard && (
											<div className={cx(copyToClipboardContainer)}>
												<EditorSuccessIcon
													primaryColor="#23a06b"
													label="Copied to clipboard successfully"
												/>
												<div className={cx(copyToClipboard)}>
													Copied to clipboard
												</div>
											</div>
										)}
									</div>
								)}

					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
};

export { JenkinsModal };
