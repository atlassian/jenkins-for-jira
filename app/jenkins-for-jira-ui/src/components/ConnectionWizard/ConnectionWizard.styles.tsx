import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const connectionWizardContentContainer = css`
	margin-left: ${token('space.negative.400')};
	width: 100%;

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

export const connectionWizardInfoPanel = css`
	width: 360px;
`;

export const connectionWizardIphContainerClassName = css`
	max-width: 330px;
`;

export const connectionWizardInfoPanelContent = css`
	display: flex;
`;

export const connectionWizardButton = css`
	margin-top: ${token('space.300')};

	span {
		align-items: center;
		display: flex;
	}
`;
