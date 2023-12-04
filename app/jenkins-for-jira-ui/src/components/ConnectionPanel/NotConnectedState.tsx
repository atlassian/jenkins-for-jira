import React from 'react';
import { cx } from '@emotion/css';
import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';
import { ConnectedState } from '../StatusLabel/StatusLabel';
import {
	notConnectedStateContainer,
	notConnectedStateHeader,
	notConnectedStateParagraph,
	notConnectedTempImgPlaceholder
} from './ConnectionPanel.styles';

type NotConnectedStateProps = {
	connectedState: ConnectedState
};

const NotConnectedState = ({ connectedState }: NotConnectedStateProps): JSX.Element => {
	const notConnectedHeader =
		connectedState === ConnectedState.PENDING ? 'Connection pending' : 'Duplicate server';
	const notConnectedContent =
		connectedState === ConnectedState.PENDING
			? (
				<>
					This connection is pending completion by a Jenkins admin.
					Its set up guide will be available when the connection is complete.
					<div />
					Open connection settings if your Jenkins admin needs to revisit the items they need.
				</>
			)
			: (
				<>
					This connection is a duplicate of SERVER NAME.
					<div />
					Use SERVER NAME to manage this server.
				</>
			);

	return (
		<div className={cx(notConnectedStateContainer)}>
			<div className={cx(notConnectedTempImgPlaceholder)}></div>
			<h3 className={cx(notConnectedStateHeader)}>{notConnectedHeader}</h3>
			<p className={cx(notConnectedStateParagraph)}>{notConnectedContent}</p>
			{/* TODO - add onClick handler for Connection settings
				- will be done when I build the new set up Jenkins screen */}
			{
				connectedState === ConnectedState.PENDING
					? <Button>Connection settings</Button>
					: <Button appearance="danger" style={{ marginBottom: `${token('space.400')}` }}>Delete</Button>
			}
		</div>
	);
};

export { NotConnectedState };
