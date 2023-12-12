import React from 'react';
import {
	fireEvent, render, waitFor, screen
} from '@testing-library/react';
import { getSiteNameFromUrl, ServerManagement } from './ServerManagement';

document.execCommand = jest.fn();

describe('ServerManagement Component', () => {
	test('should copy to clipboard when "Copy to clipboard" is clicked', async () => {
		render(<ServerManagement />);
		fireEvent.click(screen.getByText('Share page'));
		fireEvent.click(screen.getByText('Copy to clipboard'));

		await waitFor(() => screen.getByText('Copied to clipboard'));
		expect(document.execCommand).toHaveBeenCalledWith('copy');
	});

	test('should close the share modal when "Close" is clicked', async () => {
		render(<ServerManagement />);
		fireEvent.click(screen.getByText('Share page'));
		expect(screen.getByText('Copy to clipboard')).toBeInTheDocument();

		await waitFor(() => screen.getByText('Close'));

		fireEvent.click(screen.getByText('Close'));

		await waitFor(() => {
			expect(screen.queryByText('Copy to clipboard')).not.toBeInTheDocument();
		});
	});

	test('correctly extracts site name from URL', () => {
		const url = 'https://testjira.atlassian.net/jira/apps/blah-blah';
		const siteName = getSiteNameFromUrl(url);
		expect(siteName).toEqual('testjira.atlassian.net');
	});

	test('should render loading icon when request is being made for servers', () => {
		const { getByText } = render(
			<ServerManagement />
		);

		expect(getByText('build')).toBeInTheDocument();
	});

	test('should render loading icon when request is being made for the moduleKey', () => {
		const { getByText } = render(
			<ServerManagement />
		);

		expect(getByText('build')).toBeInTheDocument();
	});

	test('should render ConnectionWizard when fetchAllJenkinsServers returns no servers', () => {
		const { getByText } = render(
			<ServerManagement />
		);

		expect(getByText('build')).toBeInTheDocument();
	});

	test('should render ConnectionPanel when fetchAllJenkinsServers returns servers', () => {
		const { getByText } = render(
			<ServerManagement/>
		);

		expect(getByText('build')).toBeInTheDocument();
	});
});
