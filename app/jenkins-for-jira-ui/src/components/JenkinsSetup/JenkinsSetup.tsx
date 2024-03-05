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
	setCopyButtonStateToTrue: (copyButton: CopyButtonNameEnum) => void;
	primaryButtonName: CopyButtonNameEnum;
	copyButtonName: CopyButtonNameEnum;
	testId?: string
};

const CopyButton = ({
	handleCopyToClipboard,
	copyRef,
	setCopyButtonStateToTrue,
	primaryButtonName,
	copyButtonName,
	testId
}: CopyProps & { copyRef: React.RefObject<HTMLDivElement> }): JSX.Element => {
	const [isCopied, setIsCopied] = useState(false);
	const [showIsCopiedClipBoard, setShowIsCopiedClipBoard] = useState(false);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		if (showIsCopiedClipBoard) {
			timeoutId = setTimeout(() => {
				setShowIsCopiedClipBoard(false);
			}, 2000);
		}
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [showIsCopiedClipBoard]);

	return (
		<div className={cx(jenkinsSetupCopyButtonContainer)} >
			<Button
				iconBefore={isCopied ? <CheckIcon label="Copy" size="medium" /> : <CopyIcon label="Copy" size="medium" />}
				onClick={() => {
					if (copyRef && copyRef.current) {
						handleCopyToClipboard(copyRef, testId);
						setIsCopied(true);
						setShowIsCopiedClipBoard(true);
						setCopyButtonStateToTrue(copyButtonName);
					}
				}}
				appearance= {primaryButtonName === copyButtonName && !isCopied ? 'primary' : 'default'}
				testId={testId}
			>
                Copy
			</Button>
			{showIsCopiedClipBoard && <CopiedToClipboard leftPositionPercent="110%" />}
		</div>
	);
};

type MyJenkinsAdminProps = {
	handleCopyToClipboard: (copyRef: React.RefObject<HTMLDivElement>, elementName?: string) => Promise<void> | void;
	setCopyButtonStateToTrue: (copyButton: CopyButtonNameEnum) => void,
	webhookGuideRef: RefObject<HTMLDivElement>,
	secretTokenRef: RefObject<HTMLDivElement>,
	primaryButtonName: CopyButtonNameEnum,
};

const MyJenkinsAdmin = ({
	handleCopyToClipboard,
	setCopyButtonStateToTrue,
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
						setCopyButtonStateToTrue={setCopyButtonStateToTrue}
						primaryButtonName={primaryButtonName}
						copyButtonName={CopyButtonNameEnum.NonAdminWebhook}
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
						setCopyButtonStateToTrue={setCopyButtonStateToTrue}
						primaryButtonName={primaryButtonName}
						copyButtonName={CopyButtonNameEnum.NonAdminSecret}
						copyRef={secretTokenRef} testId="copy-secret-token-guide" />
				</li>
			</ol>
		</div>
	);
};

type IAmTheJenkinsAdminProps = {
	handleCopyToClipboard: (copyRef: React.RefObject<HTMLDivElement>, elementName?: string) => Promise<void> | void;
	setCopyButtonStateToTrue: (copyButton: CopyButtonNameEnum) => void,
	siteNameRef: RefObject<HTMLDivElement>,
	webhookUrlRef: RefObject<HTMLDivElement>,
	secretRef: RefObject<HTMLDivElement>,
	primaryButtonName: CopyButtonNameEnum,
};

const IAmTheJenkinsAdmin = ({
	handleCopyToClipboard,
	setCopyButtonStateToTrue,
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
						setCopyButtonStateToTrue={setCopyButtonStateToTrue}
						primaryButtonName={primaryButtonName}
						copyButtonName={CopyButtonNameEnum.AdminSiteName}
						copyRef={siteNameRef} testId="site-name-copy-button" />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Webhook URL
					<CopyButton
						handleCopyToClipboard={handleCopyToClipboard}
						setCopyButtonStateToTrue={setCopyButtonStateToTrue}
						primaryButtonName={primaryButtonName}
						copyButtonName={CopyButtonNameEnum.AdminWebhook}
						copyRef={webhookUrlRef} testId="copy-webhook-url" />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Secret
					<CopyButton
						handleCopyToClipboard={handleCopyToClipboard}
						setCopyButtonStateToTrue={setCopyButtonStateToTrue}
						primaryButtonName={primaryButtonName}
						copyButtonName={CopyButtonNameEnum.AdminSecret}
						copyRef={secretRef} testId="copy-secret-token" />
				</li>
			</ol>

			<p className={cx(jenkinsSetupContent)}>When you're done, select Finish</p>
		</div>
	);
};

const enum CopyButtonNameEnum {
	AdminSiteName = 'adminSiteName',
	AdminWebhook = 'adminWebhook',
	AdminSecret = 'adminSecret',
	NonAdminWebhook = 'nonAdminWebhook',
	NonAdminSecret = 'nonAdminSecret'
}

