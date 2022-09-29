import React from 'react';
import {
	fireEvent,
	render,
	waitFor
} from '@testing-library/react';
import { CreateServer } from './CreateServer';

describe('CreateServer component', () => {
	it('Should render form with Jenkins server name text field', async () => {
		const { getByTestId } = render(
			<CreateServer />
		);

		expect(getByTestId('server-name')).toBeInTheDocument();
	});

	it('should render Next button if isLoading is false', async () => {
		const { getByTestId } = render(
			<CreateServer />
		);

		expect(getByTestId('submit-button')).toBeInTheDocument();
	});

	it('should render LoadingButton is isLoading is true', async () => {
		const { getByTestId } = render(
			<CreateServer />
		);
		// Input server name into text field and submit
		fireEvent.change(getByTestId('server-name'), { target: { value: 'Server name' } });
		fireEvent.click(getByTestId('submit-button'));

		await waitFor(() => {
			expect(getByTestId('loading-button')).toBeInTheDocument();
		});
	});
});
