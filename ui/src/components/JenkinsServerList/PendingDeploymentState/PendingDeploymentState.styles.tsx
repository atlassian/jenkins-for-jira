import { css } from '@emotion/css';

export const pendingDeploymentContainer = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding-top: 100px;
	width: 660px;
	height: 448px;
	margin: 0 auto;

	button {
		max-width: 157px;
	}
`;

export const subheadingText = css`
	font-weight: 600;
	margin-top: 36px;
`;

export const descriptionText = css`
	font-weight: 400;
	width: 430px;
	margin-bottom: 30px;
`;

export const pendingDeploymentIconContainer = css`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 96px 0 80px;
	width: 346px;
`;

export const checkSpacer = css`
	display: flex;
	background: #6B778C;
	width: 16px;
	height: 4px;
	align-self: center;
	margin: 0 16px 0 16px;
`;
