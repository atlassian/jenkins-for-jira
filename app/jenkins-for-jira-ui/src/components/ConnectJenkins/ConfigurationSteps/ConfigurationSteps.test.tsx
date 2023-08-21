import React from 'react';
import { render, screen } from '@testing-library/react';

import { ConfigurationSteps } from './ConfigurationSteps';

describe('ConfigurationSteps Page Suite', () => {
	it('Should render three stages', () => {

		render(<ConfigurationSteps currentStage="install" />);
		expect(screen.getByText('Install plugin')).toBeInTheDocument();
		expect(screen.getByText('Create server')).toBeInTheDocument();
		expect(screen.getByText('Connect server')).toBeInTheDocument();
	});
});
