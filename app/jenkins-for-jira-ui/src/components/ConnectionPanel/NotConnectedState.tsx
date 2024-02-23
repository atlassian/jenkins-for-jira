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
import { CONFIG_PAGE, DELETE_MODAL_TEST_ID } from '../../common/constants';
import { JenkinsModal } from '../JenkinsServerList/ConnectedServer/JenkinsModal';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsTrackEventsEnum
} from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';

const analyticsClient = new AnalyticsClient();

type NotConnectedStateProps = {
	connectedState: ConnectedState,
	jenkinsServer: JenkinsServer,
	refreshServersAfterDelete(serverToRefresh: JenkinsServer): void,
	refreshServersAfterUpdate(serverUuidToUpdate: string): void,
	uuidOfRefreshServer?: string,
	isUpdatingServer?: boolean,
	moduleKey: string,
	userIsAdmin?: boolean
};

const NotConnectedState = ({
	connectedState,
	refreshServersAfterDelete,
	jenkinsServer,
	refreshServersAfterUpdate,
	uuidOfRefreshServer,
	isUpdatingServer,
	moduleKey,
	userIsAdmin
}: NotConnectedStateProps): JSX.Element => {
	const [serverToDeleteUuid, setServerToDeleteUuid] = useState<string>('');
	const [isDeletingServer, setIsDeletingServer] = useState<boolean>(false);
	const [showRetryServerDelete, setShowRetryServerDelete] = useState<boolean>(false);
	const pageSource = moduleKey === CONFIG_PAGE
		? AnalyticsScreenEventsEnum.ServerManagementScreenName : AnalyticsScreenEventsEnum.GlobalPageScreenName;

	const deleteServer = async (serverToDelete: JenkinsServer) => {
		setIsDeletingServer(true);
		setServerToDeleteUuid(serverToDelete.uuid);

		try {
			await disconnectJenkinsServer(serverToDelete.uuid);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.DeleteServerSuccessName,
				{
					source: pageSource,
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
					source: pageSource,
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

	if (connectedState === ConnectedState.DUPLICATE && (userIsAdmin || moduleKey === CONFIG_PAGE)) {
		firstButtonLabel = 'Delete';
	} else if (connectedState === ConnectedState.DUPLICATE && !userIsAdmin) {
		firstButtonLabel = undefined;
	} else {
		firstButtonLabel = 'Learn more';
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
						<> {isPending
							? <ConnectionPanelContent
								connectedState={connectedState}
								contentHeader= 'Connection pending'
								contentInstructionOne=
									'This connection is pending completion by a Jenkins admin.'
								firstButtonLabel={firstButtonLabel}
								secondButtonLabel='Refresh'
								buttonTwoOnClick={() => refreshServersAfterUpdate(jenkinsServer.uuid)}
								isButtonOneIph={true}
								jenkinsServerUuid={serverToDeleteUuid}/>
							: <ConnectionPanelContent
								connectedState={connectedState}
								contentHeader='Duplicate server'
								contentInstructionOne={`Use ${jenkinsServer.originalConnection} ` +
									'to manage this connection.'}
								buttonOneAppearance='danger'
								firstButtonLabel={firstButtonLabel}
								buttonOneOnClick={deleteServerWrapper}
								buttonTwoTestId={!isPending ? `delete-button-${jenkinsServer.name}` : undefined}
								jenkinsServerUuid={serverToDeleteUuid}
							/>}
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
