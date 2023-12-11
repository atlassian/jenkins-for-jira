import React from 'react';
import {
	fireEvent,
	render,
	screen,
	waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { NotConnectedState } from './NotConnectedState';
import { ConnectedState } from '../StatusLabel/StatusLabel';

describe('NotConnectedState', () => {
	const mockServer = {
		name: 'test server',
		uuid: 'ieufn9283rn2-12u23r92-12eu1e19',
		pipelines: [],
		pluginConfig: {
			ipAddress: '127.0.0.2',
			lastUpdatedOn: new Date()
		}
	};

	const refreshServers = jest.fn();
	const handleRefreshPanel = jest.fn();
	const setIsLoading = jest.fn();

	test('renders with connected state DUPLICATE', () => {
		render(<NotConnectedState
			connectedState={ConnectedState.DUPLICATE}
			jenkinsServer={mockServer}
			refreshServers={refreshServers}
			handleRefreshPanel={handleRefreshPanel}
			isLoading={false}
			setIsLoading={setIsLoading}
		/>);
		expect(screen.getByText('Duplicate server')).toBeInTheDocument();
		expect(screen.getByText('Delete')).toBeInTheDocument();
	});

	test('renders with connected state PENDING', () => {
		render(<NotConnectedState
			connectedState={ConnectedState.PENDING}
			jenkinsServer={mockServer}
			refreshServers={refreshServers}
			handleRefreshPanel={handleRefreshPanel}
			isLoading={false}
			setIsLoading={setIsLoading}
		/>);
		expect(screen.getByText('Connection pending')).toBeInTheDocument();
		expect(screen.getByText('Refresh')).toBeInTheDocument();
		expect(screen.getByText('Learn more')).toBeInTheDocument();
	});

	test('clicking delete button removes the server', async () => {
		// Render component
		render(<NotConnectedState
			connectedState={ConnectedState.DUPLICATE}
			jenkinsServer={mockServer}
			refreshServers={refreshServers}
			handleRefreshPanel={handleRefreshPanel}
			isLoading={false}
			setIsLoading={setIsLoading}
		/>);

		fireEvent.click(screen.getByText('Delete'));

		await waitFor(() => {
			expect(refreshServers).toHaveBeenCalledWith(mockServer);
			expect(refreshServers).toHaveBeenCalledTimes(1);
		});
	});
});
