import { render, fireEvent } from '@testing-library/react';
import { JenkinsConfigurationForm } from './JenkinsConfigurationForm';

describe('JenkinsConfigurationForm Suite', () => {
	describe('Secret Input', () => {
		const onSubmit = jest.fn();
		const setServerName = jest.fn();
		const setSecret = jest.fn();
		const setHasError = jest.fn();

		it('On render, secret should be initial value', async () => {
			const { getByTestId } = render(
				<JenkinsConfigurationForm
					onSubmit={onSubmit}
					submitButtonText='Done'
					webhookUrl='someWebhookUrl'
					serverName='myServerIsTheBest'
					setServerName={setServerName}
					secret='soManySecrets'
					setSecret={setSecret}
					hasError={false}
					setHasError={setHasError}
					isLoading={false}
				/>
			);

			expect(getByTestId('server-secret')).toHaveValue('soManySecrets');
		});

		it('When WatchIcon is clicked, input type should toggle', async () => {
			const { getByTestId } = render(
				<JenkinsConfigurationForm
					onSubmit={onSubmit}
					submitButtonText='Done'
					webhookUrl='someWebhookUrl'
					serverName='myServerIsTheBest'
					setServerName={setServerName}
					secret='soManySecrets'
					setSecret={setSecret}
					hasError={false}
					setHasError={setHasError}
					isLoading={false}
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

		it('Secret should refresh when refresh button is clicked', async () => {
			const secret = 'initialSecret';
			const { getByTestId, queryByTestId } = render(
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

			const input = getByTestId('server-secret');
			expect(input).toHaveValue('initialSecret');

			expect(queryByTestId('refreshModal')).not.toBeInTheDocument();

			const openRefreshModalButton = getByTestId('openRefreshModal');
			fireEvent.click(openRefreshModalButton);

			expect(getByTestId('refreshModal')).toBeInTheDocument();

			const refreshButton = getByTestId('secondaryButton');
			fireEvent.click(refreshButton);

			// TODO - determine if there is a way to test an input change that occurs on a click event
			expect(setSecret).toHaveBeenCalledTimes(1);
		});

		it('should not render an error message if hasError is false', async () => {
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

			expect(queryByTestId('error-message')).not.toBeInTheDocument();
		});

		it('should render an error message if hasError is true', async () => {
			const secret = 'initialSecret';
			const errorMsg = 'This field is required.';

			const { getByTestId, getByText } = render(
				<JenkinsConfigurationForm
					onSubmit={onSubmit}
					submitButtonText='Done'
					webhookUrl='someWebhookUrl'
					serverName='myServerIsTheBest'
					setServerName={setServerName}
					secret={secret}
					setSecret={setSecret}
					hasError={true}
					setHasError={setHasError}
					errorMessage={errorMsg}
					isLoading={false}
				/>
			);

			expect(getByTestId('error-message')).toBeInTheDocument();
			expect(getByText(errorMsg)).toBeInTheDocument();
		});

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
