import { render, screen } from '@testing-library/react';

import { ConnectLogos } from './ConnectLogos';

describe('ConnectLogos Page Suite', () => {
	it('Should render Jira logo, Jenkins logo and check mark', () => {
		render(<ConnectLogos />);
		expect(screen.getByRole('img', { name: 'Jira Software' })).toBeInTheDocument();
		expect(screen.getByRole('img', { name: 'Check circle' })).toBeInTheDocument();
		expect(screen.getByTestId('jenkins-icon-connect')).toBeInTheDocument();
	});
});
