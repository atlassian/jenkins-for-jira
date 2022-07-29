import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ServerConfigurationFormSecret } from './ServerConfigurationFormSecret';

describe('ServerConfigurationFormSecret component', () => {
	it('Should render secret field with supplied secret', async () => {
		const setShowConfirmRefreshSecret = jest.fn();

		const { getByTestId } = render(
			<ServerConfigurationFormSecret
				secret={'My secret'}
				setShowConfirmRefreshSecret={setShowConfirmRefreshSecret}
			/>
		);

		expect(getByTestId('server-secret')).toHaveValue('My secret');
	});

	it('When WatchIcon is clicked, input type should toggle', async () => {
		const setShowConfirmRefreshSecret = jest.fn();

		const { getByTestId } = render(
			<ServerConfigurationFormSecret
				secret={'My secret'}
				setShowConfirmRefreshSecret={setShowConfirmRefreshSecret}
			/>
		);

		expect(getByTestId('server-secret')).toHaveAttribute('type', 'password');

		const watchIcon = getByTestId('watch-icon');

		expect(watchIcon).toBeInTheDocument();
		fireEvent.click(watchIcon);
		expect(getByTestId('server-secret')).toHaveAttribute('type', 'text');

		expect(watchIcon).toBeInTheDocument();
		fireEvent.click(watchIcon);
		expect(getByTestId('server-secret')).toHaveAttribute('type', 'password');

		expect(watchIcon).toBeInTheDocument();
		fireEvent.click(watchIcon);
		expect(getByTestId('server-secret')).toHaveAttribute('type', 'text');
	});
});
