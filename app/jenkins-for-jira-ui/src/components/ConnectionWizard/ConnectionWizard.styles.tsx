import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const connectionWizardContainer = css`
	align-items: center;
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: center;
	margin: auto;
	width: 360px;
`;

export const connectionWizardHeader = css`
	font-size: 24px;
	margin: ${token('space.0')} ${token('space.0')} ${token('space.150')} ${token('space.0')};
`;

export const connectionWizardOrderedListItem = css`
	font-weight: 500;
	margin: ${token('space.200')} ${token('space.0')} ${token('space.0')};
`;

export const connectionWizardNestedOrderedListItem = css`
	color: #626F86;
	margin: ${token('space.0')} ${token('space.0')} ${token('space.250')} ${token('space.400')};
`;

export const connectionWizardInfoPanel = css`
	width: 360px;
`;
