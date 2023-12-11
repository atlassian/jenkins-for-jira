import React from 'react';
import {
	render, screen, fireEvent, waitFor
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
});
