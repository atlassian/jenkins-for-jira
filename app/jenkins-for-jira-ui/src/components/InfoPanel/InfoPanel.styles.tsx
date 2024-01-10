import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const infoPanelContainer = css`
	background-color: #F7F8F9;
	display: flex;
	padding: ${token('space.250')};

	[role=img] {
		margin-right: ${token('space.200')};
	}

	p {
		margin-top: ${token('space.0')};
	}
`;
