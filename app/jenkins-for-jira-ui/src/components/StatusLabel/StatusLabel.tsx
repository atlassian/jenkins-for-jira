import React from 'react';
import { cx } from '@emotion/css';
import { statusLabel } from './StatusLabel.styles';

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
		<p className={cx(statusLabel)} style={dynamicStyles}>
			{text}
		</p>
	);
};

export { StatusLabel };
