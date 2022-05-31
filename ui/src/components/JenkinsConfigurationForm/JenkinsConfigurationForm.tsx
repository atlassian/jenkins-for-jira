import React, { Fragment, useState } from 'react';
import Button, { LoadingButton } from '@atlaskit/button';
import Textfield from '@atlaskit/textfield';
import Form, {
	FormFooter,
	ErrorMessage,
	Field,
	HelperMessage
} from '@atlaskit/form';
import WatchIcon from '@atlaskit/icon/glyph/watch';
import {
	StyledWatchIcon,
	StyledInputHeaderContainer,
	StyledTextfieldErrorContainer,
	textfieldContainer,
	loadingIcon
} from './JenkinsConfigurationForm.styles';
import { FormTooltip } from '../Tooltip/Tooltip';
import { JenkinsModal } from '../JenkinsServerList/ConnectedServer/JenkinsModal';

// TODO - delete this after we start generating a new secret on the backend
const charactersForSecret =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateNewSecret = () => {
	const SECRET_LENGTH = 20;
	let newSecret = '';
	const numberOfSecretCharacters = charactersForSecret.length;

	for (let i = 0; i < SECRET_LENGTH; i++) {
		newSecret += charactersForSecret.charAt(
			Math.floor(Math.random() * numberOfSecretCharacters)
		);
	}

	return newSecret;
};

type JenkinsConfigurationFormProps = {
	onSubmit(): void;
	submitButtonText: string;
	webhookUrl: string;
	serverName: string;
	secret: string;
	setSecret: (secret: string) => string | void;
	setServerName: (event: React.ChangeEvent<HTMLInputElement>) => void;
	hasError: boolean;
	errorMessage?: string;
	setHasError: (error: boolean) => boolean | void;
	isLoading: boolean;
};

const JenkinsConfigurationForm = ({
	onSubmit,
	submitButtonText,
	webhookUrl,
	serverName,
	secret,
	setSecret,
	setServerName,
	hasError,
	errorMessage,
	setHasError,
	isLoading
}: JenkinsConfigurationFormProps) => {
	const [passwordIsVisible, setPasswordIsVisible] = useState(false);
	const [showConfirmRefreshSecret, setShowConfirmRefreshSecret] =
		useState(false);

	const togglePassword = () => {
		setPasswordIsVisible(!passwordIsVisible);
	};

	const onClickRefresh = async () => {
		setShowConfirmRefreshSecret(true);
	};

	const refreshSecret = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		setSecret(generateNewSecret());
		setShowConfirmRefreshSecret(false);
	};

	const closeConfirmRefreshSecret = () => {
		setShowConfirmRefreshSecret(false);
	};

	return (
		<Fragment>
			<Form onSubmit={onSubmit}>
				{({ formProps }: any) => (
					<form {...formProps} name='jenkins-configuration-form' data-testid="jenkinsConfigurationForm">
						<StyledInputHeaderContainer>
							<h3>Jenkins server </h3>
							<FormTooltip
								content='Create a display name for your Jenkins server.'
								label='Jenkins Server'
							/>
						</StyledInputHeaderContainer>

						<StyledTextfieldErrorContainer hasError={hasError}>
							<Field label='Server name' name='server-name-label'>
								{() => (
									<Textfield
										name='server-name'
										value={serverName}
										aria-label='server name field'
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											setServerName(event);
											setHasError(false);
										}}
									/>
								)}
							</Field>
							{hasError && (
								<ErrorMessage testId='error-message'>
									{errorMessage}
								</ErrorMessage>
							)}
						</StyledTextfieldErrorContainer>

						<StyledInputHeaderContainer>
							<h3>Webhook URL</h3>
							<FormTooltip
								content={
									<span>
										On your Jenkins server, navigate to{' '}
										<b>Manage Jenkins {'>'} Configure system.</b> Find the{' '}
										<b>Jira Software Cloud Integration</b> plugin and create a
										Jira Cloud site with this webhook URL.
									</span>
								}
								label='Webhook Url'
							/>
						</StyledInputHeaderContainer>
						<Field
							label='Unique webhook'
							name='server-webhook-url-label'
						>
							{() => (
								<>
									<div className={textfieldContainer}>
										<Textfield
											name='server-webhook-url'
											aria-label='webhook url field'
											value={webhookUrl}
											readOnly
											isRequired
											isCompact
										/>
									</div>
									<HelperMessage>
										Copy and paste this webhook into your Jenkins server
										configuration. This is unique to your site.
									</HelperMessage>
								</>
							)}
						</Field>

						<StyledInputHeaderContainer>
							<h3>Secret</h3>
							<FormTooltip
								content={
									<span>
										On your Jenkins server, navigate to{' '}
										<b>Manage Jenkins {'>'} Configure system.</b> Find the{' '}
										<b>Jira Software Cloud Integration</b> plugin and create a
										Jira Cloud site with this secret. Choose <b>Secret text</b>{' '}
										as the kind of secret.
									</span>
								}
								label='Secret'
							/>
						</StyledInputHeaderContainer>

						<Field
							label='Unique secret'
							name='server-webhook-url-label'
						>
							{() => (
								<>
									<div className={textfieldContainer}>
										<Textfield
											name='server-secret'
											type={passwordIsVisible ? 'text' : 'password'}
											aria-label='server secret field'
											value={secret}
											readOnly
											testId='server-secret'
											elemAfterInput={
												<StyledWatchIcon
													onClick={togglePassword}
													data-testid='watch-icon'
												>
													<WatchIcon label='Toggle Password View' />
												</StyledWatchIcon>
											}
											isCompact
										/>
										<Button
											onClick={() => onClickRefresh()}
											testId='openRefreshModal'
										>
											Refresh
										</Button>
									</div>

									<HelperMessage>
										Copy and paste this secret into Jenkins to retrieve your build or deployment data.{' '}
										Click refresh to generate a new secret.
									</HelperMessage>
								</>
							)}
						</Field>

						<FormFooter>
							{isLoading
								? <LoadingButton appearance='primary' isLoading className={loadingIcon} testId='loading-button' />
								:	<Button type='submit' appearance='primary' testId='submit-button'>
									{submitButtonText}
								</Button>
							}
						</FormFooter>
					</form>
				)}
			</Form>

			<JenkinsModal
				dataTestId={REFRESH_MODAL_TEST_ID}
				show={showConfirmRefreshSecret}
				modalAppearance='warning'
				title='Refresh your server secret?'
				body={[
					'Are you sure that you want to refresh your Jenkins server secret? This means that you will need to configure your new secret with Jenkins to connect to your server.'
				]}
				onClose={closeConfirmRefreshSecret}
				primaryButtonAppearance='subtle'
				primaryButtonLabel='Cancel'
				secondaryButtonAppearance='warning'
				secondaryButtonLabel='Refresh secret'
				secondaryButtonOnClick={(event: React.MouseEvent<HTMLElement>) =>
					refreshSecret(event)
				}
			/>
		</Fragment>
	);
};

export const REFRESH_MODAL_TEST_ID = 'refreshModal';
export { JenkinsConfigurationForm };
