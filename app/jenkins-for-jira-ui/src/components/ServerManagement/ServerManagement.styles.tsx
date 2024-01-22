import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const serverManagementContainer = css`
	margin: 0 auto;
	max-width: 936px;
`;

export const headerContainer = css`
	margin-top: 40px;
`;

export const shareModalInstruction = css`
	margin: ${token('space.200')} auto;
`;

export const secondaryButtonContainer = css`
 position: relative;
`;

export const copyToClipboardContainer = css`
	align-items: center;
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0px 2px 4px 0px #091E4240;
	display: flex;
	max-width: 165px;
	position: absolute;
	padding: ${token('space.200')};
	top: -115%;
	transform: translate(-50%, -50%);
	width: 194px;
	z-index: 2;
`;

export const copyToClipboard = css`
	font-weight: normal;
	margin-left: ${token('space.075')};
`;

// Top panel
export const topPanelContainer = css`
	align-items: center;
	border-radius: 8px;
	box-shadow: 0px 2px 4px 0px #091E4240;
	display: flex;
	max-height: 164px;
	padding: ${token('space.0')} ${token('space.300')};
	margin: ${token('space.400')} auto ${token('space.400')} ${token('space.025')};
`;

export const topPanelContentHeaderContainer = css`
	flex-direction: column;
`;

export const topPanelContent = css`
	font-size: 14px;
	line-height: 20px;
	margin: ${token('space.200')} auto ${token('space.200')} 0;
`;

export const topPanelImgContainer = css`
	text-align: right;
	width: 42%;
`;

export const topPanelImg = css`
	width: 75%;
`;
