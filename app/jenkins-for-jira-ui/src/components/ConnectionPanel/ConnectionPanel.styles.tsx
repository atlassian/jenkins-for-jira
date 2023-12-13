import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const connectionPanelContainer = css`
	border-radius: 8px;
	box-shadow: 0px 2px 4px 0px #091E4240;
	display: flex;
	flex-direction: column;
	padding: ${token('space.300')} ${token('space.300')} ${token('space.0')};
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

	#connection-panel-tabs-1-tab {
		padding-left: ${token('space.0')};
	}

	[role=tablist] {
		&:first-of-type {
			::before {
				margin-left: ${token('space.negative.100')};
			}
		}
	}

	#connection-panel-tabs-0-tab {
		padding: 0;
	}
`;

export const connectionPanelMainConnectedTabs = css`
	margin-top: ${token('space.100')};
	width: 100%;
`;

export const connectionPanelMainConnectedPendingSetUp = css`
	color: #B2B9C4;
	cursor: not-allowed;
	margin: ${token('space.075')} 0 ${token('space.100')} ${token('space.100')};
`;

export const connectionPanelMainNotConnectedTabs = css`
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
	margin: ${token('space.0')} auto;
	max-height: 400px;
	min-height: 400px;
	max-width: 420px;
	position: relative;
	text-align: center;
`;

export const notConnectedSpinnerContainer = css`
	position: absolute;
	top: 50%;
	-ms-transform: translateY(-50%);
	transform: translateY(-50%);
	width: 100%;
`;

export const connectionPanelContainerContainer = css`
	margin: ${token('space.600')} auto;
	max-height: 400px;
	min-height: 400px;
	max-width: 420px;
	position: relative;
	text-align: center;
`;

export const connectionPanelContentOptionalIphLink = css`
	display: flex;
	justify-content: center;
	margin-top: ${token('space.100')};
`;

export const connectionPanelContainerHeader = css`
	font-size: 20px;
	font-weight: 500;
	margin: ${token('space.200')} auto;
`;

export const connectionPanelContainerParagraph = css`
	font-size: 14px;
	line-height: 20px;
	margin-bottom: ${token('space.400')};

	div {
		margin-bottom: ${token('space.300')};
	}
`;

// Connected state
export const connectedStateContainer = css`
	margin-top: ${token('space.200')};

	table {
		border-bottom: none;
	}

	tr:hover {
		background-color: #FFF;
	}
`;

export const connectedStateCellContainer = css`
	align-items: center;
	display: flex;
`;

export const connectedStateCell = css`
	font-size: 14px;
	line-height: 20px;
	margin: ${token('space.050')} 0;
`;

export const connectedStateCellEvent = css`
	margin-left: ${token('space.100')};

	&:first-letter {
		text-transform: capitalize;
	}
`;

// Set up guide
export const setUpGuideContainer = css`
	line-height: 20px;
	margin: ${token('space.300')} 0;

	#setup-step-one-instruction {
		margin: ${token('space.050')} 0 ${token('space.300')} ${token('space.200')};
	}
`;

export const setUpGuideParagraph = css`
	margin-bottom: ${token('space.300')};
`;

export const setUpGuideOrderListItemHeader = css`
	font-weight: bold;
	margin-bottom: ${token('space.200')};
`;

export const setUpGuideUpdatedContainer = css`
	margin: ${token('space.200')} 0 ${token('space.300')};
`;

export const setUpGuideUpdateAvailableContainer = css`
	margin: ${token('space.100')} auto ${token('space.300')};
	line-height: 20px;
	text-align: center;
	width: 55%;
`;

export const setUpGuideUpdateAvailableLoadingContainer = css`
	margin-top: ${token('space.1000')};
	padding: ${token('space.1000')};
	min-height: 180px;
	text-align: center;
`;

export const setUpGuideUpdateAvailableIconContainer = css`
	margin: ${token('space.0')} auto;
	text-align: center;
`;

export const setUpGuideUpdateAvailableHeader = css`
	font-size: 20px;
`;

export const setUpGuideUpdateAvailableContent = css`
	margin-top: ${token('space.250')};
`;

export const setUpGuideUpdateAvailableButtonContainer = css`
	margin-top: ${token('space.200')};
	display: flex;
	gap: 10px;
	justify-content: center;
`;
