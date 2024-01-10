import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const iphActionContainer = css`
	margin-left: 16px;
`;

export const inProductHelpActionLink = css`
	background-color: inherit;
	border: none;
	color: ${token('color.link')};
	cursor: pointer;
	margin-bottom: ${token('space.025')};
	padding: ${token('space.0')};
`;

export const inProductHelpActionButton = css`
	background-color: ${token('color.link')};
	border-radius: 3px;
	color: ${token('color.text.inverse')};
	cursor: pointer;
	font-weight: 500;
	line-height: 30px;
	padding: 0 10px;
	text-decoration: none;
	transition: background 0.1s ease-out,box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);
	vertical-align: middle;
	white-space: nowrap;
	width: auto;

	&:hover {
		background-color: ${token('color.background.brand.bold.hovered')};
	}

	&:active {
		background-color: ${token('color.background.brand.bold.pressed')};
	}
`;
