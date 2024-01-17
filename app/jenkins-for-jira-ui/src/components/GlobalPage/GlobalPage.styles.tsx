import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const globalPageContainer = css`
	margin: auto;
	max-width: 936px;
`;

export const globalStateEmptyStateContainer = css`
	margin: ${token('space.1000')} auto;
	padding-top: ${token('space.200')};
	text-align: center;
	width: 450px;
`;
