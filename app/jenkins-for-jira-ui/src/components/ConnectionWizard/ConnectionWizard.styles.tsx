import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const connectionWizardContainer = css`
	align-items: center;
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: center;
	margin: ${token('space.negative.400')} auto;
	width: 360px;
`;

export const connectionWizardContentContainer = css`
	margin-left: ${token('space.negative.400')};
	width: 100%;
`;

export const connectionWizardHeader = css`
	font-size: 24px;
	margin: ${token('space.400')} ${token('space.0')};
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

export const connectionWizardInfoPaneIphLink = css`
	max-width: 330px;
`;

export const connectionWizardInfoPanelContent = css`
	display: flex;
`;

export const connectionWizardInProductHelpLink = css`
	line-height: 20px;
	margin-top: ${token('space.negative.050')};
	text-align: left;
	max-width: 330px;
`;

export const connectionWizardButton = css`
	margin-top: ${token('space.300')};

	span {
		align-items: center;
		display: flex;
	}
`;
