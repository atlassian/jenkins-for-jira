import React from 'react';
// TODO: Find out why the Atlassian and Forge packages break ESLint
// eslint-disable-next-line
import { ProgressTracker, Stages } from '@atlaskit/progress-tracker';
import { useHistory } from 'react-router';
import { progressTrackerContainer } from './ConfigurationSteps.styles';

type AppProps = {
	currentStage: string;
};

// This is not reusable for other configuration steps.
// Choosing to apply YAGNI for now.
const ConfigurationSteps = ({ currentStage }: AppProps) => {
	const history = useHistory();

	const stages: { [key: string]: Stages } = {
		install: [
			{
				id: 'install',
				label: 'Install plugin',
				percentageComplete: 0,
				status: 'current',
				href: '#',
				onClick: () => history.push('/install')
			},
			{
				id: 'create',
				label: 'Create server',
				percentageComplete: 0,
				status: 'unvisited',
				href: '#'
			},
			{
				id: 'connect',
				label: 'Connect server',
				percentageComplete: 0,
				status: 'unvisited',
				href: '#'
			}
		],
		create: [
			{
				id: 'install',
				label: 'Install plugin',
				percentageComplete: 100,
				status: 'visited',
				href: '#',
				onClick: () => history.push('/install')
			},
			{
				id: 'create',
				label: 'Create server',
				percentageComplete: 0,
				status: 'current',
				href: '#',
				onClick: () => history.push('/create')
			},
			{
				id: 'connect',
				label: 'Connect server',
				percentageComplete: 0,
				status: 'unvisited',
				href: '#'
			}
		],
		connect: [
			{
				id: 'install',
				label: 'Install plugin',
				percentageComplete: 100,
				status: 'visited',
				href: '#',
				onClick: () => history.push('/install')
			},
			{
				id: 'create',
				label: 'Create server',
				percentageComplete: 100,
				status: 'visited',
				href: '#',
				onClick: () => history.push('/create')
			},
			{
				id: 'connect',
				label: 'Connect server',
				percentageComplete: 0,
				status: 'current',
				href: '#'
			}
		]
	};

	return (
		<div className={progressTrackerContainer}>
			<ProgressTracker items={stages[currentStage]} />
		</div>
	);
};

export {
	ConfigurationSteps
};
