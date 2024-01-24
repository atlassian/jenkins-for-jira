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
	border-radius: 3px;
	cursor: pointer;
	font-weight: 500;
	line-height: 30px;
	padding: 0 10px;
	text-decoration: none;
	transition: background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);
	vertical-align: middle;
	white-space: nowrap;
	width: auto;
`;

export const inProductHelpActionButtonPrimary = css`
	background-color: ${token('color.link')};
	color: ${token('color.text.inverse')};

	&:hover {
		background-color: ${token('color.background.brand.bold.hovered')};
	}

	&:active {
		background-color: ${token('color.background.brand.bold.pressed')};
	}
`;

export const inProductHelpActionButtonDefault = css`
	background-color: #f1f2f4;

	&:hover {
		background-color: ${token('color.background.neutral.hovered')};
	}

	&:active {
		background-color: ${token('color.background.neutral.pressed')};
	}
`;

export const inProductHelpDrawerContainer = css`
	padding: ${token('space.100')} ${token('space.800')} ${token('space.400')} ${token('space.0')};
`;

export const inProductHelpDrawerErrorContainer = css`
	margin: ${token('space.1000')} ${token('space.1000')} auto ${token('space.0')};
	text-align: center;
`;

export const inProductHelpDrawerErrorIcon = css`
	margin-top: ${token('space.1000')};
`;

export const inProductHelpDrawerErrorTitle = css`
	font-size: 20px;
	font-weight: 500;
`;

export const inProductHelpDrawerErrorContent = css`
	margin: ${token('space.300')} auto;
`;

export const inProductHelpDrawerTitle = css`
	margin-bottom: ${token('space.100')};
`;

export const iphLoadingContainer = css`
	height: 300px;
	padding-top: 100px;
	text-align: center;
	width: 580px;

	span {
		margin: ${token('space.1000')} ${token('space.1000')} auto auto;
	}
`;
