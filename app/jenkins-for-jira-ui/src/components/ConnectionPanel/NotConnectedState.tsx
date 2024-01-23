import React, { useState } from 'react';
import { cx } from '@emotion/css';
import Spinner from '@atlaskit/spinner';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import {
	notConnectedSpinnerContainer,
	notConnectedStateContainer
} from './ConnectionPanel.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { disconnectJenkinsServer } from '../../api/disconnectJenkinsServer';
import { ConnectionPanelContent } from './ConnectionPanelContent';
import { DELETE_MODAL_TEST_ID, GLOBAL_PAGE} from '../../common/constants';
import { JenkinsModal } from '../JenkinsServerList/ConnectedServer/JenkinsModal';

type NotConnectedStateProps = {
	connectedState: ConnectedState,
	jenkinsServer: JenkinsServer,
	refreshServersAfterDelete(serverToRefresh: JenkinsServer): void,
	refreshServersAfterUpdate(serverUuidToUpdate: string): void,
	uuidOfRefreshServer?: string,
	isUpdatingServer?: boolean,
	moduleKey: string
};

const NotConnectedState = ({
	connectedState,
	refreshServersAfterDelete,
	jenkinsServer,
	refreshServersAfterUpdate,
	uuidOfRefreshServer,
	isUpdatingServer,
	moduleKey
}: NotConnectedStateProps): JSX.Element => {
	const [serverToDeleteUuid, setServerToDelteUuid] = useState<string>('');
	const [isDeletingServer, setIsDeletingServer] = useState<boolean>(false);
	const [disconnectError, setDisconnectError] = useState(false);
	const [showRetryServerDelete, setShowRetryServerDelete] = useState(false);

	const deleteServer = async (serverToDelete: JenkinsServer) => {
		setIsDeletingServer(true);
		setDisconnectError(false);
		setServerToDelteUuid(serverToDelete.uuid);

		try {
			await disconnectJenkinsServer(serverToDelete.uuid);
		} catch (e) {
			console.log('Failed to disconnect server', e);
			setDisconnectError(true);
		} finally {
			setIsDeletingServer(false);
		}

		refreshServersAfterDelete(serverToDelete);
	};

	const deleteServerWrapper = async () => {
		await deleteServer(jenkinsServer);
	};

	const isPending = connectedState === ConnectedState.PENDING;

	let firstButtonLabel;

	if (connectedState === ConnectedState.DUPLICATE && moduleKey !== GLOBAL_PAGE) {
		firstButtonLabel = 'Delete';
	} else if (connectedState === ConnectedState.DUPLICATE && moduleKey === GLOBAL_PAGE) {
		firstButtonLabel = undefined;
	} else {
		firstButtonLabel = 'Refresh';
	}

	return (
		<div className={cx(notConnectedStateContainer)}>
			{
				(isUpdatingServer && jenkinsServer.uuid === uuidOfRefreshServer) ||
				(isDeletingServer && jenkinsServer.uuid === serverToDeleteUuid)	? (
						<div className={cx(notConnectedSpinnerContainer)}>
							<Spinner size='large' />
						</div>
					) : (
						<>
							<ConnectionPanelContent
								connectedState={connectedState}
								contentHeader={isPending ? 'Connection pending' : 'Duplicate server'}
								contentInstructionOne=
									{
										isPending
											? 'This connection is pending completion by a Jenkins admin.'
											: `Use ${jenkinsServer.originalConnection} to manage this connection.`
									}
								buttonAppearance={isPending ? 'primary' : 'danger'}
								firstButtonLabel={firstButtonLabel}
								secondButtonLabel={isPending ? 'Learn more' : undefined}
								buttonOneOnClick={
									isPending
										? () => refreshServersAfterUpdate(jenkinsServer.uuid) : deleteServerWrapper
								}
								testId={!isPending ? `delete-button-${jenkinsServer.name}` : undefined}
								isIph={true}
								jenkinsServerUuid={serverToDeleteUuid}
							/>
						</>
					)}

			<JenkinsModal
				dataTestId={DELETE_MODAL_TEST_ID}
				server={jenkinsServer}
				show={showConfirmServerDisconnect}
				modalAppearance={buttonAndIconAppearance}
				title={modalTitleMessage}
				body={modalBodyMessage}
				onClose={closeConfirmServerDisconnect}
				primaryButtonAppearance='subtle'
				primaryButtonLabel='Cancel'
				secondaryButtonAppearance={buttonAndIconAppearance}
				secondaryButtonLabel={secondaryButtonLabel}
				secondaryButtonOnClick={disconnectJenkinsServerHandler}
				isLoading={isLoading}
			/>
		</div>
	);
};

export { NotConnectedState };
