import { useEffect } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import {
	render,
	waitFor,
	screen
} from '@testing-library/react';
import { ConnectJenkins } from './ConnectJenkins';

jest.mock('uuid', () => {
	let counter = 0;
	counter += 1;
	const uuidGen = () => `uuid_${counter}`;
	uuidGen.reset = () => { counter = 0; };
	return { v4: uuidGen };
});

describe('ConnectJenkins Page Suite', () => {
	it('Should not render form if there is no webhookUrl', () => {
		render(<ConnectJenkins />);
		expect(screen.queryByTestId('jenkinsConfigurationForm')).not.toBeInTheDocument();
	});

	it('Should render form if there request as returned webhookUrl', async () => {
		render(<ConnectJenkins />);

		const { rerender } = renderHook(
			({ uuid }) => {
				useEffect(() => {}, [uuid]);
			},
			{
				initialProps: { uuid: '' }
			}
		);

		rerender({ uuid: 'uuid_1' });

		expect(await waitFor(() => screen.getByTestId('jenkinsConfigurationForm'))).toBeInTheDocument();
	});
});
