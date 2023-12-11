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
  }

	&:hover {
		text-decoration: none !important;
	}
`;
