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
import {CONFIG_PAGE} from "../../common/constants";

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
	const handleRefreshAfterUpdate = jest.fn();

	test('renders with connected state DUPLICATE', () => {
		render(<NotConnectedState
			connectedState={ConnectedState.DUPLICATE}
			jenkinsServer={mockServer}
			refreshServersAfterDelete={refreshServers}
			refreshServersAfterUpdate={handleRefreshAfterUpdate}
			moduleKey={CONFIG_PAGE}
		/>);
		expect(screen.getByText('Duplicate server')).toBeInTheDocument();
		expect(screen.getByText('Delete')).toBeInTheDocument();
	});

	test('renders with connected state PENDING', () => {
		render(<NotConnectedState
			connectedState={ConnectedState.PENDING}
			jenkinsServer={mockServer}
			refreshServersAfterDelete={refreshServers}
			refreshServersAfterUpdate={handleRefreshAfterUpdate}
			moduleKey={CONFIG_PAGE}
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
			refreshServersAfterDelete={refreshServers}
			refreshServersAfterUpdate={handleRefreshAfterUpdate}
			moduleKey={CONFIG_PAGE}
		/>);

		fireEvent.click(screen.getByText('Delete'));

		await waitFor(() => {
			expect(refreshServers).toHaveBeenCalledWith(mockServer);
			expect(refreshServers).toHaveBeenCalledTimes(1);
		});
	});
});
