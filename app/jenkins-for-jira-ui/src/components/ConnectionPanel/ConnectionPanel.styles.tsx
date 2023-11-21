import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const connectionPanelContainer = css`
	border-radius: 8px;
	box-shadow: 0px 2px 4px 0px #091E4240;
	display: flex;
	flex-direction: column;
	padding: ${token('space.300')};
	margin: ${token('space.400')} auto ${token('space.400')} ${token('space.025')};
`;

export const connectionPanelTopContainer = css`
	border-bottom: 1px solid #f4f3f6;
	display: flex;
	justify-content: space-between;
	padding-bottom: ${token('space.200')};
`;

export const connectionPanelHeaderContainer = css`
	align-items: center;
	flex-direction: column;
	margin-bottom: ${token('space.075')};
`;

export const connectionPanelHeaderContentContainer = css`
	align-items: center;
	display: flex;
	margin-bottom: ${token('space.075')};
`;

export const serverName = css`
	font-size: 20px;
	margin-right: ${token('space.075')};
`;

export const ipAddressStyle = css`
	color: #626F86;
	font-size: 14px;
`;

export const connectionPanelMainContainer = css`
	margin-top: ${token('space.200')};

	#connection-panel-tabs-0 {
		padding-left: ${token('space.0')};

		::after {
			margin-left: ${token('space.negative.400')};
		}
	}

	[role=tablist] {
		&:first-of-type {
			::before {
				margin-left:  ${token('space.negative.100')};
			}
		}
	}
`;

export const connectionPanelMainTabs = css`
	align-items: center;
	border-radius: 3px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: ${token('space.200')} auto ${token('space.100')};
	padding: ${token('space.400')};
	width: 100%;
`;

// Not connected state
export const notConnectedStateContainer = css`
	margin: 0 auto;
	max-width: 420px;
	text-align: center;
`;

// TODO - delete this temp class
export const notConnectedTempImgPlaceholder = css`
	background-color: lightgrey;
	border: 1px solid lightgrey;
	border-radius: 3px;
	height: 160px;
	margin: auto;
	width: 160px;
`;

export const notConnectedStateHeader = css`
	font-size: 20px;
	font-weight: 500;
	margin: ${token('space.200')} auto;
`;

export const notConnectedStateParagraph = css`
	font-size: 14px;
	line-height: 20px;
	margin-bottom: ${token('space.400')};

	div {
		margin-bottom: ${token('space.300')}
	}
`;

// Connected state
export const connectedStateContainer = css`
	margin: 0 auto;
	max-width: 420px;
	text-align: center;
`;
