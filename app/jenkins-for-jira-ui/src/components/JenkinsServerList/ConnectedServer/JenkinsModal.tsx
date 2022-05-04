import Button, { LoadingButton } from '@atlaskit/button';
import React from 'react';
import Modal, {
	Appearance,
	KeyboardOrMouseEvent,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition
} from '@atlaskit/modal-dialog';
import { Appearance as ButtonAppearance } from '@atlaskit/button';
import { JenkinsServer } from '../../../../../src/common/types';
import { loadingIcon } from './JenkinsModal.styles';

type ModalProps = {
	server?: JenkinsServer;
	show: boolean;
	modalAppearance: Appearance;
	title: string;
	body: (string | React.ReactElement<any>)[];
	onClose(e: KeyboardOrMouseEvent): void;
	primaryButtonAppearance: ButtonAppearance;
	primaryButtonLabel: string;
	secondaryButtonAppearance: Appearance;
	secondaryButtonLabel: string | React.ReactElement<any>;
	secondaryButtonOnClick(
		event: JenkinsServer | undefined | KeyboardOrMouseEvent
	): Promise<void> | void;
	dataTestId: string;
	isLoading?: boolean;
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
	isLoading
}: ModalProps): JSX.Element => {
	return (
		<ModalTransition>
			{show && (
				<Modal onClose={onClose} testId={dataTestId}>
					<ModalHeader>
						<ModalTitle appearance={modalAppearance}>{title}</ModalTitle>
					</ModalHeader>
					<ModalBody>{body}</ModalBody>
					<ModalFooter>
						<Button appearance={primaryButtonAppearance} onClick={onClose} testId='closeButton'>
							{primaryButtonLabel}
						</Button>

						{isLoading
							? <LoadingButton appearance='warning' isLoading className={loadingIcon} />
							:	<Button
								appearance={secondaryButtonAppearance}
								onClick={(event: JenkinsServer | KeyboardOrMouseEvent) =>
									dataTestId === 'disconnectModal'
										? secondaryButtonOnClick(server)
										: secondaryButtonOnClick(event)
								}
								testId='secondaryButton'
							>
								{secondaryButtonLabel}
							</Button>
						}

					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
};

export { JenkinsModal };
