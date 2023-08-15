import { useFlags } from 'launchdarkly-react-client-sdk';
import React, { Fragment, useState } from 'react';
import Button, { LoadingButton } from '@atlaskit/button';
import Form, {
	FormFooter
} from '@atlaskit/form';
import {
	loadingIcon
} from './JenkinsConfigurationForm.styles';
import { JenkinsModal } from '../JenkinsServerList/ConnectedServer/JenkinsModal';
import { ServerConfigurationFormName } from './ServerConfigurationFormElements/ServerConfigurationFormName/ServerConfigurationFormName';
import { ServerConfigurationFormWebhookUrl } from './ServerConfigurationFormElements/ServerConfigurationFormWebhokUrl/ServerConfigurationFormWebhookUrl';
import { ServerConfigurationFormSecret } from './ServerConfigurationFormElements/ServerConfigurationFormSecret/ServerConfigurationFormSecret';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';
import { generateNewSecret } from '../../api/generateNewSecret';

const charactersForSecret =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateNewSecretUNSAFE = () => {
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
	pageTitle: string;
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
	isLoading,
	pageTitle
}: JenkinsConfigurationFormProps) => {
	const analyticsClient = new AnalyticsClient();
	const { test } = useFlags();
	const [showConfirmRefreshSecret, setShowConfirmRefreshSecret] =
		useState(false);
	const isOnManageConnectPage = pageTitle.includes('Manage');
	const analyticsSourcePage = isOnManageConnectPage
		? AnalyticsScreenEventsEnum.ManageJenkinsConnectionScreenName
		: AnalyticsScreenEventsEnum.ConnectJenkinsServerScreenName;

	const refreshSecret = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		if (test) {
			console.log('create secret on backend');
			setSecret(await generateNewSecret());
		} else {
			console.log('create secret on client', test, process.env.NODE_ENV);
			setSecret(generateNewSecretUNSAFE());
		}

		setShowConfirmRefreshSecret(false);

		const analyticsUiEvent = isOnManageConnectPage
			? AnalyticsUiEventsEnum.RefreshSecretConfirmManageJenkinsServerName
			: AnalyticsUiEventsEnum.RefreshSecretConfirmConnectJenkinsServerName;

		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			analyticsUiEvent,
			{
				source: analyticsSourcePage,
				action: 'clicked refresh confirm',
				actionSubject: 'button'
			}
		);
	};

	const closeConfirmRefreshSecret = () => {
		setShowConfirmRefreshSecret(false);

		const analyticsUiEvent = isOnManageConnectPage
			? AnalyticsUiEventsEnum.RefreshSecretCancelManageJenkinsServerName
			: AnalyticsUiEventsEnum.RefreshSecretCancelConnectJenkinsServerName;

		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			analyticsUiEvent,
			{
				source: analyticsSourcePage,
				action: 'clicked refresh cancel',
				actionSubject: 'button'
			}
		);
	};

	return (
		<Fragment>
			<div>TEST {test}</div>

			<div>
				{/* Check if the flag is true or false */}
				{test ? (
					<p>Generate Server Secret is enabled!</p>
				) : (
					<p>Generate Server Secret is disabled.</p>
				)}
			</div>
			);
			<Form onSubmit={onSubmit}>
				{({ formProps }: any) => (
					<form {...formProps} name='jenkins-configuration-form' data-testid="jenkinsConfigurationForm">
						<ServerConfigurationFormName
							serverName={serverName}
							setServerName={setServerName}
							hasError={hasError}
							errorMessage={errorMessage}
							setHasError={setHasError}
						/>

						{test && <div> SEERVER SECRETSJHDFBSJDHFBSF</div>}

						<ServerConfigurationFormWebhookUrl
							webhookUrl={webhookUrl}
						/>

						<ServerConfigurationFormSecret
							secret={secret}
							setShowConfirmRefreshSecret={setShowConfirmRefreshSecret}
						/>

						<FormFooter>
							{isLoading
								? <LoadingButton appearance='primary' isLoading className={loadingIcon} testId='loading-button'/>
								: <Button type='submit' appearance='primary' testId='submit-button'>
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
