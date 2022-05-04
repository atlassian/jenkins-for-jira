import { StyledSvg, StyledSvgContainer } from './Icon.styles';

export function CancelledIcon(): JSX.Element {
	return (
		<StyledSvgContainer>
			<StyledSvg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="none"
				view-box="0 0 16 16"
				data-testid="cancelledIcon"
			>
				<circle r="7" cx="8" cy="8" fill="#fff" />
				<path
					d="M4.184 9h8V7h-8v2zm11.367-4.102a8.039 8.039 0 0 0-1.703-2.546A8.122 8.122 0 0 0 11.293.641 7.769 7.769 0 0 0 8.184 0a7.789 7.789 0 0 0-3.102.633 8.043 8.043 0 0 0-2.547 1.703A8.11 8.11 0 0 0 .824 4.891 7.747 7.747 0 0 0 .184 8c0 1.083.211 2.117.632 3.102.422.984.99 1.833 1.704 2.546a8.084 8.084 0 0 0 2.554 1.711 7.766 7.766 0 0 0 3.11.641 7.788 7.788 0 0 0 3.101-.633 8.043 8.043 0 0 0 2.547-1.703 8.133 8.133 0 0 0 1.711-2.555A7.765 7.765 0 0 0 16.184 8a7.796 7.796 0 0 0-.633-3.102z"
					fill="#F9AB00"
					fillRule="evenodd"
				/>
			</StyledSvg>
		</StyledSvgContainer>
	);
}
