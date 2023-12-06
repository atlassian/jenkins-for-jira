import React, { useEffect, useState } from 'react';
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
import { fetchModuleKey } from '../../api/fetchModuleKey';

type NotConnectedStateProps = {
	connectedState: ConnectedState,
	moduleKey?: string
};

const NotConnectedState = ({ connectedState }: NotConnectedStateProps): JSX.Element => {
	const [moduleKey, setModuleKey] = useState<string>('');
	const getModuleKey = async () => {
		const currentModuleKey = await fetchModuleKey();
		setModuleKey(currentModuleKey);
	};

	useEffect(() => {
		getModuleKey();
	}, []);

	const notConnectedHeader =
		connectedState === ConnectedState.PENDING ? 'Connection pending' : 'Duplicate server';
	const notConnectedContent =
		connectedState === ConnectedState.PENDING
			? (
				<>
					This connection is pending completion by a Jenkins admin.
					Its set up guide will be available when the connection is complete.
					<span />
					Open connection settings if your Jenkins admin needs to revisit the items they need.
				</>
			)
			: (
				<>
					This connection is a duplicate of SERVER NAME.
					<span />
					Use SERVER NAME to manage this server.
				</>
			);

	let actionToRender;

	if (moduleKey === 'jenkins-for-jira-global-page') {
		actionToRender = null;
	} else if (connectedState === ConnectedState.PENDING) {
		/* TODO - add onClick handler for Connection settings
				- will be done when I build the new set up Jenkins screen */
		actionToRender = <Button>Connection settings</Button>;
	} else {
		actionToRender = <Button appearance="danger" style={{ marginBottom: `${token('space.400')}` }}>Delete</Button>;
	}

	return (
		<div className={cx(notConnectedStateContainer)}>
			<div className={cx(notConnectedTempImgPlaceholder)}></div>
			<h3 className={cx(notConnectedStateHeader)}>{notConnectedHeader}</h3>
			<p className={cx(notConnectedStateParagraph)}>{notConnectedContent}</p>
			{actionToRender}
		</div>
	);
};

export { NotConnectedState };
