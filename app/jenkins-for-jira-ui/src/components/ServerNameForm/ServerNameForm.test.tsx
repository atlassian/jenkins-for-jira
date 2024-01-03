import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ServerNameForm } from './ServerNameForm';

describe('ServerNameForm', () => {
	it('renders form elements correctly', () => {
		const { getByLabelText, getByText } = render(<ServerNameForm />);

		expect(getByLabelText('server name field')).toBeInTheDocument();
		expect(getByText('Give your Jenkins server a name.', { exact: false })).toBeInTheDocument();
		expect(getByText('Next')).toBeInTheDocument();
	});

	it('handles server name input change correctly', () => {
		const { getByLabelText } = render(<ServerNameForm />);
		const serverNameInput = getByLabelText('server name field') as HTMLInputElement;

		fireEvent.change(serverNameInput, { target: { value: 'MyServer' } });

		expect(serverNameInput.value).toBe('MyServer');
	});

	it('submits the form correctly on valid input', async () => {
		const { getByLabelText, getByTestId, queryByTestId } = render(<ServerNameForm />);
		const serverNameInput = getByLabelText('server name field');

		fireEvent.change(serverNameInput, { target: { value: 'MyServer' } });
		fireEvent.submit(getByTestId('createServerForm'));

		expect(getByTestId('loading-button')).toBeInTheDocument();

		await waitFor(() => {});

		expect(queryByTestId('loading-button')).toBeNull();
	});

	it('displays error message on invalid input', async () => {
		const { getByLabelText, getByTestId, getByText } = render(<ServerNameForm />);
		const serverNameInput = getByLabelText('server name field');

		fireEvent.change(serverNameInput, { target: { value: '' } });
		fireEvent.submit(getByTestId('createServerForm'));

		expect(getByText('This field is required.')).toBeInTheDocument();
	});

	// Add more tests for edge cases, error handling, etc.
});
