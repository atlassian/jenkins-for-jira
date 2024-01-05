import React from 'react';
import { cx } from '@emotion/css';
import { statusLabel } from './StatusLabel.styles';

export enum ConnectedState {
	CONNECTED = 'CONNECTED',
	DUPLICATE = 'DUPLICATE',
	PENDING = 'PENDING',
	UPDATE_AVAILABLE = 'UPDATE_AVAILABLE'
}

type StatusLabelProps = {
	text: string,
	backgroundColor: string,
	color: string
};

const replaceUnderscoresWithSpaces = (text: string): string => {
	return text.replace(/_/g, ' ');
};

const StatusLabel = ({ text, backgroundColor, color }: StatusLabelProps): JSX.Element => {
	const dynamicStyles = {
		backgroundColor,
		color
	};

	return (
		<p className={cx(statusLabel)} style={dynamicStyles} data-testid="status-label">
			{replaceUnderscoresWithSpaces(text)}
		</p>
	);
};

export { StatusLabel };
