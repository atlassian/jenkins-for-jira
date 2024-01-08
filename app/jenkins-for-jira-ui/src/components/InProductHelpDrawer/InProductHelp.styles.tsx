import { css } from '@emotion/css';
import { token } from '@atlaskit/tokens';

export const inProductHelpActionLink = css`
	background-color: inherit;
	border: none;
	color: ${token('color.link')};
	margin-bottom: ${token('space.025')};
	padding: ${token('space.0')} !important;

	span {
    font-weight: normal;
    margin: ${token('space.0')};
		line-height: 20px;
		text-align: left;
		white-space: normal !important;
  }

	&:hover {
		text-decoration: none !important;
	}
`;
