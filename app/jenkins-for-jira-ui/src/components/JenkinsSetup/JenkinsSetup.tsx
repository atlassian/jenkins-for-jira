import React, {
	RefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import { cx } from '@emotion/css';
import { router } from '@forge/bridge';
import Button, { ButtonGroup } from '@atlaskit/button';
import InfoIcon from '@atlaskit/icon/glyph/info';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import OpenIcon from '@atlaskit/icon/glyph/open';
import CheckIcon from '@atlaskit/icon/glyph/check';
import Tooltip from '@atlaskit/tooltip';
import { useHistory, useParams } from 'react-router';
import Spinner from '@atlaskit/spinner';
import {
	connectionFlowContainer,
	connectionFlowInnerContainer,
	orderedList,
	orderedListItem
} from '../../GlobalStyles.styles';
import {
	jenkinsSetupContainer,
	jenkinsSetupContent,
	jenkinsSetupCopyButtonContainer,
	jenkinsSetupCopyContainer,
	jenkinsSetupHeader,
	jenkinsSetupListItem,
	jenkinsSetupOrderedList,
	jenkinsSetUpCopyHiddenContent,
	loadingContainer,
	jenkinsSetupViewButton
} from './JenkinsSetup.styles';
import { getJenkinsServerWithSecret } from '../../api/getJenkinsServerWithSecret';
import { serverNameFormOuterContainer } from '../ServerNameForm/ServerNameForm.styles';
import { ConnectionFlowHeader } from '../ConnectionWizard/ConnectionFlowHeader';
import { SecretTokenContent, WebhookGuideContent } from '../CopiedToClipboard/CopyToClipboardContent';
import { getWebhookUrl } from '../../common/util/jenkinsConnectionsUtils';
import { fetchGlobalPageUrl, fetchSiteName } from '../../api/fetchGlobalPageUrl';
import { HELP_LINK } from '../../common/constants';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import { ParamTypes } from '../../common/types';
import { CopiedToClipboard } from '../CopiedToClipboard/CopiedToClipboard';

const analyticsClient = new AnalyticsClient();

type CopyProps = {
	handleCopyToClipboard: (copyRef: React.RefObject<HTMLDivElement>, elementName?: string) => Promise<void> | void;
	handleCopyButton: (copyButton: CopyButtonNameEnum) => void;
	primaryButtonName: CopyButtonNameEnum;
	copyButtonName: CopyButtonNameEnum;
	testId?: string
};

const CopyButton = ({
	handleCopyToClipboard,
	copyRef,
	handleCopyButton,
	primaryButtonName,
	copyButtonName,
	testId
}: CopyProps & { copyRef: React.RefObject<HTMLDivElement> }): JSX.Element => {
	const [isCopied, setIsCopied] = useState(false);
	const [showIsCopiedToClipboardTooltip, setShowIsCopiedToClipboardTooltip] = useState(false);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		if (showIsCopiedToClipboardTooltip) {
			timeoutId = setTimeout(() => {
				setShowIsCopiedToClipboardTooltip(false);
			}, 2000);
		}
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [showIsCopiedToClipboardTooltip]);

	return (
		<div className={cx(jenkinsSetupCopyButtonContainer)} >
			<Button
				iconBefore={isCopied ? <CheckIcon label="Copy" size="medium" /> : <CopyIcon label="Copy" size="medium" />}
				onClick={() => {
					if (copyRef && copyRef.current) {
						handleCopyToClipboard(copyRef, testId);
						setIsCopied(true);
						setShowIsCopiedToClipboardTooltip(true);
						handleCopyButton(copyButtonName);
					}
				}}
				appearance= {primaryButtonName === copyButtonName && !isCopied ? 'primary' : 'default'}
				testId={testId}
			>
                Copy
			</Button>
			{showIsCopiedToClipboardTooltip && <CopiedToClipboard leftPositionPercent="110%" />}
		</div>
	);
};

type MyJenkinsAdminProps = {
	handleCopyToClipboard: (copyRef: React.RefObject<HTMLDivElement>, elementName?: string) => Promise<void> | void;
	handleCopyButton: (copyButton: CopyButtonNameEnum) => void,
	webhookGuideRef: RefObject<HTMLDivElement>,
	secretTokenRef: RefObject<HTMLDivElement>,
	primaryButtonName: CopyButtonNameEnum,
};

