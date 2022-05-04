import { css } from '@emotion/css';

export const headerContainer = css`
	display: flex;
	justify-content: space-between;
	width: 100%;
`;

export const helpLinkContainer = css`
	color: inherit;
	display: flex;

	&:hover {
		color: inherit;
		text-decoration: none;
	}
`;

export const navigateBackContainer = css`
	all: unset;
	cursor: pointer;
	margin-left: 4px;

	&:focus,
	&:focus-visible {
		outline: 2px solid var(--ds-border-focused, #4C9AFF);
		outline-offset: 2px;
	}
`;

export const helpLink = css`
	margin-top: 0;
`;
