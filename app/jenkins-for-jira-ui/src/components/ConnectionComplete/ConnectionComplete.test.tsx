import React from 'react';
import {
	render, screen, act
} from '@testing-library/react';
import { useParams } from 'react-router';
import { ConnectionComplete } from './ConnectionComplete';
import * as getJenkinsServerWithSecretModule from '../../api/getJenkinsServerWithSecret';
import * as fetchGlobalPageUrlModule from '../../api/fetchGlobalPageUrl';

jest.mock('../../api/getJenkinsServerWithSecret');
jest.mock('../../api/fetchGlobalPageUrl');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: jest.fn(),
	useHistory: jest.fn()
}));

afterAll(() => {
	jest.restoreAllMocks();
});

describe('ConnectionComplete Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should only display loader and title during loading state', async () => {
		const mockParams = { id: '12345678', admin: 'is-admin' };
		(useParams as jest.Mock).mockReturnValue(mockParams);

		render(<ConnectionComplete />);

		expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
		expect(screen.getByText('Connect Jenkins to Jira')).toBeInTheDocument();
		expect(screen.queryByText('Server name:')).toBeNull();
	});

	it('should render server name and connection confirmation for Jenkins admin', async () => {
		const mockParams = { id: '12345678', admin: 'is-admin' };
		(useParams as jest.Mock).mockReturnValue(mockParams);

		(getJenkinsServerWithSecretModule.getJenkinsServerWithSecret as jest.Mock).mockResolvedValueOnce({
			name: 'Mocked Server',
			secret: 'mocked-secret'
		});

		await act(async () => {
			render(<ConnectionComplete />);
		});

		expect(screen.getByText(/Server name:/i)).toBeInTheDocument();
		expect(screen.getByText(/Server name:/i)).toHaveTextContent('Mocked Server');
		expect(screen.getByText('Connection complete')).toBeInTheDocument();
		expect(screen.getByText('Your Jenkins server is now connected.')).toBeInTheDocument();
		expect(screen.queryByText('Your Jenkins admin will complete this connection and let you know when it’s ready.')).not.toBeInTheDocument();
	});

	it('should render server name and connection confirmation for non Jenkins admin', async () => {
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		const mockParams = { id: '12345678', admin: 'requires-jenkins-admin' };
		(useParams as jest.Mock).mockReturnValue(mockParams);

		(getJenkinsServerWithSecretModule.getJenkinsServerWithSecret as jest.Mock).mockResolvedValueOnce({
			name: 'Mocked Server',
			secret: 'mocked-secret'
		});

		await act(async () => {
			render(<ConnectionComplete />);
		});

		expect(screen.getByText(/Server name:/i)).toBeInTheDocument();
		expect(screen.getByText(/Server name:/i)).toHaveTextContent('Mocked Server');
		expect(screen.getByText('Connection complete')).toBeInTheDocument();
		expect(screen.getByText('Your Jenkins admin will complete this connection and let you know when it’s ready.')).toBeInTheDocument();
		expect(screen.queryByText('Your Jenkins server is now connected.')).not.toBeInTheDocument();
	});
});
