import styled from '@emotion/styled';

export const StyledInstallationContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

export const BoldSpan = styled.span`
	font-weight: bold;
`;

export const StyledH1 = styled.h1`
	margin-top: 0;
`;

export const StyledInstallationContent = styled.div`
	justify-content: flex-start;
	width: 520px;
	margin-top: 48px;
`;

export const StyledButtonContainer = styled.div`
	display: flex;
`;

export const StyledButtonContainerInstallJenkins = styled(StyledButtonContainer)`
	justify-content: flex-end;
	margin-top: 48px;
`;

export const StyledButtonContainerConnectedServers = styled(StyledButtonContainer)`
	& button:first-of-type {
		margin-right: 3px;
	}

	& button:last-child {
		padding: 0;

		& span {
			margin: 0;
		}
	}
`;
