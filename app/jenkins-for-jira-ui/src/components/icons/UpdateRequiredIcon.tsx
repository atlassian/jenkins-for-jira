import React from 'react';
import { cx } from '@emotion/css';

type UpdateRequiredIconProps = {
	containerClassName: string
};

export const UpdateRequiredIcon = ({ containerClassName }: UpdateRequiredIconProps): JSX.Element => {
	return (
		<div className={cx(containerClassName)} data-testid="updateRequiredIcon">
			<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g clip-path="url(#clip0_918_34638)">
					<rect width="114.796" height="160" transform="translate(23)" fill="white" fill-opacity="0.01"/>
					<path d="M94.4778 59.082H51.1599V109.541H94.4778V59.082Z" fill="#FFAB00"/>
					<path d="M51.1599 59.082V109.339C53.181 102.333 55.4041 88.0505 67.9346 78.282C76.2883 71.8147 80.8694 73.8357 88.2799 66.8294C90.6378 64.6062 92.7936 61.9789 94.6125 59.082H51.1599V59.082Z" fill="url(#paint0_linear_918_34638)"/>
					<path d="M66.3179 109.543H23V160.002H66.3179V109.543Z" fill="#0057D8"/>
					<path d="M137.796 59.082H94.4778V109.541H137.796V59.082Z" fill="#FFC400"/>
					<path d="M74.7389 50.457H58.0315V59.1476H74.7389V50.457Z" fill="#FFC400"/>
					<path d="M130.992 50.457H114.284V59.1476H130.992V50.457Z" fill="#FFC400"/>
					<path d="M109.636 8.69141H66.3179V59.1504H109.636V8.69141Z" fill="url(#paint1_linear_918_34638)"/>
					<path opacity="0.1" d="M94.3431 50.4609H77.6357V59.1515H94.3431V50.4609Z" fill="url(#paint2_linear_918_34638)"/>
					<path d="M46.579 0H29.8716V8.69053H46.579V0Z" fill="#344563"/>
					<path d="M74.7389 0H58.0315V8.69053H74.7389V0Z" fill="#4F6079"/>
					<path d="M102.832 0H86.1243V8.69053H102.832V0Z" fill="#4F6079"/>
					<path opacity="0.1" d="M66.3179 109.543H23V160.002H27.7158C32.1621 157.038 36.1368 153.13 38.9663 149.021C44.5579 140.802 41.8632 136.76 46.8484 127.732C51.9011 118.436 59.7832 113.45 66.3179 110.284V109.543Z" fill="url(#paint3_linear_918_34638)"/>
					<path d="M109.636 109.543H66.3179V160.002H109.636V109.543Z" fill="#0065FF"/>
					<path d="M46.579 100.852H29.8716V109.542H46.579V100.852Z" fill="#0057D8"/>
					<path d="M74.7389 100.852H58.0315V109.542H74.7389V100.852Z" fill="#0057D8"/>
					<path d="M102.832 50.457H86.1243V59.1476H102.832V50.457Z" fill="#FFC400"/>
					<path d="M66.3179 8.69141H23V59.1504H66.3179V8.69141Z" fill="#344563"/>
					<path opacity="0.2" d="M66.3179 8.69141H59.8505C53.3832 11.6556 47.1853 16.9104 43.2779 22.704C37.6863 30.923 40.3811 34.9651 35.3958 43.9925C32.0947 50.0556 27.5811 54.2998 23 57.3988V59.083H66.3179V8.69141Z" fill="url(#paint4_linear_918_34638)"/>
				</g>
				<defs>
					<linearGradient id="paint0_linear_918_34638" x1="72.8769" y1="113.382" x2="72.8768" y2="22.2853" gradientUnits="userSpaceOnUse">
						<stop offset="0.2502" stop-color="#FFC400" stop-opacity="0"/>
						<stop offset="0.3519" stop-color="#FFC400" stop-opacity="0.1356"/>
						<stop offset="1" stop-color="#FFC400"/>
					</linearGradient>
					<linearGradient id="paint1_linear_918_34638" x1="88.0062" y1="59.1103" x2="88.0062" y2="8.67894" gradientUnits="userSpaceOnUse">
						<stop stop-color="#344563"/>
						<stop offset="1" stop-color="#5E6C84"/>
					</linearGradient>
					<linearGradient id="paint2_linear_918_34638" x1="85.9851" y1="59.1326" x2="85.9851" y2="50.4545" gradientUnits="userSpaceOnUse">
						<stop stop-color="#344563"/>
						<stop offset="1" stop-color="#5E6C84"/>
					</linearGradient>
					<linearGradient id="paint3_linear_918_34638" x1="48.863" y1="159.453" x2="37.7194" y2="94.1036" gradientUnits="userSpaceOnUse">
						<stop stop-color="#091E42"/>
						<stop offset="1" stop-color="#091E42" stop-opacity="0.1"/>
					</linearGradient>
					<linearGradient id="paint4_linear_918_34638" x1="40.8263" y1="10.8275" x2="51.9699" y2="76.1773" gradientUnits="userSpaceOnUse">
						<stop stop-color="#091E42"/>
						<stop offset="1" stop-color="#091E42" stop-opacity="0.1"/>
					</linearGradient>
					<clipPath id="clip0_918_34638">
						<rect width="114.796" height="160" fill="white" transform="translate(23)"/>
					</clipPath>
				</defs>
			</svg>
		</div>
	);
};
