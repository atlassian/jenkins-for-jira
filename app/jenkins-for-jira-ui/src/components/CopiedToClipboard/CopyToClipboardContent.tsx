import React, { Ref } from 'react';
import { cx } from '@emotion/css';
import { jenkinsSetUpCopyContentPrompt } from '../JenkinsSetup/JenkinsSetup.styles';

const HELP_LINK = 'https://app.contentful.com/spaces/zsv3d0ugroxu/entries/4ccCes4jpnMlSVtI4Eqre9?focusedField=body';

type WebhookGuideContentProps = {
	siteName?: string,
	divRef: Ref<HTMLDivElement> | undefined,
	webhookUrl: string
};

export const WebhookGuideContent = ({ divRef, webhookUrl, siteName }: WebhookGuideContentProps) => {
	return (
		<div ref={divRef}>
			<p className={cx(jenkinsSetUpCopyContentPrompt)}>
				Here's (almost) everything you need to set up Jenkins for Jira (official) for my Jenkins site.
			</p>
			<br />

			<p className={cx(jenkinsSetUpCopyContentPrompt)}>
				Step-by-step guide (this will explain how to use the subsequent items):
			</p>
			<a href={HELP_LINK}>{HELP_LINK}</a>
			<br />

			<p className={cx(jenkinsSetUpCopyContentPrompt)}>Site name:</p>
			<p>{siteName}</p>
			<br />

			<p className={cx(jenkinsSetUpCopyContentPrompt)}>Webhook URL:</p>
			<p>{webhookUrl}</p>
			<br />

			<p className={cx(jenkinsSetUpCopyContentPrompt)}>Secret:</p>
			<p>Secret: Your Jira admin will give this to you separately.</p>
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
		<div ref={divRef}>
			<p className={cx(jenkinsSetUpCopyContentPrompt)}>
				Here's the secret you need to setup the Jenkins for Jira for my Jenkins site, {siteName}:
			</p>
			<br />

			<p className={cx(jenkinsSetUpCopyContentPrompt)}>Secret:</p>
			<p>{secret}</p>
			<br />

			<p className={cx(jenkinsSetUpCopyContentPrompt)}>Here’s how to enter this:</p>
			<a href={HELP_LINK}>{HELP_LINK}</a>
			<br />

			<p>
				Don't forget to tell me when you've completed this connection.
			</p>
		</div>
	);
};
