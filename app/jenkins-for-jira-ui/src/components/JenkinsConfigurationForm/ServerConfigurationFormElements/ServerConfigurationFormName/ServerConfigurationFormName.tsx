import React, { Fragment } from 'react';
import Textfield from '@atlaskit/textfield';
import {
	ErrorMessage,
	Field
} from '@atlaskit/form';
import {
	StyledInputHeaderContainer,
	StyledTextfieldErrorContainer
} from '../../JenkinsConfigurationForm.styles';
import { FormTooltip } from '../../../Tooltip/Tooltip';

type ServerConfigurationFormNameProps = {
	serverName: string;
	setServerName: (event: React.ChangeEvent<HTMLInputElement>) => void;
	hasError: boolean;
	errorMessage?: string;
	setHasError: (error: boolean) => boolean | void;
};

const ServerConfigurationFormName = ({
	serverName,
	setServerName,
	hasError,
	errorMessage,
	setHasError
}: ServerConfigurationFormNameProps) => {
	return (
		<Fragment>
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
							testId='server-name'
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								setServerName(event);
								setHasError(false);
							}}
						/>
					)}
				</Field>
				{ hasError && (
					<ErrorMessage testId='error-message'>
						{errorMessage}
					</ErrorMessage>
				)}
			</StyledTextfieldErrorContainer>
		</Fragment>
	);
};

export { ServerConfigurationFormName };
