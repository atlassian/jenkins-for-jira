import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '@atlaskit/page-header';
import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import TextArea from '@atlaskit/textarea';
import { cx } from '@emotion/css';
import { serverManagementContainer, modalHeaderContainer, shareModalInstruction } from './ServerManagement.styles';
import { ConnectionPanel } from '../ConnectionPanel/ConnectionPanel';
import { TopPanel } from './TopPanel/TopPanel';
import { JenkinsModal } from '../JenkinsServerList/ConnectedServer/JenkinsModal';
import { fetchGlobalPageUrl } from '../../api/fetchGlobalPageUrl';

export const getSiteNameFromUrl = (url: string): string => {
	try {
		const urlObject = new URL(url);
		return urlObject.hostname;
	} catch (error) {
		console.error('Error extracting site name:', error);
		return '';
	}
};

const ServerManagement = (): JSX.Element => {
	const [showSharePage, setshowSharePage] = useState<boolean>(false);
	const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
	const [globalPageUrl, setGlobalPageUrl] = useState<string>('');
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const handleShowSharePageModal = async () => {
		setshowSharePage(true);
	};

	const handleCloseShowSharePageModal = async () => {
		setshowSharePage(false);
	};

	const handleCopyToClipboard = async () => {
		if (textAreaRef.current) {
			textAreaRef.current.select();
			document.execCommand('copy');
			textAreaRef.current.setSelectionRange(textAreaRef.current.value.length, textAreaRef.current.value.length);

			setIsCopiedToClipboard(true);

			setTimeout(() => {
				setIsCopiedToClipboard(false);
			}, 2000);
		}
	};

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
	}, []);

	const pageHeaderActions = (
		<ButtonGroup>
			{/* TODO handle empty state - ARC-2730 connection wizard */}
			<Button appearance="primary">Connect a new Jenkins server</Button>
			<Button onClick={() => handleShowSharePageModal()}>Share page</Button>
		</ButtonGroup>
	);

	const sharePageMessage =
		`Hi there,

Jenkins for Jira is now installed and connected on ${getSiteNameFromUrl(globalPageUrl)}.

To set up what build and deployment events Jenkins sends to Jira, follow the set up guide(s) on this page:

${globalPageUrl}

You'll need to follow the set up guide for each server connected.`;

	return (
		<div className={serverManagementContainer}>
			<div className={modalHeaderContainer}>
				<PageHeader actions={pageHeaderActions}>Jenkins for Jira</PageHeader>
			</div>

			<TopPanel />

			<ConnectionPanel />

			<JenkinsModal
				dataTestId="share-page-modal"
				show={showSharePage}
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
		</div>
	);
};

export { ServerManagement };