const MyJenkinsAdmin = ({
	handleCopyToClipboard,
	handleCopyButton,
	webhookGuideRef,
	secretTokenRef,
	primaryButtonName
}: MyJenkinsAdminProps): JSX.Element => {
	const tooltipContent =
		'Send this token separately to the webhook URL and step-by-step guide. It\'s best practice to use a secure channel like a password management tool.';

	return (
		<div className={cx(jenkinsSetupCopyContainer)}>
			<p className={cx(jenkinsSetupContent)}>Copy the items below and give them to your Jenkins admin</p>

			<ol className={cx(orderedList, jenkinsSetupOrderedList)}>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Webhook URL and step-by-step guide
					<CopyButton
						handleCopyToClipboard={handleCopyToClipboard}
						handleCopyButton={handleCopyButton}
						primaryButtonName={primaryButtonName}
						copyButtonName="nonAdminWebhook"
						copyRef={webhookGuideRef}
						testId="copy-webhook-url-guide" />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Secret
					<Tooltip content={tooltipContent} position="bottom-start">
						<InfoIcon label="help" size="small" />
					</Tooltip>
					<CopyButton
						handleCopyToClipboard={handleCopyToClipboard}
						handleCopyButton={handleCopyButton}
						primaryButtonName={primaryButtonName}
						copyButtonName="nonAdminSecret"
						copyRef={secretTokenRef} testId="copy-secret-token-guide" />
				</li>
			</ol>
		</div>
	);
};

type IAmTheJenkinsAdminProps = {
	handleCopyToClipboard: (copyRef: React.RefObject<HTMLDivElement>, elementName?: string) => Promise<void> | void;
	handleCopyButton: (copyButton: CopyButtonNameEnum) => void,
	siteNameRef: RefObject<HTMLDivElement>,
	webhookUrlRef: RefObject<HTMLDivElement>,
	secretRef: RefObject<HTMLDivElement>,
	primaryButtonName: CopyButtonNameEnum,
};

const IAmTheJenkinsAdmin = ({
	handleCopyToClipboard,
	handleCopyButton,
	siteNameRef,
	webhookUrlRef,
	secretRef,
	primaryButtonName
}: IAmTheJenkinsAdminProps): JSX.Element => {
	const handleFollowLink = async (e: React.MouseEvent): Promise<void> => {
		e.preventDefault();

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.ViewStepByStepGuideName,
			{
				action: `clicked - ${AnalyticsUiEventsEnum.ViewStepByStepGuideName}`,
				actionSubject: 'button'
			}
		);

		router.open(HELP_LINK);
	};

	return (
		<div className={cx(jenkinsSetupCopyContainer)}>
			<p className={cx(jenkinsSetupContent)}>
				Log in to Jenkins in another window and use the items below to set up your server.
			</p>

			<ol className={cx(orderedList, jenkinsSetupOrderedList)}>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Step-by-step guide
					<div className={cx(jenkinsSetupCopyButtonContainer)}>
						<Button
							iconBefore={<OpenIcon label="Open" size="medium" />}
							onClick={(e) => handleFollowLink(e)}
							className={cx(jenkinsSetupViewButton)}
						>
							View
						</Button>
					</div>
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Site name
					<CopyButton
						handleCopyToClipboard={handleCopyToClipboard}
						handleCopyButton={handleCopyButton}
						primaryButtonName={primaryButtonName}
						copyButtonName="adminSiteName"
						copyRef={siteNameRef} testId="site-name-copy-button" />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Webhook URL
					<CopyButton
						handleCopyToClipboard={handleCopyToClipboard}
						handleCopyButton={handleCopyButton}
						primaryButtonName={primaryButtonName}
						copyButtonName="adminWebhook"
						copyRef={webhookUrlRef} testId="copy-webhook-url" />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Secret
					<CopyButton
						handleCopyToClipboard={handleCopyToClipboard}
						handleCopyButton={handleCopyButton}
						primaryButtonName={primaryButtonName}
						copyButtonName="adminSecret"
						copyRef={secretRef} testId="copy-secret-token" />
				</li>
			</ol>

			<p className={cx(jenkinsSetupContent)}>When you're done, select Finish</p>
		</div>
	);
};

type CopyButtonNameEnum = 'adminSiteName' | 'adminWebhook' | 'adminSecret' | 'nonAdminWebhook' | 'nonAdminSecret';

interface CopyButtonMetadata {
	name: CopyButtonNameEnum;
	isClicked: boolean;
}

