import React, { useEffect, useRef, useState } from 'react';
import TextArea from '@atlaskit/textarea';
import { cx } from '@emotion/css';
import { AnalyticsEventTypes, AnalyticsUiEventsEnum } from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import { JenkinsModal } from '../JenkinsServerList/ConnectedServer/JenkinsModal';
import { shareModalInstruction } from '../ServerManagement/ServerManagement.styles';

import { fetchGlobalPageUrl } from '../../api/fetchGlobalPageUrl';
import { CONFIG_PAGE } from '../../common/constants';

const analyticsClient = new AnalyticsClient();

export const getSiteNameFromUrl = (url: string): string => {
	try {
		const urlObject = new URL(url);
		return urlObject.hostname;
	} catch (error) {
		console.error('Error extracting site name:', error);
		return '';
	}
};

export const getSharePageMessage = (globalPageUrl: string, moduleKey?: string): string => {
	const versionRequirementMessage = moduleKey === CONFIG_PAGE
		? `
Can’t see a page when you follow this link? Ask your Jira admin to update Jenkins for Jira at:

Apps > Manage your apps > Jenkins for Jira (Official)` : '';

	return `Hi there,
Jenkins for Jira is now installed and connected on

${getSiteNameFromUrl(globalPageUrl)}.

To get data flowing from Jenkins to Jira, follow the set up guide(s) on this page:

${globalPageUrl}

You'll need to follow the guide for each server connected.
${versionRequirementMessage}`;
};

type SharePageProps = {
	showSharePage: boolean;
	handleCloseShowSharePageModal: () => Promise<void>;
	analyticsSourceEnumName: string;
};

export const SharePage = ({
	showSharePage,
	analyticsSourceEnumName,
	handleCloseShowSharePageModal
}:SharePageProps): JSX.Element => {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
	const isMountedRef = React.useRef<boolean>(true);
	const [globalPageUrl, setGlobalPageUrl] = useState<string>('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const url = await fetchGlobalPageUrl();
				setGlobalPageUrl(url);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();

		return () => {
			// Cleanup function to set isMountedRef to false when the component is unmounted
			isMountedRef.current = false;
		};
	}, []);

	const sharePageMessage = getSharePageMessage(globalPageUrl);

	const handleCopyToClipboard = async () => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.CopiedToClipboardName,
			{
				source: analyticsSourceEnumName,
				action: `clicked - ${AnalyticsUiEventsEnum.CopiedToClipboardName}`,
				actionSubject: 'button'
			}
		);

		if (textAreaRef.current) {
			textAreaRef.current.select();
			document.execCommand('copy');
			textAreaRef.current.setSelectionRange(textAreaRef.current.value.length, textAreaRef.current.value.length);

			setIsCopiedToClipboard(true);

			setTimeout(() => {
				if (isMountedRef.current) {
					setIsCopiedToClipboard(false);
				}
			}, 2000);
		}
	};
	return (
		<>
			{
				showSharePage && <JenkinsModal
					dataTestId="share-page-modal"
					title="Share page"
					body={[
						<p key="share-message" className={cx(shareModalInstruction)}>
							Share this link with your project teams to help them set up what
							data they receive from Jenkins.
						</p>,
						<TextArea
							key="text-area"
							ref={textAreaRef}
							value={sharePageMessage}
							isReadOnly
							minimumRows={5}
						/>
					]}
					onClose={handleCloseShowSharePageModal}
					primaryButtonAppearance="subtle"
					primaryButtonLabel="Close"
					secondaryButtonAppearance="primary"
					secondaryButtonLabel="Copy to clipboard"
					secondaryButtonOnClick={handleCopyToClipboard}
					isCopiedToClipboard={isCopiedToClipboard}
				/>
			}
		</>
	);
};
