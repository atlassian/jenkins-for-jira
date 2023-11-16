import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { NotConnectedState } from './NotConnectedState';
import { ConnectedState } from '../StatusLabel/StatusLabel';

describe('NotConnectedState', () => {
	test('renders with connected state DUPLICATE', () => {
		render(<NotConnectedState connectedState={ConnectedState.DUPLICATE} />);
		expect(screen.getByText('Duplicate server')).toBeInTheDocument();
		expect(screen.getByText('Delete')).toBeInTheDocument();
	});

	test('renders with connected state PENDING', () => {
		render(<NotConnectedState connectedState={ConnectedState.PENDING} />);
		expect(screen.getByText('Connection pending')).toBeInTheDocument();
		expect(screen.getByText('Connection settings')).toBeInTheDocument();
	});
});
