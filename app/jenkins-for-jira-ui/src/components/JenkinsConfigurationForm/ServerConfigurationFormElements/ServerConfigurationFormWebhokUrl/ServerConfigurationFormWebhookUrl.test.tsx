import React from 'react';
import { render } from '@testing-library/react';
import { ServerConfigurationFormWebhookUrl } from './ServerConfigurationFormWebhookUrl';

describe('ServerConfigurationFormWebhookUrl component', () => {
	it('Should render server webhook url field with supplied webhook url', async () => {
		const { getByTestId } = await render(
			<ServerConfigurationFormWebhookUrl
				webhookUrl={'12345678'}
			/>
		);

		expect(getByTestId('webhook-url')).toHaveValue('12345678');
	});
});
