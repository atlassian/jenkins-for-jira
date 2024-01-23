import React, { Ref } from 'react';
import { HELP_LINK } from '../../common/constants';

type WebhookGuideContentProps = {
	siteName: string,
	divRef: Ref<HTMLDivElement> | undefined,
	webhookUrl: string
};

export const WebhookGuideContent = ({ divRef, webhookUrl, siteName }: WebhookGuideContentProps) => {
	return (
		<div ref={divRef} data-testid="copy-webhook-guide">
			<p>
				Here's everything you need to set up the Atlassian Jira Software Cloud plugin on Jenkins.
			</p>
			<br />

			<p>
				Step-by-step guide:&nbsp;
				<a href={HELP_LINK}>{HELP_LINK}</a>
			</p>
			<p></p>
			<br />

			<p>Site name:</p>
			<p>{siteName}</p>
			<br />

			<p>Webhook URL:</p>
			<p>{webhookUrl}</p>
			<br />

			<p>Secret:</p>
			<p>I'll send this shortly in a seperate channel.</p>
		</div>
	);
};

type SecretTokenContentProps = {
	siteName: string,
	secret: string,
	divRef: Ref<HTMLDivElement> | undefined
};

export const SecretTokenContent = ({ divRef, siteName, secret }: SecretTokenContentProps) => {
	return (
		<div ref={divRef} data-testid="copy-secret-token-content">
			<p>
				Here's the secret you need to setup the Jenkins for Jira for my Jenkins site, {siteName}:
			</p>
			<br />
			<br />

			<p>Secret:</p>
			<p>{secret}</p>
			<br />
			<br />

			<p>
				Here’s how to enter this:
				<a href={HELP_LINK}>{HELP_LINK}</a>
			</p>
			<br />

			<p>
				Don't forget to tell me when you've completed this connection.
			</p>
		</div>
	);
};
