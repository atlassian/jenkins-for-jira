import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const jenkinsSetupContainer = css`
	margin-bottom: ${token('space.400')};

	[type=button] {
		border-radius: 100px;
	}
`;

export const jenkinsSetupServerName = css`
	color: ${token('color.text.subtle')};
	margin-bottom: ${token('space.300')};
`;

export const jenkinsSetupHeader = css`
	font-size: 16px;
	font-weight: 500;
`;

export const jenkinsSetupContent = css`
	font-size: 14px;
	margin: ${token('space.300')} auto !important;
`;

export const jenkinsSetupCopyContainer = css`
	border-top: 2px solid #dde0e5;
	margin-top: ${token('space.400')};

	[type=button] {
		border-radius: 0;
	}
`;

export const jenkinsSetupOrderedList = css`
	margin-bottom: ${token('space.400')};
`;

export const jenkinsSetupListItem = css`
	align-items: center;
	color: #182a4e;
	display: flex;
	font-weight: bold;

	[role=presentation] {
		span {
			height: 15px;
			margin: ${token('space.025')} ${token('space.0')} ${token('space.0')} ${token('space.050')};
		}
	}
`;

export const jenkinsSetupCopyButtonContainer = css`
	margin-left: auto;
	position: relative;
`;

export const jenkinsSetUpInfoPanel = css`
	background-color: #F7F8F9;
	display: flex;
	padding: ${token('space.250')};

	[role=img] {
		margin-right: ${token('space.200')};
	}

	p {
		margin-top: ${token('space.0')};
	}
`;

export const jenkinsSetUpInfoPanelContentContainer = css`
	max-width: 350px;
`;

export const jenkinsSetUpInfoPanelHelpLink = css`
	white-space: normal;
	[type=button] {
		margin-right: ${token('space.200')};
		white-space: normal;
		span {
			color: red !important;
		}
	}
	button {
		white-space: normal;
		span {
			white-space: normal;
		}
	}
`;

export const jenkinsSetUpCopyHiddenContent = css`
	position: absolute;
	width: 1px;
	height: 1px;
	margin: -1px;
	padding: 0;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	border: 0;
`;

export const jenkinsSetUpCopyContentPrompt = css`
	font-weight: bold;
`;
