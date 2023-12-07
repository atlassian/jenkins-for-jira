import React from 'react';
import { cx } from '@emotion/css';
import { statusLabel } from './StatusLabel.styles';

export enum ConnectedState {
	CONNECTED = 'CONNECTED',
	DUPLICATE = 'DUPLICATE',
	PENDING = 'PENDING'
}

type StatusLabelProps = {
	text: string,
	backgroundColor: string,
	color: string
};

const StatusLabel = ({ text, backgroundColor, color }: StatusLabelProps): JSX.Element => {
	const dynamicStyles = {
		backgroundColor,
		color
	};

	return (
		<p className={cx(statusLabel)} style={dynamicStyles} data-testid="status-label">
			{text}
		</p>
	);
};

export { StatusLabel };
