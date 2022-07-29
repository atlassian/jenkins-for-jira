import { render } from '@testing-library/react';
import { JenkinsConfigurationForm } from './JenkinsConfigurationForm';

describe('JenkinsConfigurationForm Suite', () => {
	describe('Secret Input', () => {
		const onSubmit = jest.fn();
		const setServerName = jest.fn();
		const setSecret = jest.fn();
		const setHasError = jest.fn();

		it('should not render loading button is isLoading is false', async () => {
			const secret = 'initialSecret';

			const { queryByTestId } = render(
				<JenkinsConfigurationForm
					onSubmit={onSubmit}
					submitButtonText='Done'
					webhookUrl='someWebhookUrl'
					serverName='myServerIsTheBest'
					setServerName={setServerName}
					secret={secret}
					setSecret={setSecret}
					hasError={false}
					setHasError={setHasError}
					isLoading={false}
				/>
			);

			expect(queryByTestId('loading-button')).not.toBeInTheDocument();
		});

		it('should render LoadingButton is isLoading is true', async () => {
			const secret = 'initialSecret';

			const { getByTestId } = render(
				<JenkinsConfigurationForm
					onSubmit={onSubmit}
					submitButtonText='Done'
					webhookUrl='someWebhookUrl'
					serverName='myServerIsTheBest'
					setServerName={setServerName}
					secret={secret}
					setSecret={setSecret}
					hasError={false}
					setHasError={setHasError}
					isLoading={true}
				/>
			);

			expect(getByTestId('loading-button')).toBeInTheDocument();
		});
	});
});
