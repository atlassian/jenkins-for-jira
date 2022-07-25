import React from 'react';
import { render } from '@testing-library/react';
import { ServerConfigurationFormName } from './ServerConfigurationFormName';

describe('ServerConfigurationFormName component', () => {
	const setServerName = jest.fn();
	const setHasError = jest.fn();

	it('Should render server name text field with no errors', async () => {
		const { getByTestId, queryByTestId } = await render(
			<ServerConfigurationFormName
				serverName='Server 1'
				setServerName={setServerName}
				hasError={false}
				setHasError={setHasError}
			/>
		);

		expect(getByTestId('server-name')).toHaveValue('Server 1');
		expect(queryByTestId('error-message')).not.toBeInTheDocument();
	});

	it('Should render server name text field with errors', async () => {
		const { getByTestId } = await render(
			<ServerConfigurationFormName
				serverName='Server 1'
				setServerName={setServerName}
				hasError={true}
				setHasError={setHasError}
				errorMessage={'This is an error'}
			/>
		);

		expect(getByTestId('server-name')).toHaveValue('Server 1');
		expect(getByTestId('error-message')).toHaveTextContent('This is an error');
	});
});
