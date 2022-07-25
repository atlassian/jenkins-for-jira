import React from 'react';
import { Status } from '@atlaskit/progress-tracker/dist/types/types';
// TODO: Find out why the Atlassian and Forge packages break ESLint
// eslint-disable-next-line
import { ProgressTracker, Stages } from '@atlaskit/progress-tracker';
import { useHistory } from 'react-router';
import { progressTrackerContainer } from './ConfigurationSteps.styles';

type AppProps = {
	currentStage: string;
};

const mapCreateStatus = (currentStage: unknown): Status => {
	switch (currentStage) {
		case 'create':
			return 'current';
		case 'connect':
			return 'visited';
		default:
			return 'unvisited';
	}
};

// This is not reusable for other configuration steps.
// Choosing to apply YAGNI for now.
const ConfigurationSteps = ({ currentStage }: AppProps) => {
	const history = useHistory();

	const stages: Stages = [
		{
			id: 'install',
			label: 'Install plugin',
			percentageComplete:
				currentStage === 'install'
					? 0
					: 100,
			status:
				currentStage === 'install'
					? 'current'
					: 'visited',
			href: '#',
			onClick: () => { history.push('/install'); }
		},
		{
			id: 'create',
			label: 'Create server',
			percentageComplete:
				currentStage === 'create' || currentStage === 'install'
					? 0
					: 100,
			status: mapCreateStatus(currentStage),
			href: '#'
		},
		{
			id: 'connect',
			label: 'Connect server',
			percentageComplete: 0,
			status:
				currentStage === 'connect'
					? 'current'
					: 'unvisited',
			href: '#'
		}
	];

	return (
		<div className={progressTrackerContainer}>
			<ProgressTracker items={stages} />
		</div>
	);
};

export {
	ConfigurationSteps
};
