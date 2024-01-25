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
import { DELETE_MODAL_TEST_ID, GLOBAL_PAGE } from '../../common/constants';
import { JenkinsModal } from '../JenkinsServerList/ConnectedServer/JenkinsModal';
import { AnalyticsEventTypes, AnalyticsTrackEventsEnum } from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';

const analyticsClient = new AnalyticsClient();

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
	const [serverToDeleteUuid, setServerToDeleteUuid] = useState<string>('');
	const [isDeletingServer, setIsDeletingServer] = useState<boolean>(false);
	const [showRetryServerDelete, setShowRetryServerDelete] = useState<boolean>(false);

	const deleteServer = async (serverToDelete: JenkinsServer) => {
		setIsDeletingServer(true);
		setServerToDeleteUuid(serverToDelete.uuid);

		try {
			await disconnectJenkinsServer(serverToDelete.uuid);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.DeleteServerSuccessName,
				{
					action: `submitted ${AnalyticsTrackEventsEnum.DeleteServerSuccessName}`,
					actionSubject: 'form'
				}
			);
		} catch (e) {
			setShowRetryServerDelete(true);
			setIsDeletingServer(false);
			console.log('Failed to delete server', e);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.DeleteServerFailureName,
				{
					action: `submitted ${AnalyticsTrackEventsEnum.DeleteServerFailureName}`,
					actionSubject: 'form'
				}
			);
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

	const closeRetryServerDelete = async () => {
		setIsDeletingServer(false);
		setShowRetryServerDelete(false);
	};

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

			{
				showRetryServerDelete &&
				(isDeletingServer && jenkinsServer.uuid === serverToDeleteUuid) &&
					<JenkinsModal
						dataTestId={DELETE_MODAL_TEST_ID}
						server={jenkinsServer}
						modalAppearance='danger'
						title={`An error occurred while deleting your connection to ${jenkinsServer?.name}`}
						body={[
							'Something went wrong while deleting ',
							<strong key={jenkinsServer.name}>{jenkinsServer?.name}</strong>,
							', please try again.'
						]}
						onClose={closeRetryServerDelete}
						primaryButtonAppearance='subtle'
						primaryButtonLabel='Cancel'
						secondaryButtonAppearance='danger'
						secondaryButtonLabel='Try again'
						secondaryButtonOnClick={deleteServerWrapper}
						isLoading={isDeletingServer}
					/>
			}
		</div>
	);
};

export { NotConnectedState };
