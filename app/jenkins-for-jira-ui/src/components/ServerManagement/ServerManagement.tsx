import React, {
	ReactElement,
	useCallback, useEffect, useRef, useState
} from 'react';
import PageHeader from '@atlaskit/page-header';
import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import { cx } from '@emotion/css';
import TextArea from '@atlaskit/textarea';
import { useHistory } from 'react-router';
import { headerContainer } from '../JenkinsServerList/JenkinsServerList.styles';
import { serverManagementContainer, shareModalInstruction } from './ServerManagement.styles';
import { addConnectedState, ConnectionPanel } from '../ConnectionPanel/ConnectionPanel';
import { TopPanel } from './TopPanel/TopPanel';
import { JenkinsServer } from '../../../../src/common/types';
import { getAllJenkinsServers } from '../../api/getAllJenkinsServers';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import { spinnerHeight } from '../../common/styles/spinner.styles';
import { redirectFromGetStarted } from '../../api/redirectFromGetStarted';
import { ConnectionWizard } from '../ConnectionWizard/ConnectionWizard';
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

export const contentToRenderServerManagementScreen = (
	moduleKey: string | undefined,
	servers: JenkinsServer[],
	pageHeaderActions: ReactElement<any, string>,
	setJenkinsServers: (updatedServers: JenkinsServer[]) => void,
	isLoading?: boolean
) => {
	let contentToRender;

	if (isLoading) {
		contentToRender = <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	} else {
		switch (moduleKey) {
			case 'jenkins-for-jira-ui-admin-page':
				if (servers?.length) {
					contentToRender = (
						<>
							<div className={serverManagementContainer}>
								<div className={headerContainer}>
									<PageHeader actions={pageHeaderActions}>Jenkins for Jira</PageHeader>
								</div>

								<TopPanel />

								<ConnectionPanel jenkinsServers={servers} setJenkinsServers={setJenkinsServers} />
							</div>
						</>
					);
				} else {
					contentToRender = (
						<div className={serverManagementContainer}>
							<ConnectionWizard />
						</div>
					);
				}
				break;

			case 'get-started-page':
				contentToRender = (
					<>
						<div className={headerContainer}>
							<PageHeader>Jenkins configuration</PageHeader>
						</div>
						<JenkinsSpinner />
					</>
				);
				break;

			default:
				contentToRender = <JenkinsSpinner secondaryClassName={spinnerHeight} />;
				break;
		}
	}

	return contentToRender;
};

const ServerManagement = (): JSX.Element => {
	const history = useHistory();
	const [jenkinsServers, setJenkinsServers] = useState<JenkinsServer[]>([]);
	const [moduleKey, setModuleKey] = useState<string>();
	const [showSharePage, setshowSharePage] = useState<boolean>(false);
	const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
	const [globalPageUrl, setGlobalPageUrl] = useState<string>('');
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const isMountedRef = React.useRef<boolean>(true);

	const fetchAllJenkinsServers = async () => {
		const servers = await getAllJenkinsServers() || [];
		const serversWithConnectedState = addConnectedState(servers);
		setJenkinsServers(serversWithConnectedState);
	};

	const redirectToAdminPage = useCallback(async () => {
		try {
			if (isMountedRef.current) {
				const currentModuleKey = await redirectFromGetStarted();
				setModuleKey(currentModuleKey);
			}
		} catch (error) {
			console.error('Error redirecting to admin page:', error);
		}
	}, []);

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
				if (isMountedRef.current) {
					setIsCopiedToClipboard(false);
				}
			}, 2000);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const url = await fetchGlobalPageUrl();
				setGlobalPageUrl(url);
				await fetchAllJenkinsServers();
				await redirectToAdminPage();
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
		return () => {
			// Cleanup function to set isMountedRef to false when the component is unmounted
			isMountedRef.current = false;
		};
	}, [redirectToAdminPage]);

	const handleNavigateToServerNameScreen = (e: React.MouseEvent) => {
		e.preventDefault();
		history.push('/server-name');
	};

	const pageHeaderActions = (
		<ButtonGroup>
			<Button
				appearance="primary"
				onClick={(e) => handleNavigateToServerNameScreen(e)}
			>
				Connect a new Jenkins server
			</Button>
			<Button onClick={() => handleShowSharePageModal()}>Share page</Button>
		</ButtonGroup>
	);

	const sharePageMessage =
		`Hi there,
Jenkins for Jira is now installed and connected on ${getSiteNameFromUrl(globalPageUrl)}.

To set up what build and deployment events Jenkins sends to Jira, follow the set up guide(s) on this page:
${globalPageUrl}

You'll need to follow the set up guide for each server connected.`;

	const contentToRender =
		contentToRenderServerManagementScreen(
			moduleKey,
			jenkinsServers,
			pageHeaderActions,
			setJenkinsServers
		);

	return (
		<>
			{contentToRender}

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
		</>
	);
};

export { ServerManagement };
