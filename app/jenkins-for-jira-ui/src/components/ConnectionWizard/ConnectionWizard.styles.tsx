import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';
// import { token } from '@atlaskit/tokens';

export const connectionWizardContainer = css`
	align-items: center;
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: center;
	width: 496px;
`;

export const connectionWizardInfoBox = css`
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
