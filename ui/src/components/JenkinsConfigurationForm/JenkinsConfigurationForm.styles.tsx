import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const textfieldContainer = css`
	display: flex;
	flex-flow: row;
	align-items: center;
	width: 100%;
	justify-content: space-evenly;

	* + button {
		margin-left: 4px;
	}
`;

type StyledTextFieldProps = {
	hasError?: boolean;
};

export const StyledTextfieldErrorContainer = styled.div<StyledTextFieldProps>`
	&& [data-ds--text-field--container] {
		border-color: ${(props: StyledTextFieldProps): string | boolean | undefined => (props.hasError && '#DE350B')}
	}
`;

export const StyledInputHeaderContainer = styled.div`
	align-items: center;
	display: flex;

	&:not(:first-of-type) {
		margin-top: 20px;
	}

	button {
		background-color: #fff;

		&:hover {
			background-color: #fff;

	div {
		span {
			margin-right: 8px;
		}
	}
}
`;

export const StyledWatchIcon = styled.div`
	cursor: pointer;

	span {
		margin-right: 5px;
	}
`;

export const loadingIcon = css`
	min-width: 59px;
`;
