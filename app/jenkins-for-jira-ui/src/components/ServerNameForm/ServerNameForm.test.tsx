import React from 'react';
import { useParams } from 'react-router';
import {
	render, fireEvent, waitFor, act, screen
} from '@testing-library/react';
import { ServerNameForm } from './ServerNameForm';
import * as getAllJenkinsServersModule from '../../api/getAllJenkinsServers';
import { EventType, JenkinsServer } from '../../../../src/common/types';

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: jest.fn()
}));
jest.mock('../../api/getAllJenkinsServers');

describe('Create - ServerNameForm suite', () => {
	beforeEach(() => {
		(useParams as jest.Mock).mockReturnValue({});
	});

	it('should render form elements correctly', () => {
		const { getByText, getByLabelText } = screen;
		render(<ServerNameForm />);

		expect(getByLabelText('server name field')).toBeInTheDocument();
		expect(getByText('Give your Jenkins server a name.', { exact: false })).toBeInTheDocument();
		expect(getByText('Next')).toBeInTheDocument();
	});

	it('should submit the form correctly on valid input', async () => {
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

	it('should render form elements correctly', () => {
		const { getByLabelText, getByText } = render(<ServerNameForm />);

		expect(getByLabelText('server name field')).toBeInTheDocument();
		expect(getByText('Update server name', { exact: false })).toBeInTheDocument();
		expect(getByText('Save')).toBeInTheDocument();
	});

	it('should submit the form correctly on valid input', async () => {
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
	it('should handle server name input change correctly', () => {
		render(<ServerNameForm />);
		const serverNameInput = screen.getByLabelText('server name field') as HTMLInputElement;
		fireEvent.change(serverNameInput, { target: { value: 'MyServer' } });
		expect(serverNameInput.value).toBe('MyServer');
	});

	it('should display an error message when input is too long', async () => {
		const { getByText, getByLabelText, getByTestId } = screen;
		render(<ServerNameForm />);
		const serverNameInput = getByLabelText('server name field');

		fireEvent.change(
			serverNameInput,
			{
				target:
					{
						value: 'Outer space exists because it\'s afraid to be on the same planet with Chuck Norris.' +
							'Most people have 23 pairs of chromosomes. Chuck Norris has 72'
					}
			}
		);

		fireEvent.submit(getByTestId('serverNameForm'));
		expect(getByText('Server name exceeds 100 characters. Choose a shorter server name and try again.')).toBeInTheDocument();
	});

	it('should display an error message when server name already exists', async () => {
		const server: JenkinsServer[] = [{
			name: 'I already exist',
			uuid: '56046af9-d0eb-4efb-8896-6c9d0da884fe',
			pluginConfig: {
				ipAddress: '10.10.10.10',
				lastUpdatedOn: new Date()
			},
			pipelines: [
				{
					name: '#74315',
					lastEventType: EventType.DEPLOYMENT,
					lastEventStatus: 'successful',
					lastEventDate: new Date()
				},
				{
					name: '#1234',
					lastEventType: EventType.BUILD,
					lastEventStatus: 'failed',
					lastEventDate: new Date()
				}
			]
		}];

		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(server);

		await act(async () => {
			render(<ServerNameForm/>);
		});

		const { getByText, getByLabelText, getByTestId } = screen;
		const serverNameInput = getByLabelText('server name field');
		fireEvent.change(serverNameInput, { target: { value: 'I already exist' } });

		await act(async () => {
			fireEvent.submit(getByTestId('serverNameForm'));
		});

		expect(getByText('This name is already in use. Choose a unique name.')).toBeInTheDocument();
	});
});
