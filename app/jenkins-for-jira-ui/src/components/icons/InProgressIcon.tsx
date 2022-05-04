import { StyledSvg, StyledSvgContainer } from './Icon.styles';

export function InProgressIcon(): JSX.Element {
	return (
		<StyledSvgContainer>
			<StyledSvg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="none"
				view-box="0 0 16 16"
				data-testid="inProgressIcon"
			>
				<circle r="7" cx="8" cy="8" fill="#fff" />
				<path
					fill="#0065FF"
					d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 12.444A4.445 4.445 0 013.556 8a.889.889 0 111.777 0A2.667 2.667 0 008 10.667a.888.888 0 110 1.777zm3.556-3.555a.889.889 0 01-.89-.889A2.667 2.667 0 008 5.333a.889.889 0 010-1.777A4.445 4.445 0 0112.444 8a.888.888 0 01-.888.889z"
				/>
			</StyledSvg>
		</StyledSvgContainer>
	);
}
