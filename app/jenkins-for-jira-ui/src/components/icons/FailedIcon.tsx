import { StyledSvg, StyledSvgContainer } from './Icon.styles';

export function FailedIcon(): JSX.Element {
	return (
		<StyledSvgContainer>
			<StyledSvg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="none"
				view-box="0 0 16 16"
				data-testid="failedIcon"
			>
				<circle r="8" cx="8" cy="8" fill="#DE350B" />
				<circle r="6" cx="8" cy="8" fill="#fff" />
				<path
					fill="#DE350B"
					fillRule="evenodd"
					d="M.768 9.768a2.5 2.5 0 010-3.536L6.232.768a2.5 2.5 0 013.536 0l5.464 5.464a2.5 2.5 0 010 3.536l-5.464 5.464a2.5 2.5 0 01-3.536 0L.768 9.768zM7 4a1 1 0 112 0v4a1 1 0 01-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z"
				/>
			</StyledSvg>
		</StyledSvgContainer>
	);
}
