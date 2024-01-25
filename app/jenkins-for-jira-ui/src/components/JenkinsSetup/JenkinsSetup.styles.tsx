import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const jenkinsSetupContainer = css`
	margin-bottom: ${token('space.400')};

	[type=button] {
		border-radius: 100px;
	}
`;

export const jenkinsSetupServerNameContainer = css`
	color: ${token('color.text.subtle')};
	margin-bottom: ${token('space.0')};
`;

export const jenkinsSetupServerName = css`
	font-weight: bold;
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
		border-radius: 3px;
		width: 90px;
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

export const jenkinsSetupViewButton = css`
	width: 400px;
`;

export const jenkinsSetUpCopyHiddenContent = css`
	border: 0;
	clip: rect(0, 0, 0, 0);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	width: 1px;
`;

export const loadingContainer = css`
	height: 300px;
	padding-top: 100px;
	text-align: center;
	width: 580px;
`;
