import {
	render,
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

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: jest.fn().mockReturnValue({ id: 'uuid_1' })
}));

describe('ConnectJenkins Page Suite', () => {
	it('Should not render form if there is no webhookUrl', () => {
		render(<ConnectJenkins />);
		expect(screen.queryByTestId('jenkinsConfigurationForm')).not.toBeInTheDocument();
	});
});
