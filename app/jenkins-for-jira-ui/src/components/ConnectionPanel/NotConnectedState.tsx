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
	connectedState: ConnectedState;
	jenkinsServer: JenkinsServer;
	refreshServers(serverToRemove: JenkinsServer): void;
	handleRefreshPanel(serverToRemove: JenkinsServer): void;
};

const NotConnectedState = ({
	connectedState,
	refreshServers,
	jenkinsServer,
	handleRefreshPanel
}: NotConnectedStateProps): JSX.Element => {
	const [isLoading, setIsLoading] = useState(false);

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

		refreshServers(serverToDelete);
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
						buttonOneOnClick={isPending ? handleRefreshPanel : deleteServerWrapper}
						buttonTwoOnClick={isPending ? handleLearnMore : undefined}
						testId={!isPending ? `delete-button-${jenkinsServer.name}` : undefined}
					/>
				</>
			)}
		</div>
	);
};

export { NotConnectedState };
