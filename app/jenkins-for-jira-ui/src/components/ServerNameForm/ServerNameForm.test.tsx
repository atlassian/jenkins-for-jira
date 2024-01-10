import React from 'react';
import { useParams } from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ServerNameForm } from './ServerNameForm';

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: jest.fn()
}));

describe('Create - ServerNameForm', () => {
	beforeEach(() => {
		(useParams as jest.Mock).mockReturnValue({});
	});

	it('renders form elements correctly', () => {
		const { getByLabelText, getByText } = render(<ServerNameForm />);

		expect(getByLabelText('server name field')).toBeInTheDocument();
		expect(getByText('Give your Jenkins server a name.', { exact: false })).toBeInTheDocument();
		expect(getByText('Next')).toBeInTheDocument();
	});

	it('submits the form correctly on valid input', async () => {
		const { getByLabelText, getByTestId, queryByTestId } = render(<ServerNameForm />);
		const serverNameInput = getByLabelText('server name field');

		fireEvent.change(serverNameInput, { target: { value: 'MyServer' } });
		fireEvent.submit(getByTestId('serverNameForm'));

		expect(getByTestId('loading-button')).toBeInTheDocument();

		await waitFor(() => {});

		expect(queryByTestId('loading-button')).toBeNull();
	});
});

describe('Update - ServerNameForm', () => {
	const mockParams = { id: '2468' };

	beforeEach(() => {
		(useParams as jest.Mock).mockReturnValue(mockParams);
	});
	it('renders form elements correctly', () => {
		const { getByLabelText, getByText } = render(<ServerNameForm />);

		expect(getByLabelText('server name field')).toBeInTheDocument();
		expect(getByText('Update Server name.', { exact: false })).toBeInTheDocument();
		expect(getByText('Save')).toBeInTheDocument();
	});

	it('submits the form correctly on valid input', async () => {
		const { getByLabelText, getByTestId, queryByTestId } = render(<ServerNameForm />);
		const serverNameInput = getByLabelText('server name field');

		fireEvent.change(serverNameInput, { target: { value: 'MyServer' } });
		fireEvent.submit(getByTestId('serverNameForm'));

		expect(getByTestId('loading-button')).toBeInTheDocument();

		await waitFor(() => {});

		expect(queryByTestId('loading-button')).toBeNull();
	});
});

describe('Shared - ServerNameForm', () => {

	it('handles server name input change correctly', () => {
		const { getByLabelText } = render(<ServerNameForm />);
		const serverNameInput = getByLabelText('server name field') as HTMLInputElement;

		fireEvent.change(serverNameInput, { target: { value: 'MyServer' } });

		expect(serverNameInput.value).toBe('MyServer');
	});

	it('displays error message on invalid input', async () => {
		const { getByLabelText, getByTestId, getByText } = render(<ServerNameForm />);
		const serverNameInput = getByLabelText('server name field');

		fireEvent.change(serverNameInput, { target: { value: '' } });
		fireEvent.submit(getByTestId('serverNameForm'));

		expect(getByText('This field is required.')).toBeInTheDocument();
	});
});
