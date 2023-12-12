import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const orderedList = css`
	padding-left: ${token('space.200')};
	list-style: none;
	counter-reset: item;

	#nested-list {
		margin-top: ${token('space.0')};
	}
`;

export const orderedListItem = css`
	margin-bottom: ${token('space.200')};
	padding-left: ${token('space.200')};

	counter-increment: item;
	margin-bottom: ${token('space.075')};

	::before {
		background: #F7F8F9;
		border-radius: 50%;
		content: counter(item);
		display: inline-block;
		font-weight: bold;
		height: ${token('space.400')};
		line-height: ${token('space.400')};
		margin: 0 ${token('space.200')} 0 ${token('space.negative.400')};
		text-align: center;
		width: ${token('space.400')};
	}
`;

export const nestedOrderedList = css`
	counter-reset: item;
	margin-top: 0 !important;
	padding-left: ${token('space.400')};

	p:first-of-type {
		margin-top: ${token('space.100')};;
	}

	p:not(:first-of-type) {
		margin-top: ${token('space.075')};;
	}
`;

export const nestedOrderedListItem = css`
	margin-bottom: ${token('space.400')};
`;

export const infoPanel = css`
	background-color: #F7F8F9;
	display: flex;
	margin-left: ${token('space.100')};
	padding: ${token('space.250')};

	[role=img] {
		margin-right: ${token('space.200')};
	}

	p {
		margin-top: ${token('space.0')};
	}
`;

export const connectionWizardInfoPanelInstruction = css`
	margin-bottom: ${token('space.400')};
`;