const JenkinsSetup = (): JSX.Element => {
	const history = useHistory();
	const { path } = useParams<ParamTypes>();
	const webhookGuideRef = useRef<HTMLDivElement>(null);
	const secretTokenRef = useRef<HTMLDivElement>(null);
	const secretRef = useRef<HTMLDivElement>(null);
	const siteNameRef = useRef<HTMLDivElement>(null);
	const webhookUrlRef = useRef<HTMLDivElement>(null);
	const { id: uuid, settings } = useParams<ParamTypes>();
	const [serverName, setServerName] = useState('');
	const [showMyJenkinsAdmin, setShowMyJenkinsAdmin] = useState(false);
	const [showIAmTheJenkinsAdmin, setShowIAmTheJenkinsAdmin] = useState(false);
	const [isCopyAdminSiteName, setIsCopyAdminSiteName] = useState(false);
	const [isCopyAdminWebhook, setIsCopyAdminWebhook] = useState(false);
	const [isCopyAdminSecret, setIsCopyAdminSecret] = useState(false);
	const [isCopyNonAdminWebhook, setIsCopyNonAdminWebhook] = useState(false);
	const [isCopyNonAdminSecret, setIsCopyNonAdminSecret] = useState(false);
	const [webhookUrl, setWebhookUrl] = useState('');
	const [secret, setSecret] = useState<string>('');
	const [siteName, setSiteName] = useState<string>('');
	const [globalPageUrl, setGlobalPageUrl] = useState<string>('');
	const [primaryCopyButtonName, setPrimaryCopyButtonName] =
	useState<CopyButtonNameEnum>(CopyButtonNameEnum.NonAdminWebhook);
	const connectionSettings = settings === 'connection-settings';

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

	const setCopiedButtonStateToTrue = (copyButtonName: CopyButtonNameEnum) => {
		switch (copyButtonName) {
			case CopyButtonNameEnum.AdminSiteName:
				setIsCopyAdminSiteName(true);
				if (!isCopyAdminWebhook) {
					setPrimaryCopyButtonName(CopyButtonNameEnum.AdminWebhook);
				} else if (!isCopyAdminSecret) {
					setPrimaryCopyButtonName(CopyButtonNameEnum.AdminSecret);
				}
				break;
			case CopyButtonNameEnum.AdminWebhook:
				setIsCopyAdminWebhook(true);
				if (!isCopyAdminSiteName) {
					setPrimaryCopyButtonName(CopyButtonNameEnum.AdminSiteName);
				} else if (!isCopyAdminSecret) {
					setPrimaryCopyButtonName(CopyButtonNameEnum.AdminSecret);
				}
				break;
			case CopyButtonNameEnum.AdminSecret:
				setIsCopyAdminSecret(true);
				break;
			case CopyButtonNameEnum.NonAdminWebhook:
				setIsCopyNonAdminWebhook(true);
				if (!isCopyNonAdminSecret) {
					setPrimaryCopyButtonName(CopyButtonNameEnum.NonAdminSecret);
				}
				break;
			case CopyButtonNameEnum.NonAdminSecret:
				setIsCopyNonAdminSecret(true);
				break;
			default:
				break;
		}
	};

	const clearCopiedButtonStates = () => {
		setIsCopyAdminSiteName(false);
		setIsCopyAdminWebhook(false);
		setIsCopyAdminSecret(false);
		setIsCopyNonAdminWebhook(false);
		setIsCopyNonAdminSecret(false);
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
			setPrimaryCopyButtonName(CopyButtonNameEnum.NonAdminWebhook);
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
			setPrimaryCopyButtonName(CopyButtonNameEnum.AdminSiteName);
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

	const handleNavigateToConnectionCompleteScreen = (e: React.MouseEvent) => {
		e.preventDefault();

		let pathParam = '';

		if (showMyJenkinsAdmin) {
			pathParam = 'requires-jenkins-admin';
		} else {
			pathParam = 'is-admin';
		}

		if (connectionSettings) {
			if (path === 'admin') {
				history.push('/');
			} else {
				router.navigate(globalPageUrl);
			}
		} else {
			history.push(`/connection-complete/${uuid}/${pathParam}/${path}`);
		}
	};

	const isFetchingData = !serverName || !webhookUrl || !secret;

	const enableFinishButton = (isCopyAdminSecret && isCopyAdminSiteName && isCopyAdminWebhook) ||
								(isCopyNonAdminSecret && isCopyNonAdminWebhook);
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
										setCopyButtonStateToTrue={setCopiedButtonStateToTrue}
										primaryButtonName={primaryCopyButtonName}
										webhookGuideRef={webhookGuideRef}
										secretTokenRef={secretTokenRef}
									/>
								) : null}

								{showIAmTheJenkinsAdmin ? (
									<IAmTheJenkinsAdmin
										handleCopyToClipboard={handleCopyToClipboard}
										setCopyButtonStateToTrue={setCopiedButtonStateToTrue}
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
									isDisabled={!enableFinishButton}
									onClick={(e) => handleNavigateToConnectionCompleteScreen(e)}
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
