import React, {
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';

import Button from '@atlaskit/button';
import TextArea from '@atlaskit/textarea';
import { cx } from '@emotion/css';
import { AnalyticsEventTypes, AnalyticsScreenEventsEnum, AnalyticsUiEventsEnum } from '../../common/analytics/analytics-events';
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

const getSharePageMessage = (globalPageUrl: string, moduleKey?: string): string => {
	const versionRequirementMessage = moduleKey === CONFIG_PAGE
		? `
Not a member of this Jira site? You can follow the instructions here instead:

https://support.atlassian.com/jira-cloud-administration/docs/how-jenkins-for-jira-works/` : '';

	return `Hi there,

Jenkins for Jira is now installed and connected on ${getSiteNameFromUrl(globalPageUrl)}.

To set up what build and deployment events Jenkins send to Jira, follow the set up guide(s) on this page:

${globalPageUrl}

You'll need to follow the set up guide for each connected server.
${versionRequirementMessage}`;
};

type SharePageProps = {
	analyticsScreenEventNameEnum: AnalyticsScreenEventsEnum;
	buttonAppearance?: string;
	moduleKey?: string;
};

export const SharePage = ({
	analyticsScreenEventNameEnum,
	buttonAppearance,
	moduleKey
}:SharePageProps): JSX.Element => {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
	const isMountedRef = React.useRef<boolean>(true);
	const [globalPageUrl, setGlobalPageUrl] = useState<string>('');
	const [sharePageMessage, setSharePageMessage] = useState<string>('');
	const [showSharePage, setShowSharePage] = useState<boolean>(false);
	const buttonStyleAppearance = buttonAppearance === 'primary' ? 'primary' : 'default';

	const constructSharePageMessage = useCallback(async () => {
		const fetchData = async () => {
			try {
				const url = await fetchGlobalPageUrl();
				setGlobalPageUrl(url);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		await fetchData();
		setSharePageMessage(getSharePageMessage(globalPageUrl, moduleKey));
	}, [globalPageUrl, moduleKey]);

	useEffect(() => {
		constructSharePageMessage();
		return () => {
			// Cleanup function to set isMountedRef to false when the component is unmounted
			isMountedRef.current = false;
		};
	}, [constructSharePageMessage]);

	const handleShowSharePageModal = async () => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.SharePageName,
			{
				source: analyticsScreenEventNameEnum,
				action: `clicked - ${AnalyticsUiEventsEnum.SharePageName}`,
				actionSubject: 'button'
			}
		);
		setShowSharePage(true);
	};

	const handleCloseShowSharePageModal = () => {
		setShowSharePage(false);
		setIsCopiedToClipboard(false);
	};

	const handleCopyToClipboard = async () => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.CopiedToClipboardName,
			{
				source: analyticsScreenEventNameEnum,
				action: `clicked - ${AnalyticsUiEventsEnum.CopiedToClipboardName}`,
				actionSubject: 'button'
			}
		);

		if (textAreaRef.current) {
			textAreaRef.current.select();
			navigator.clipboard.writeText(textAreaRef.current.textContent || '');
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
			<Button appearance={buttonStyleAppearance} onClick={() => handleShowSharePageModal()}>Share page</Button>
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
