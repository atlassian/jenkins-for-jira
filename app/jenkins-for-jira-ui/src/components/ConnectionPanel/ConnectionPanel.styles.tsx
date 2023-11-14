import { css } from '@emotion/css';

export const connectionPanelContainer = css`
	border-radius: 8px;
	box-shadow: 0px 2px 4px 0px #091E4240;
	display: flex;
	flex-direction: column;
	max-height: 164px;
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

export const ipAddress = css`
	color: #626F86;
	font-size: 14px;
`;

export const connectionPanelMainContainer = css`
	margin-top: 1em;
`;
