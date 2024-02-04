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
import { InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import { CopiedToClipboard } from '../CopiedToClipboard/CopiedToClipboard';
import { ConnectionFlowHeader, ConnectionFlowServerNameSubHeader } from '../ConnectionWizard/ConnectionFlowHeader';
import { SecretTokenContent, WebhookGuideContent } from '../CopiedToClipboard/CopyToClipboardContent';
import { getWebhookUrl } from '../../common/util/jenkinsConnectionsUtils';
import { fetchSiteName } from '../../api/fetchGlobalPageUrl';
import { HELP_LINK, JENKINS_SETUP_SCREEN_NAME } from '../../common/constants';
import { InfoPanel } from '../InfoPanel/InfoPanel';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import { InProductHelpIds } from '../InProductHelpDrawer/InProductHelpIds';
import { ParamTypes } from '../../common/types';

const analyticsClient = new AnalyticsClient();

type CopyProps = {
	handleCopyToClipboard: (copyRef: React.RefObject<HTMLDivElement>, elementName?: string) => Promise<void> | void;
	testId?: string
};

const CopyButton = ({
	handleCopyToClipboard,
	copyRef,
	testId
}: CopyProps & { copyRef: React.RefObject<HTMLDivElement> }): JSX.Element => {
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		if (isCopied) {
			timeoutId = setTimeout(() => {
				setIsCopied(false);
			}, 2000);
		}
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [isCopied]);

	return (
		<div className={cx(jenkinsSetupCopyButtonContainer)} >
			<Button
				iconBefore={<CopyIcon label="Copy" size="medium" />}
				onClick={() => {
					if (copyRef && copyRef.current) {
						handleCopyToClipboard(copyRef, testId);
						setIsCopied(true);
					}
				}}
				testId={testId}
			>
				Copy
			</Button>

			{isCopied && <CopiedToClipboard leftPositionPercent="110%" />}
		</div>
	);
};

type MyJenkinsAdminProps = {
	webhookGuideRef: RefObject<HTMLDivElement>,
	secretTokenRef: RefObject<HTMLDivElement>
};

const MyJenkinsAdmin = ({
	handleCopyToClipboard,
	webhookGuideRef,
	secretTokenRef
}: CopyProps & MyJenkinsAdminProps): JSX.Element => {
	const tooltipContent =
		'Send this token separately to the webhook URL and step-by-step guide. It\'s best practice to use a secure channel like a password management tool.';

	return (
		<div className={cx(jenkinsSetupCopyContainer)}>
			<p className={cx(jenkinsSetupContent)}>Copy the items below and give them to your Jenkins admin</p>

			<ol className={cx(orderedList, jenkinsSetupOrderedList)}>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Webhook URL and step-by-step guide
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} copyRef={webhookGuideRef} testId="copy-webhook-url-guide" />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Secret token
					<Tooltip content={tooltipContent} position="bottom-start">
						<InfoIcon label="help" size="small" />
					</Tooltip>
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} copyRef={secretTokenRef} testId="copy-secret-token-guide" />
				</li>
			</ol>

			<InfoPanel
				content="Your Jenkins admin may need your input as they set up this server."
				iphLabel="How to set up Jenkins servers to suit your team's needs"
				iphType={InProductHelpActionType.HelpLink}
				screenName={JENKINS_SETUP_SCREEN_NAME}
				searchQuery={InProductHelpIds.JENKINS_SET_UP_NON_ADMIN_HOW_TO}
			/>
		</div>
	);
};

type IAmTheJenkinsAdminProps = {
	webhookUrlRef: RefObject<HTMLDivElement>,
	secretRef: RefObject<HTMLDivElement>,
	connectionSettings: boolean
};

