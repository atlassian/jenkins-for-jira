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

type NotConnectedStateProps = {
	connectedState: ConnectedState,
	jenkinsServer: JenkinsServer,
	refreshServersAfterDelete(serverToRefresh: JenkinsServer): void,
	refreshServersAfterUpdate?(serverUuidToUpdate: string): void,
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
	console.log('NotConnectedState', moduleKey);
	const deleteServer = async (serverToDelete: JenkinsServer) => {
		setIsDeletingServer(true);
		setServerToDelteUuid(serverToDelete.uuid);

		try {
			await disconnectJenkinsServer(serverToDelete.uuid);
		} catch (e) {
			console.log('Failed to disconnect server', e);
			// TODO - ARC-2722 handle error state
		} finally {
			setIsDeletingServer(false);
		}

		refreshServersAfterDelete(serverToDelete);
	};

	const deleteServerWrapper = async () => {
		await deleteServer(jenkinsServer);
	};

	const isPending = connectedState === ConnectedState.PENDING;

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
											: `This connection is a duplicate of ${jenkinsServer.originalConnection}.`
									}
								contentInstructionTwo=
									{
										!isPending
											? `Delete this connection and use
										${jenkinsServer.originalConnection} to manage this connection instead`
											: undefined
									}
								buttonAppearance={isPending ? 'primary' : 'danger'}
								firstButtonLabel={isPending ? 'Refresh' : 'Delete'}
								secondButtonLabel={isPending ? 'Learn more' : undefined}
								buttonOneOnClick={
									isPending
										? () => (refreshServersAfterUpdate || (() => {}))(jenkinsServer.uuid)
										: deleteServerWrapper
								}
								testId={!isPending ? `delete-button-${jenkinsServer.name}` : undefined}
								isIph={true}
								jenkinsServerUuid={serverToDeleteUuid}
								moduleKey={moduleKey}
							/>
						</>
					)}
		</div>
	);
};

export { NotConnectedState };
