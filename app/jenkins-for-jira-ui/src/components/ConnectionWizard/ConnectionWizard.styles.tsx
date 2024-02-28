import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const connectionWizardContentContainer = css`
	width: 100%;
	text-align: center;
	margin-bottom: ${token('space.400')};

	#connection-wizard-instruction {
		margin-top: ${token('space.400')};
	}
`;

export const connectionWizardHeader = css`
	font-size: 24px;
	margin: ${token('space.050')} ${token('space.0')};
`;

export const connectionWizardOrderedListItem = css`
	font-weight: 500;
	margin: ${token('space.200')} ${token('space.0')} ${token('space.0')};
`;

export const connectionWizardNestedOrderedListItem = css`
	color: #626F86;
	margin: ${token('space.0')} ${token('space.0')} ${token('space.250')} ${token('space.400')};
`;

export const connectionWizardButton = css`
	margin-top: ${token('space.300')};

	span {
		align-items: center;
		display: flex;
	}
`;

export const connectionInfoContainer = css`
	background-color: #F7F8F9;
	border: 3px;
	display: inline;
	width: 330px;
	padding: ${token('space.250')};

	[role=img] {
		margin-right: ${token('space.200')};
	}

	p {
		margin-top: ${token('space.0')};
	}
`;

export const iconContainer = css`
	margin-right: ${token('space.100')};
`;
