import React from 'react';
import { render, screen } from '@testing-library/react';

import { ConfigurationSteps } from './ConfigurationSteps';

describe('ConfigurationSteps Page Suite', () => {
	it('Should render two stages', () => {
		render(<ConfigurationSteps currentStage="install" />);
		expect(screen.getByText('Install plugin')).toBeInTheDocument();
		expect(screen.getByText('Connect your app')).toBeInTheDocument();
	});

	it('Should render correctly with install as currentStage', () => {
		render(<ConfigurationSteps currentStage="install" />);
		const InstallJenkinsStep = screen.getByText('Install plugin');
		const ConnectJenkinsStep = screen.getByText('Connect your app');
		expect(InstallJenkinsStep).toHaveAttribute('style', 'color: rgb(0, 101, 255); font-weight: 600;');
		expect(ConnectJenkinsStep).toHaveAttribute('style', 'color: rgb(94, 108, 132); font-weight: 400;');
	});
});
