import React, { useState } from 'react';
import { cx } from '@emotion/css';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import Form, {
	ErrorMessage, Field, FormFooter, HelperMessage
} from '@atlaskit/form';
import { v4 as uuidv4 } from 'uuid';
import Textfield from '@atlaskit/textfield';
import { isValid } from '../../common/util/jenkinsConnectionsUtils';
import { connectionFlowContainer 	} from '../../GlobalStyles.styles';
import { ConnectionFlowHeader } from '../ConnectionWizard/ConnectionFlowHeader';
import { createJenkinsServer } from '../../api/createJenkinsServer';
import { generateNewSecret } from '../../api/generateNewSecret';
import {
	loadingIcon,
	StyledTextfieldErrorContainer,
	textfieldContainer
} from '../JenkinsConfigurationForm/JenkinsConfigurationForm.styles';
import { serverNameFormOuterContainer, serverNameFormInnerContainer } from './ServerNameForm.styles';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsServer } from '../../../../src/common/types';

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
	const [serverName, setServerName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const setServerNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newServerName = event.target.value;

		if (!!errorMessage && newServerName.length > 0) {
			setErrorMessage('');
		}

		setServerName(newServerName);
	};

	const handleSubmitCreateServer = async () => {
		if (isValid(serverName, setErrorMessage)) {
			setIsLoading(true);
			const uuid = uuidv4();

			const servers = await getAllJenkinsServers() || [];
			const serverExists = jenkinsServerNameExists(servers, serverName);

			if (serverExists) {
				setErrorMessage('This name is already in use. Choose a unique name.');
				setIsLoading(false);
				return;
			}

			try {
				await createJenkinsServer({
					name: serverName,
					uuid,
					secret: await generateNewSecret(),
					pipelines: []
				});

				setIsLoading(false);
				// TODO - add history.push to /setup ARC-2596
			} catch (e) {
				console.error('Error: ', e);
				setIsLoading(false);
			}
		}
	};

	const submitButtonIsDisabled = !serverName.length || !!errorMessage.length;

	return (
		<div className={cx(connectionFlowContainer)}>
			<ConnectionFlowHeader />

			<div className={cx(serverNameFormOuterContainer)}>
				<div className={cx(serverNameFormInnerContainer)}>

					<h3>Get started</h3>
					<p>Give your Jenkins server a name. We'll use this as a display name in
					Jira to keep track of your connection.</p>

					<Form onSubmit={handleSubmitCreateServer}>
						{({ formProps }: any) => (
							<form {...formProps} name='create-server-form' data-testid="createServerForm">
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
										>
										Next
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
