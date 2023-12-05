import React, { useState } from 'react';
import { cx } from '@emotion/css';
import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';
import Spinner from '@atlaskit/spinner';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import {
	notConnectedSpinnerContainer,
	notConnectedStateContainer,
	notConnectedStateHeader,
	notConnectedStateParagraph,
	notConnectedTempImgPlaceholder
} from './ConnectionPanel.styles';
import { JenkinsServer } from '../../../../src/common/types';
import { disconnectJenkinsServer } from '../../api/disconnectJenkinsServer';

type NotConnectedStateProps = {
	connectedState: ConnectedState;
	jenkinsServer: JenkinsServer;
	refreshServers(serverToRemove: JenkinsServer): void;
};

const NotConnectedState = ({
	connectedState,
	jenkinsServer,
	refreshServers
}: NotConnectedStateProps): JSX.Element => {
	const [isLoading, setIsLoading] = useState(false);

	const deleteServer = async (serverToDelete: JenkinsServer) => {
		setIsLoading(true);
		try {
			await disconnectJenkinsServer(serverToDelete.uuid);
		} catch (e) {
			console.log('Failed to disconnect server', e);
		} finally {
			setIsLoading(false);
		}

		refreshServers(serverToDelete);
	};

	const notConnectedHeader =
		connectedState === ConnectedState.PENDING ? 'Connection pending' : 'Duplicate server';
	const notConnectedContent =
		connectedState === ConnectedState.PENDING ? (
			<>
				This connection is pending completion by a Jenkins admin.
				Its set up guide will be available when the connection is complete.
				<span />
				Open connection settings if your Jenkins admin needs to revisit the items they need.
			</>
		) : (
			<>
				This connection is a duplicate of SERVER NAME.
				<span />
				Use SERVER NAME to manage this server.
			</>
		);

	return (
		<div className={cx(notConnectedStateContainer)}>
			{isLoading ? (
				<div className={cx(notConnectedSpinnerContainer)}>
					<Spinner size='large' />
				</div>
			) : (
				<>
					<div className={cx(notConnectedTempImgPlaceholder)}></div>
					<h3 className={cx(notConnectedStateHeader)}>{notConnectedHeader}</h3>
					<p className={cx(notConnectedStateParagraph)}>{notConnectedContent}</p>
					{/* TODO - add onClick handler for Connection settings
          - will be done when I build the new set up Jenkins screen */}
					{connectedState === ConnectedState.PENDING ? (
						<Button>Connection settings</Button>
					) : (
						<Button
							appearance="danger"
							style={{ marginBottom: `${token('space.400')}` }}
							onClick={() => deleteServer(jenkinsServer)}
						>
							Delete
						</Button>
					)}
				</>
			)}
		</div>
	);
};

export { NotConnectedState };
