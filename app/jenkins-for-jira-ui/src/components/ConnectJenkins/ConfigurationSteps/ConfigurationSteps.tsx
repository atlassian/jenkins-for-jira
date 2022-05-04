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
			id: 'connect',
			label: 'Connect your app',
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
