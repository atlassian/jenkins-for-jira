import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectionPanelTop } from './ConnectionPanelTop';
import { ConnectedState } from '../StatusLabel/StatusLabel';

// Mock the StatusLabel component
jest.mock('../StatusLabel/StatusLabel', () => ({
	StatusLabel: ({ text, color, backgroundColor }: { text: string; color: string; backgroundColor: string }) => (
		<div data-testid="status-label" style={{ color, backgroundColor }}>
			{text}
		</div>
	)
}));

describe('ConnectionPanelTop', () => {
	test('renders with the correct content and styles for CONNECTED state', () => {
		const ipAddress = '10.0.0.1';
		render(<ConnectionPanelTop connectedState={ConnectedState.CONNECTED} ipAddress={ipAddress} />);

		const nameLabel = screen.getByText(/Insert name/i);
		const ipAddressLabel = screen.getByText(`IP address: ${ipAddress}`);
		const statusLabel = screen.getByTestId('status-label');

		expect(nameLabel).toBeInTheDocument();
		expect(ipAddressLabel).toBeInTheDocument();
		expect(statusLabel).toHaveStyle({ color: '#206e4e', backgroundColor: '#dcfff1' });
		expect(statusLabel).toHaveTextContent('CONNECTED');
	});

	test('renders with the correct content and styles for DUPLICATE state', () => {
		const ipAddress = '10.0.0.1';
		render(<ConnectionPanelTop connectedState={ConnectedState.DUPLICATE} ipAddress={ipAddress} />);

		const nameLabel = screen.getByText(/Insert name/i);
		const ipAddressLabel = screen.getByText(`IP address: ${ipAddress}`);
		const statusLabel = screen.getByTestId('status-label');

		expect(nameLabel).toBeInTheDocument();
		expect(ipAddressLabel).toBeInTheDocument();
		expect(statusLabel).toHaveStyle({ color: '#ae2e24', backgroundColor: '#ffecea' });
		expect(statusLabel).toHaveTextContent('DUPLICATE');
	});

	test('renders with the correct content and styles for PENDING state', () => {
		const ipAddress = '10.0.0.1';
		render(<ConnectionPanelTop connectedState={ConnectedState.PENDING} ipAddress={ipAddress} />);

		const nameLabel = screen.getByText(/Insert name/i);
		const ipAddressLabel = screen.getByText(`IP address: ${ipAddress}`);
		const statusLabel = screen.getByTestId('status-label');

		expect(nameLabel).toBeInTheDocument();
		expect(ipAddressLabel).toBeInTheDocument();
		expect(statusLabel).toHaveStyle({ color: '#a54900', backgroundColor: '#fff7d6' });
		expect(statusLabel).toHaveTextContent('PENDING');
	});
});
