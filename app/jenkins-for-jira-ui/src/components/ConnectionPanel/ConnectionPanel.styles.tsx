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
				margin-left:  ${token('space.negative.100')};
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
	-ms-transform: translateY(-50%);
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 100%;
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

	#setup-step-one-instruction {
		margin: ${token('space.050')} 0 ${token('space.300')} ${token('space.200')};
	}
`;

export const setUpGuideParagraph = css`
	margin-bottom: ${token('space.300')};
`;

export const setUpGuideOrderedList = css`
	padding-left: ${token('space.200')};
	list-style: none;
	counter-reset: item;

	#nested-list {
		margin-top: ${token('space.0')};
	}
`;

export const setUpGuideOrderedListItem = css`
	margin-bottom: ${token('space.200')};
	padding-left: ${token('space.200')};

	counter-increment: item;
	margin-bottom: ${token('space.075')};

	::before {
		background: #F7F8F9;
		border-radius: 50%;
		content: counter(item);
		display: inline-block;
		font-weight: bold;
		height: ${token('space.400')};
		line-height: ${token('space.400')};
		margin: 0 ${token('space.200')} 0 ${token('space.negative.400')};
		text-align: center;
		width: ${token('space.400')};
	}
`;

export const setUpGuideNestedOrderedList = css`
	counter-reset: item;
	margin-top: 0 !important;
	padding-left: ${token('space.400')};

	p:first-of-type {
		margin-top: ${token('space.100')};;
	}

	p:not(:first-of-type) {
		margin-top: ${token('space.075')};;
	}
`;

export const setUpGuideNestedOrderedListItem = css`
	margin-bottom: ${token('space.400')};
`;

export const setUpGuideOrderListItemHeader = css`
	font-weight: bold;
	margin-bottom: ${token('space.200')};
`;

export const setUpGuideLink = css`
	background-color: inherit;
	border: none;
	color: ${token('color.link')};
	padding: ${token('space.0')}
`;

export const setUpGuideInfoPanel = css`
	background-color: #F7F8F9;
	display: flex;
	margin-left: ${token('space.100')};
	padding: ${token('space.250')};

	[role=img] {
		margin-right: ${token('space.100')};
	}

	p {
		margin-top: ${token('space.0')};
	}
`;

export const setUpGuideUpdatedContainer = css`
	margin: ${token('space.200')} 0 ${token('space.300')};
`;

export const setUpGuideUpdateRequiredContainer = css`
	margin: ${token('space.100')} auto ${token('space.300')};
	line-height: 20px;
	text-align: center;
	width: 55%;
`;

export const setUpGuideUpdateRequiredIconContainer = css`
	margin: ${token('space.0')} auto;
	text-align: center;
`;

export const setUpGuideUpdateRequiredHeader = css`
	font-size: 20px;
`;

export const setUpGuideUpdateRequiredContent = css`
	margin-top: ${token('space.250')};
`;

export const setUpGuideUpdateRequiredButtonContainer = css`
	margin-top: ${token('space.200')};
	display: flex;
	gap: 10px;
	justify-content: center;
`;
