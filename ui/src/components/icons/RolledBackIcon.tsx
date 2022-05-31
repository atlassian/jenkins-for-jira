import { StyledSvg, StyledSvgContainer } from './Icon.styles';

export function RolledBackIcon(): JSX.Element {
	return (
		<StyledSvgContainer>
			<StyledSvg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="none"
				view-box="0 0 16 16"
				data-testid="rolledBackIcon"
			>
				<circle r="7" cx="8" cy="8" fill="#fff" />
				<path
					fill="#FF991F"
					fillRule="evenodd"
					d="M16 8A8 8 0 110 8a8 8 0 0116 0zM7.707 3.293a1 1 0 010 1.414L7.414 5H8.6C10.516 5 12 6.606 12 8.5S10.516 12 8.6 12H7a1 1 0 110-2h1.6c.735 0 1.4-.633 1.4-1.5S9.335 7 8.6 7H7.414l.293.293a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414l2-2a1 1 0 011.414 0z"
					clipRule="evenodd"
				/>
			</StyledSvg>
		</StyledSvgContainer>
	);
}
