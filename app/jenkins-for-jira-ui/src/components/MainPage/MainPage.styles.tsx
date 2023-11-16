import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const mainPageContainer = css`
	margin: 0 auto;
	max-width: 936px;
`;

// Top panel
export const topPanelContainer = css`
	align-items: center;
	border-radius: 8px;
	box-shadow: 0px 2px 4px 0px #091E4240;
	display: flex;
	max-height: 164px;
	padding: ${token('space.300')};
	margin: ${token('space.400')} auto ${token('space.400')} ${token('space.025')};
`;

export const topPanelContentHeaderContainer = css`
	flex-direction: column;
`;

export const topPanelContentHeader = css`
	font-size: 20px;
	line-height: 24px;
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
