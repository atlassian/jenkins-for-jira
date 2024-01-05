import React from 'react';
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
	refreshServersAfterUpdate(serverUuidToUpdate: string): void,
	isLoading: boolean
	setIsLoading(isLoading: boolean): void
};

const NotConnectedState = ({
	connectedState,
	refreshServersAfterDelete,
	jenkinsServer,
	refreshServersAfterUpdate,
	isLoading,
	setIsLoading
}: NotConnectedStateProps): JSX.Element => {
	const deleteServer = async (serverToDelete: JenkinsServer) => {
		setIsLoading(true);

		try {
			await disconnectJenkinsServer(serverToDelete.uuid);
		} catch (e) {
			console.log('Failed to disconnect server', e);
			// TODO - ARC-2722 handle error state
		} finally {
			setIsLoading(false);
		}

		refreshServersAfterDelete(serverToDelete);
	};

	const deleteServerWrapper = async () => {
		await deleteServer(jenkinsServer);
	};

	const handleLearnMore = async () => {
		// TODO - ARC-2736 IPH
	};

	const isPending = connectedState === ConnectedState.PENDING;

	return (
		<div className={cx(notConnectedStateContainer)}>
			{isLoading ? (
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
						buttonOneOnClick={isPending ? refreshServersAfterUpdate : deleteServerWrapper}
						buttonTwoOnClick={isPending ? handleLearnMore : undefined}
						testId={!isPending ? `delete-button-${jenkinsServer.name}` : undefined}
						isLoading={isLoading}
					/>
				</>
			)}
		</div>
	);
};

export { NotConnectedState };
