import { useEffect } from 'react';
import {
	act,
	render,
	waitFor,
	screen
} from '@testing-library/react';
import { invoke } from '@forge/bridge';
import { renderHook } from '@testing-library/react-hooks';
import { ManageConnection } from './ManageConnection';

jest.mock('uuid', () => {
	let counter = 0;
	counter += 1;
	const uuidGen = () => `uuid_${counter}`;
	uuidGen.reset = () => {
		counter = 0;
	};
	return { v4: uuidGen };
});

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: jest.fn().mockReturnValue({ id: 'uuid_1' })
}));

jest.mock('@forge/bridge', () => ({
	invoke: jest.fn().mockReturnValue('mockValue')
}));

describe('ManageConnection Page Suite', () => {
	it('Should not render form if there is no webhookUrl', () => {
		render(<ManageConnection />);
		expect(
			screen.queryByTestId('jenkinsConfigurationForm')
		).not.toBeInTheDocument();
	});

	it('Should render form if there request as returned webhookUrl', async () => {
		render(<ManageConnection />);
		const mockGetServer = jest.fn();

		const { rerender } = renderHook(
			({ uuid, getServer }) => {
				useEffect(() => {}, [uuid, getServer]);
			},
			{
				initialProps: { uuid: '', getServer: mockGetServer }
			}
		);

		rerender({ uuid: 'uuid_1', getServer: mockGetServer });
		expect(invoke).toHaveBeenCalledWith('fetchJenkinsEventHandlerUrl');

		act(async (): Promise<void> => {
			expect(
				await waitFor(() => screen.getByTestId('jenkinsConfigurationForm'))
			).toBeInTheDocument();
		});
	});
});
