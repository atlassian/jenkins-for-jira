import React, { Fragment } from 'react';
import Textfield from '@atlaskit/textfield';
import {
	Field,
	HelperMessage
} from '@atlaskit/form';
import {
	StyledInputHeaderContainer,
	textfieldContainer
} from '../../JenkinsConfigurationForm.styles';
import { FormTooltip } from '../../../Tooltip/Tooltip';

type ServerConfigurationFormWebhookUrlProps = {
	webhookUrl: string;
};

const ServerConfigurationFormWebhookUrl = ({ webhookUrl }: ServerConfigurationFormWebhookUrlProps) => {
	return (
		<Fragment>
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
								testId='webhook-url'
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
		</Fragment>
	);
};

export { ServerConfigurationFormWebhookUrl };
