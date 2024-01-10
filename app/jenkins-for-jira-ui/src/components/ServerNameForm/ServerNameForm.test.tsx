import React from 'react';
import {
	render, fireEvent, waitFor, act, screen
} from '@testing-library/react';
import { ServerNameForm } from './ServerNameForm';
import * as getAllJenkinsServersModule from '../../api/getAllJenkinsServers';
import { EventType, JenkinsServer } from '../../../../src/common/types';

jest.mock('../../api/getAllJenkinsServers');

describe('ServerNameForm suite', () => {
	it('should render form elements correctly', () => {
		const { getByText, getByLabelText } = screen;
		render(<ServerNameForm />);

		expect(getByLabelText('server name field')).toBeInTheDocument();
		expect(getByText('Give your Jenkins server a name.', { exact: false })).toBeInTheDocument();
		expect(getByText('Next')).toBeInTheDocument();
	});

	it('should handle server name input change correctly', () => {
		render(<ServerNameForm />);
		const serverNameInput = screen.getByLabelText('server name field') as HTMLInputElement;

		fireEvent.change(serverNameInput, { target: { value: 'MyServer' } });

		expect(serverNameInput.value).toBe('MyServer');
	});

	it('should submit the form correctly on valid input', async () => {
		const { queryByTestId, getByLabelText, getByTestId } = screen;
		render(<ServerNameForm />);
		const serverNameInput = getByLabelText('server name field');

		fireEvent.change(serverNameInput, { target: { value: 'MyServer' } });
		fireEvent.submit(getByTestId('createServerForm'));

		expect(getByTestId('loading-button')).toBeInTheDocument();

		await waitFor(() => {});

		expect(queryByTestId('loading-button')).toBeNull();
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

		fireEvent.submit(getByTestId('createServerForm'));
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
			fireEvent.submit(getByTestId('createServerForm'));
		});

		expect(getByText('This name is already in use. Choose a unique name.')).toBeInTheDocument();
	});
});
