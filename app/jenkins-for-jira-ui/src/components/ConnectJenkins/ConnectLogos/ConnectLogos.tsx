import React from 'react';
import { B200, B400 } from '@atlaskit/theme/colors';
import { JiraSoftwareIcon } from '@atlaskit/logo';
import CheckCircle from '../../assets/CheckCircle.svg';
import { JenkinsIcon } from '../../icons/JenkinsIcon';
import { StyledCheckSpacer, StyledConnectLogosContainer } from './ConnectLogos.style';

const ConnectLogos = () => (
	<StyledConnectLogosContainer>
		<JiraSoftwareIcon
			iconColor={B200}
			iconGradientStart={B400}
			iconGradientStop={B200}
		/>
		<StyledCheckSpacer />
		<img src={CheckCircle} alt="Check circle" />
		<StyledCheckSpacer />
		<JenkinsIcon data-testid="jenkins-icon-connect" />
	</StyledConnectLogosContainer>
);

export {
	ConnectLogos
};
