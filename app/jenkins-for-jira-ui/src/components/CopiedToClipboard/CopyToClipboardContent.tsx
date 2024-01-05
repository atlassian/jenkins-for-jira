import React, { Ref } from 'react';
import TextArea from '@atlaskit/textarea';

type WebhookGuideContentProps = {
	siteName?: string,
	webhookUrl?: string,
	textAreaRef: Ref<HTMLTextAreaElement> | undefined
};

export const WebhookGuideContent = ({ textAreaRef }: WebhookGuideContentProps) => {
	const webhookGuideContent = `TEST`;

	return (
		<form>
			<TextArea
				key="text-area"
				ref={textAreaRef}
				value={webhookGuideContent}
				isReadOnly
				minimumRows={5}
			/>
		</form>
	);
};

type SecretTokenContentProps = {
	siteName: string,
	secret: string,
	helpLink: string,
	textAreaRef: Ref<HTMLTextAreaElement> | undefined
};

export const SecretTokenContent = ({ textAreaRef }: SecretTokenContentProps) => {
	const secretTokenContent = `secret token stuffs`;

	return (
		<form>
			<TextArea
				key="text-area"
				ref={textAreaRef}
				value={secretTokenContent}
				isReadOnly
				minimumRows={5}
			/>
		</form>
	);
};