const IAmTheJenkinsAdmin = ({
	handleCopyToClipboard,
	webhookUrlRef,
	secretRef,
	connectionSettings
}: CopyProps & IAmTheJenkinsAdminProps): JSX.Element => {
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
					Webhook URL
					<CopyButton
						handleCopyToClipboard={handleCopyToClipboard}
						copyRef={webhookUrlRef} testId="copy-webhook-url" />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Secret token
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} copyRef={secretRef} testId="copy-secret-token" />
				</li>
			</ol>

			<p className={cx(jenkinsSetupContent)}>When you're done, select {connectionSettings ? 'Done' : 'Next'}</p>
		</div>
	);
};

const JenkinsSetup = (): JSX.Element => {
	const history = useHistory();
	const webhookGuideRef = useRef<HTMLDivElement>(null);
	const secretTokenRef = useRef<HTMLDivElement>(null);
	const secretRef = useRef<HTMLDivElement>(null);
	const webhookUrlRef = useRef<HTMLDivElement>(null);
	const { id: uuid, settings } = useParams<ParamTypes>();
	const [serverName, setServerName] = useState('');
	const [showMyJenkinsAdmin, setShowMyJenkinsAdmin] = useState(false);
	const [showIAmTheJenkinsAdmin, setShowIAmTheJenkinsAdmin] = useState(false);
	const [webhookUrl, setWebhookUrl] = useState('');
	const [secret, setSecret] = useState<string>('');
	const [siteName, setSiteName] = useState<string>('');
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
				const url = await fetchSiteName();
				setSiteName(url);
				getServer();
				getWebhookUrl(setWebhookUrl, uuid);

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
			history.push('/');
		} else {
			history.push(`/connection-complete/${uuid}/${pathParam}`);
		}
	};

	const isFetchingData = !serverName || !webhookUrl || !secret;

	return (
		<div className={cx(connectionFlowContainer)}>
			<ConnectionFlowHeader />

			{isFetchingData ? (
				<div className={cx(loadingContainer)} data-testid="loading-spinner">
					<Spinner size='large' />
				</div>
			) : (
				<>
					<ConnectionFlowServerNameSubHeader serverName={serverName} />
					<div className={cx(serverNameFormOuterContainer)}>
						<div className={cx(connectionFlowInnerContainer)}>
							<div className={cx(jenkinsSetupContainer)}>
								<h3 className={cx(jenkinsSetupHeader)}>Set up Jenkins</h3>
								<p className={cx(jenkinsSetupContent)}>
									A Jenkins admin needs to set up your server to complete this connection.
									Select the appropriate option:
								</p>

								<ButtonGroup>
									<Button
										onClick={(e) => handleMyJenkinsAdminClick(e)}
										appearance={showMyJenkinsAdmin ? 'primary' : 'default'}
										testId="my-jenkins-admin"
									>
										A Jenkins admin is helping me
									</Button>
									<Button
										onClick={(e) => handleIAmTheJenkinsAdminClick(e)}
										appearance={showIAmTheJenkinsAdmin ? 'primary' : 'default'}
										testId="i-am-the-jenkins-admin"
									>
										I'm logging into Jenkins myself
									</Button>
								</ButtonGroup>

								{showMyJenkinsAdmin ? (
									<MyJenkinsAdmin
										handleCopyToClipboard={handleCopyToClipboard}
										webhookGuideRef={webhookGuideRef}
										secretTokenRef={secretTokenRef}
									/>
								) : null}

								{showIAmTheJenkinsAdmin ? (
									<IAmTheJenkinsAdmin
										handleCopyToClipboard={handleCopyToClipboard}
										webhookUrlRef={webhookUrlRef}
										secretRef={secretRef}
										connectionSettings={connectionSettings}
									/>
								) : null}
							</div>

							{showMyJenkinsAdmin || showIAmTheJenkinsAdmin ? (
								<Button
									type="button"
									appearance="primary"
									onClick={(e) => handleNavigateToConnectionCompleteScreen(e)}
								>
									{connectionSettings ? 'Done' : 'Next'}
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
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export { JenkinsSetup };