const JenkinsSetup = (): JSX.Element => {
	const initialAdminButtonStates: CopyButtonMetadata[] = [
		{ name: 'adminSiteName', isClicked: false },
		{ name: 'adminWebhook', isClicked: false },
		{ name: 'adminSecret', isClicked: false }
	];

	const initialNonAdminButtonStates: CopyButtonMetadata[] = [
		{ name: 'nonAdminWebhook', isClicked: false },
		{ name: 'nonAdminSecret', isClicked: false }
	];

	const history = useHistory();
	const { path } = useParams<ParamTypes>();
	const webhookGuideRef = useRef<HTMLDivElement>(null);
	const secretTokenRef = useRef<HTMLDivElement>(null);
	const secretRef = useRef<HTMLDivElement>(null);
	const siteNameRef = useRef<HTMLDivElement>(null);
	const webhookUrlRef = useRef<HTMLDivElement>(null);
	const { id: uuid } = useParams<ParamTypes>();
	const [serverName, setServerName] = useState('');
	const [showMyJenkinsAdmin, setShowMyJenkinsAdmin] = useState(false);
	const [showIAmTheJenkinsAdmin, setShowIAmTheJenkinsAdmin] = useState(false);
	const [copyAdminButtonStates, setCopyAdminButtonStates] = useState<CopyButtonMetadata[]>(initialAdminButtonStates);
	const [copyNonAdminButtonStates, setCopyNonAdminButtonStates] =
	useState<CopyButtonMetadata[]>(initialNonAdminButtonStates);
	const [webhookUrl, setWebhookUrl] = useState('');
	const [secret, setSecret] = useState<string>('');
	const [siteName, setSiteName] = useState<string>('');
	const [globalPageUrl, setGlobalPageUrl] = useState<string>('');
	const [primaryCopyButtonName, setPrimaryCopyButtonName] =
	useState<CopyButtonNameEnum>('nonAdminWebhook');

	const updateAdminCopyButtonState = (key: CopyButtonNameEnum, isClicked: boolean) => {
		const existingItemIndex = copyAdminButtonStates.findIndex((item) => item.name === key);

		if (existingItemIndex !== -1) {
			const updatedButtons = [...copyAdminButtonStates];
			updatedButtons[existingItemIndex].isClicked = isClicked;
			setCopyAdminButtonStates(updatedButtons);
		}
	};

	const updateNonAdminCopyButtonState = (key: CopyButtonNameEnum, isClicked: boolean) => {
		const existingItemIndex = copyNonAdminButtonStates.findIndex((item) => item.name === key);

		if (existingItemIndex !== -1) {
			const updatedButtons = [...copyNonAdminButtonStates];
			updatedButtons[existingItemIndex].isClicked = isClicked;
			setCopyNonAdminButtonStates(updatedButtons);
		}
	};

	const getServer = useCallback(async () => {
		try {
			const { name, secret: retrievedSecret } = await getJenkinsServerWithSecret(uuid);
			setServerName(name);
			setSecret(retrievedSecret || '');
		} catch (e) {
			console.error('No Jenkins server found.');
		}
	}, [uuid]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const site = await fetchSiteName();
				setSiteName(site);
				const url = await fetchGlobalPageUrl();
				setGlobalPageUrl(url);
				await getServer();
				await getWebhookUrl(setWebhookUrl, uuid);

				await analyticsClient.sendAnalytics(
					AnalyticsEventTypes.ScreenEvent,
					AnalyticsScreenEventsEnum.JenkinsSetupScreenName
				);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [uuid, getServer]);

	const findNextPrimaryButtonIndex = (buttonStates: CopyButtonMetadata[]) => {
		return buttonStates.findIndex((item) => item.isClicked === false);
	};

	const handleAdminCopyButton = (copyButtonName: CopyButtonNameEnum) => {
		updateAdminCopyButtonState(copyButtonName, true);
		const nextPrimaryButtonIndex = findNextPrimaryButtonIndex(copyAdminButtonStates);
		if (nextPrimaryButtonIndex !== -1) {
			setPrimaryCopyButtonName(copyAdminButtonStates[nextPrimaryButtonIndex].name);
		}
	};

	const handleNonAdminCopyButton = (copyButtonName: CopyButtonNameEnum) => {
		updateNonAdminCopyButtonState(copyButtonName, true);
		const nextPrimaryButtonIndex = findNextPrimaryButtonIndex(copyNonAdminButtonStates);
		if (nextPrimaryButtonIndex !== -1) {
			setPrimaryCopyButtonName(copyNonAdminButtonStates[nextPrimaryButtonIndex].name);
		}
	};

	const clearCopiedButtonStates = () => {
		setCopyAdminButtonStates(initialAdminButtonStates);
		setCopyNonAdminButtonStates(initialNonAdminButtonStates);
	};

	const handleCopyToClipboard =
		async (copyRef: React.RefObject<HTMLDivElement>, elementName?: string) => {
			if (copyRef.current) {
				const range = document.createRange();
				range.selectNode(copyRef.current);

				const selection = window.getSelection();
				if (selection) {
					selection.removeAllRanges();
					selection.addRange(range);
				}

				try {
					document.execCommand('copy');
				} catch (err) {
					console.error('Copy to clipboard failed:', err);
				}

				if (selection) {
					selection.removeAllRanges();
				}
			}

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.UiEvent,
				AnalyticsUiEventsEnum.CopiedToClipboardName,
				{
					source: AnalyticsScreenEventsEnum.JenkinsSetupScreenName,
					action: `clicked - ${AnalyticsUiEventsEnum.CopiedToClipboardName}`,
					actionSubject: 'button',
					buttonClicked: elementName || 'Copy button'
				}
			);
		};

	const handleMyJenkinsAdminClick = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (!showMyJenkinsAdmin) {
			clearCopiedButtonStates();
			setPrimaryCopyButtonName('nonAdminWebhook');
		}
		setShowMyJenkinsAdmin(true);
		setShowIAmTheJenkinsAdmin(false);

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.MyJenkinsAdminTabName,
			{
				action: `clicked - ${AnalyticsUiEventsEnum.MyJenkinsAdminTabName}`,
				actionSubject: 'button'
			}
		);
	};

	const handleIAmTheJenkinsAdminClick = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (!showIAmTheJenkinsAdmin) {
			clearCopiedButtonStates();
			setPrimaryCopyButtonName('adminSiteName');
		}
		setShowIAmTheJenkinsAdmin(true);
		setShowMyJenkinsAdmin(false);

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.IAmAJenkinsAdminTabName,
			{
				action: `clicked - ${AnalyticsUiEventsEnum.IAmAJenkinsAdminTabName}`,
				actionSubject: 'button'
			}
		);
	};

	const handleNavigateToConnectionServerManagementScreen = (e: React.MouseEvent) => {
		e.preventDefault();

		if (path === 'global') {
			router.navigate(globalPageUrl);
		}
		history.push('/');
	};

	const isFetchingData = !serverName || !webhookUrl || !secret;

	const isAllRequiredButtonsClicked = copyAdminButtonStates.every((button) => button.isClicked) ||
	(copyNonAdminButtonStates.every((button) => button.isClicked));

	return (
		<div className={cx(connectionFlowContainer)}>
			<ConnectionFlowHeader />

			{isFetchingData ? (
				<div className={cx(loadingContainer)} data-testid="loading-spinner">
					<Spinner size='large' />
				</div>
			) : (
				<>
					<div className={cx(serverNameFormOuterContainer)}>
						<div className={cx(connectionFlowInnerContainer)}>
							<div className={cx(jenkinsSetupContainer)}>
								<h3 className={cx(jenkinsSetupHeader)}>Set up Jenkins</h3>
								<div className={cx(jenkinsSetupContent)}>
									<p>
										To complete the connection for <strong>{serverName}</strong>,
										you'll need to set up your Jenkins
										server and enter the webhook URL and secret we'll provide.
									</p>
									<p>
										In many teams, Jira admins delegate this task to a member familiar with Jenkins.
									</p>
									<p>
										Who's setting up this server?
									</p>
								</div>

								<ButtonGroup>
									<Button
										onClick={(e) => handleMyJenkinsAdminClick(e)}
										appearance={showMyJenkinsAdmin ? 'primary' : 'default'}
										testId="my-jenkins-admin"
									>
										A Jenkins admin on my team
									</Button>
									<Button
										onClick={(e) => handleIAmTheJenkinsAdminClick(e)}
										appearance={showIAmTheJenkinsAdmin ? 'primary' : 'default'}
										testId="i-am-the-jenkins-admin"
									>
										I am a Jenkins admin
									</Button>
								</ButtonGroup>

								{showMyJenkinsAdmin ? (
									<MyJenkinsAdmin
										handleCopyToClipboard={handleCopyToClipboard}
										handleCopyButton={handleNonAdminCopyButton}
										primaryButtonName={primaryCopyButtonName}
										webhookGuideRef={webhookGuideRef}
										secretTokenRef={secretTokenRef}
									/>
								) : null}

								{showIAmTheJenkinsAdmin ? (
									<IAmTheJenkinsAdmin
										handleCopyToClipboard={handleCopyToClipboard}
										handleCopyButton={handleAdminCopyButton}
										primaryButtonName={primaryCopyButtonName}
										siteNameRef={siteNameRef}
										webhookUrlRef={webhookUrlRef}
										secretRef={secretRef}
									/>
								) : null}
							</div>

							{showMyJenkinsAdmin || showIAmTheJenkinsAdmin ? (
								<Button
									type="button"
									appearance="primary"
									isDisabled={!isAllRequiredButtonsClicked}
									onClick={(e) => handleNavigateToConnectionServerManagementScreen(e)}
									testId="jenkins-set-up-next-btn"
								>
								Finish
								</Button>
							) : null}

							<div className={cx(jenkinsSetUpCopyHiddenContent)}>
								<WebhookGuideContent
									divRef={webhookGuideRef}
									siteName={siteName}
									webhookUrl={webhookUrl}
								/>
								<SecretTokenContent divRef={secretTokenRef} siteName={siteName} secret={secret} />
								<div ref={secretRef}>{secret}</div>
								<div ref={webhookUrlRef}>{webhookUrl}</div>
								<div ref={siteNameRef}>{siteName}</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export { JenkinsSetup };
