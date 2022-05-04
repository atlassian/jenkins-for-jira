import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const StyledConnectedServerContainer = styled.section`
	margin-top: 2em;
`;

export const StyledConnectedServerTableContainer = styled.div`
	margin-top: 2em;
`;

export const StyledConnectedServerTableHeaderContainer = styled.div`
	align-items: center;
	display: flex;
	justify-content: space-between;
	margin-bottom: 1em;
`;

export const StyledConnectedServerTableHeaderTitleImg = styled.div`
	margin-right: 0.7em;
`;

export const StyledConnectedServerTableHeaderTitleContainer = styled.div`
	display: flex;
`;

export const StyledConnectedServerTableHeaderTitle = styled.a`
	color: #172B4D;
	font-size: 1.2rem;

	&:hover {
		text-decoration: none;
		color: #172B4D;
	}
`;

export const StyledConnectedServerTableCellContainer = styled.div`
	align-items: center;
	display: flex;
`;

export const StyledConnectedServerTableCellIconContainer = styled.div`
	margin-right: 0.5em;
`;

export const StyledConnectedServerTableCellDescription = styled.p`
	font-size: 0.9rem;
	margin-top: 0;
`;

export const StyledConnectedServerLatestEventIconContainer = styled.div`
	margin-right: 10px;
	text-align: center;
`;

export const StyledConnectedServerTableCellDescriptionEvent = styled(
	StyledConnectedServerTableCellDescription
)`
	font-style: italic;
	font-weight: 300;

	&:first-letter {
		text-transform: capitalize;
	}
`;

export const waitingForDeploymentText = css`
	button {
		font-style: italic;
		font-weight: 400;
		color: #42526E !important;

		&:hover {
			color: #42526E !important;
		}
	}
`;
