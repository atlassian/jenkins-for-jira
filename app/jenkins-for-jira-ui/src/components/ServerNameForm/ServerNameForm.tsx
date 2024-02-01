import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { cx } from '@emotion/css';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import Form, {
	ErrorMessage, Field, FormFooter, HelperMessage
} from '@atlaskit/form';
import { v4 as uuidv4 } from 'uuid';
import Textfield from '@atlaskit/textfield';
import { router } from '@forge/bridge';
import { isValidServerName } from '../../common/util/jenkinsConnectionsUtils';
import { connectionFlowContainer, connectionFlowInnerContainer } from '../../GlobalStyles.styles';
import { ConnectionFlowHeader } from '../ConnectionWizard/ConnectionFlowHeader';
import { createJenkinsServer } from '../../api/createJenkinsServer';
import { updateJenkinsServer } from '../../api/updateJenkinsServer';
import { generateNewSecret } from '../../api/generateNewSecret';
import {
	loadingIcon,
	StyledTextfieldErrorContainer,
	textfieldContainer
} from '../JenkinsConfigurationForm/JenkinsConfigurationForm.styles';
import { serverNameForm, serverNameFormButton, serverNameFormOuterContainer } from './ServerNameForm.styles';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsServer } from '../../../../src/common/types';
import { ParamTypes } from '../ConnectJenkins/ConnectJenkins/ConnectJenkins';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsTrackEventsEnum
} from '../../common/analytics/analytics-events';
import { fetchGlobalPageUrl } from '../../api/fetchGlobalPageUrl';

const analyticsClient = new AnalyticsClient();

const jenkinsServerNameExists = (servers: JenkinsServer[], serverName: string): boolean => {
	return servers.some((server: JenkinsServer) => server.name === serverName);
};

type ServerNameFormFieldProps = {
	serverName: string,
	setServerName: (event: React.ChangeEvent<HTMLInputElement>) => void,
	serverNameHelperText?: string,
	hasError: boolean,
	errorMessage?: string
};

const ServerNameFormField = ({
	serverName,
	setServerName,
	serverNameHelperText = '',
	hasError,
	errorMessage
}: ServerNameFormFieldProps) => {
	return (
		<>
			<StyledTextfieldErrorContainer hasError={hasError}>
				<Field label='Server name' name='server-name-label' isRequired>
					{() => (
						<>
							<div className={textfieldContainer}>
								<Textfield
									name='server-name'
									value={serverName}
									aria-label='server name field'
									testId='server-name'
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										setServerName(event);
									}}
								/>
							</div>

							<HelperMessage>
								{serverNameHelperText}
							</HelperMessage>
						</>
					)}
				</Field>
				{ hasError && (
					<ErrorMessage testId='error-message'>
						{errorMessage}
					</ErrorMessage>
				)}
			</StyledTextfieldErrorContainer>
		</>
	);
};

const ServerNameForm = (): JSX.Element => {
	const history = useHistory();
	const { path } = useParams<ParamTypes>();
	const [serverName, setServerName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const params = useParams<ParamTypes>();
	const [globalPageUrl, setGlobalPageUrl] = useState<string>('');
	const editingServerUuid = params ? params.id : undefined;

	useEffect(() => {
		const viewType = editingServerUuid ? 'editing server name' : 'creating server name';

		const fetchData = async () => {
			try {
				const url = await fetchGlobalPageUrl();
				setGlobalPageUrl(url);

				await analyticsClient.sendAnalytics(
					AnalyticsEventTypes.ScreenEvent,
					AnalyticsScreenEventsEnum.ServerNameScreenName,
					{ viewType }
				);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [editingServerUuid]);

	const setServerNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newServerName = event.target.value;

		if (!!errorMessage && newServerName.length > 0) {
			setErrorMessage('');
		}

		setServerName(newServerName);
	};

	const handleFormSubmit = async () => {
		if (!isValidServerName(serverName, setErrorMessage)) {
			return;
		}

		setIsLoading(true);
		const servers = await getAllJenkinsServers() || [];
		if (jenkinsServerNameExists(servers, serverName)) {
			setErrorMessage('This name is already in use. Choose a unique name.');
		} else if (editingServerUuid) {
			await updateServer(servers);
		} else {
			await createServer();
		}
		setIsLoading(false);
	};

	const updateServer = async (jenkinsServers: JenkinsServer[]) => {
		try {
			const jenkinsServerToUpdate = jenkinsServers.find(
				(server) => server.uuid === editingServerUuid
			);
			if (!jenkinsServerToUpdate) {
				return;
			}
			await updateJenkinsServer({
				...jenkinsServerToUpdate,
				name: serverName
			});

			setIsLoading(false);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.UpdatedServerNameSuccessName,
				{
					action: `submitted ${AnalyticsTrackEventsEnum.UpdatedServerNameSuccessName}`,
					actionSubject: 'form'
				}
			);

			if (path === 'admin') {
				history.push(`/`);
			} else {
				router.navigate(globalPageUrl);
			}
		} catch (e) {
			console.error('Error: ', e);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.UpdatedServerNameFailureName,
				{
					action: `submitted ${AnalyticsTrackEventsEnum.UpdatedServerNameFailureName}`,
					actionSubject: 'form'
				}
			);
		}
	};

	const createServer = async () => {
		const uuid = uuidv4();

		try {
			await createJenkinsServer({
				name: serverName,
				uuid,
				secret: await generateNewSecret(),
				pipelines: []
			});

			setIsLoading(false);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.CreatedNewServerSuccessName,
				{
					action: `submitted ${AnalyticsTrackEventsEnum.CreatedNewServerSuccessName}`,
					actionSubject: 'form'
				}
			);

			history.push(`/setup/${uuid}/new-connection/${path}`);
		} catch (e) {
			console.error('Error: ', e);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.CreatedNewServerFailureName,
				{
					action: `submitted ${AnalyticsTrackEventsEnum.CreatedNewServerFailureName}`,
					actionSubject: 'form'
				}
			);
		}
	};

	const submitButtonIsDisabled = !serverName.length || !!errorMessage.length;

	return (
		<div className={cx(connectionFlowContainer)}>
			<ConnectionFlowHeader />

			<div className={cx(serverNameFormOuterContainer)}>
				<div className={cx(connectionFlowInnerContainer)}>

					{editingServerUuid ? <h3>Update server name</h3> : <>
						<h3>Get started</h3>
						<p>Give your Jenkins server a name. We'll use this as a display name in
						Jira to keep track of your connection.</p>
					</>}

					<Form onSubmit={handleFormSubmit}>
						{({ formProps }: any) => (
							<form
								{...formProps}
								name='create-server-form'
								data-testid="serverNameForm"
								className={cx(serverNameForm)}
							>
								<ServerNameFormField
									serverName={serverName}
									setServerName={setServerNameHandler}
									hasError={!!errorMessage}
									errorMessage={errorMessage}
								/>

								<FormFooter align="start">
									{isLoading
										? <LoadingButton appearance='primary' isLoading className={loadingIcon} testId='loading-button' />
										: <Button
											type='submit'
											appearance='primary'
											isDisabled={submitButtonIsDisabled}
											testId='submit-button'
											className={cx(serverNameFormButton)}
										>
											{editingServerUuid ? 'Save' : 'Next'}
										</Button>
									}
								</FormFooter>
							</form>
						)}
					</Form>
				</div>
			</div>
		</div>
	);
};

export { ServerNameForm };
