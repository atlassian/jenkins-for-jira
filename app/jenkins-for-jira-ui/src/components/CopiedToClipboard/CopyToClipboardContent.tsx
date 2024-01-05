import React, { Ref } from 'react';

type WebhookGuideContentProps = {
	siteName?: string,
	webhookUrl?: string,
	divRef: Ref<HTMLDivElement> | undefined
};

export const WebhookGuideContent = ({ divRef }: WebhookGuideContentProps) => {
	return (
		<div ref={divRef}>
			<p>Here's (almost) everything you need to set up Jenkins for Jira (official) for my Jenkins site.</p>
			<p>Step-by-step guide (this will explain how to use the subsequent items):</p>
			<p>help link</p>
			<p>Site name Jira site name Webhook URL:</p>
			<p>&lt;Reg token containing Jira site, connection name, and webhook&gt;</p>
			<p>Secret: Your Jira admin will give this to you separately.</p>
		</div>
	);
};

type SecretTokenContentProps = {
	siteName?: string,
	secret?: string,
	helpLink?: string,
	divRef: Ref<HTMLDivElement> | undefined
};

export const SecretTokenContent = ({ divRef }: SecretTokenContentProps) => {
	return (
		<div ref={divRef}>
			<p>Here's the secret you need to setup the Jenkins for Jira for my Jenkins site</p>
			<p>REST OF STUFF...</p>
		</div>
	);
};
