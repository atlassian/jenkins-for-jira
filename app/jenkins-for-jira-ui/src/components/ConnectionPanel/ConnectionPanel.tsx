import React from 'react';
import { cx } from '@emotion/css';
import { ConnectionPanelMain } from './ConnectionPanelMain';
import { ConnectionPanelTop } from './ConnectionPanelTop';
import { connectionPanelContainer } from './ConnectionPanel.styles';

const ConnectionPanel = (): JSX.Element => {
	return (
		<div className={cx(connectionPanelContainer)}>
			<ConnectionPanelTop />
			<ConnectionPanelMain />
		</div>
	);
};

export { ConnectionPanel };
