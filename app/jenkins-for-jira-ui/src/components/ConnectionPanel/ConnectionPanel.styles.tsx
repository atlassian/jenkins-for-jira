import { css } from '@emotion/css';

export const connectionPanelContainer = css`
	border-radius: 8px;
	box-shadow: 0px 2px 4px 0px #091E4240;
	display: flex;
	flex-direction: column;
	padding: 1.5em;
	margin: 2em auto 2em 0.1em;
	width: 936px;
`;

export const connectionPanelTopContainer = css`
	border-bottom: 1px solid #f4f3f6;
	margin: 0 -1.5em;
	padding: 0 0 1.5em 1.5em;
`;

export const connectionPanelHeaderContainer = css`
	align-items: center;
	display: flex;
	margin-bottom: 0.4em;
`;

export const serverName = css`
	font-size: 20px;
	margin-right: 0.5em;
`;

export const ipAddressStyle = css`
	color: #626F86;
	font-size: 14px;
`;

export const connectionPanelMainContainer = css`
	margin-top: 1em;
`;

export const connectionPanelMainTabs = css`
	align-items: center;
	border-radius: 3px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: 16px;
	margin-bottom: 8px;
	padding: 32px;
	width: 100%;
`;

export const notConnectedStateContainer = css`
	max-width: 420px;
	text-align: center;
`;

export const notConnectedStateHeader = css`
	font-size: 20px;
	font-weight: 500;
	margin: 1em auto;
`;

export const notConnectedStateParagraph = css`
	font-size: 14px;
	line-height: 20px;
`;
