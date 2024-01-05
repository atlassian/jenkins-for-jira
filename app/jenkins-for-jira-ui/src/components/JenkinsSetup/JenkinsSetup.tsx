import React, {
	RefObject,
	useCallback, useEffect, useRef, useState
} from 'react';
import { cx } from '@emotion/css';
import Button, { ButtonGroup } from '@atlaskit/button';
import InfoIcon from '@atlaskit/icon/glyph/info';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import OpenIcon from '@atlaskit/icon/glyph/open';
import Tooltip from '@atlaskit/tooltip';
import PeopleGroup from '@atlaskit/icon/glyph/people-group';
import { useParams } from 'react-router';
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
	jenkinsSetupServerName,
	jenkinsSetUpInfoPanel,
	jenkinsSetUpInfoPanelContentContainer,
	jenkinsSetUpCopyHiddenContent
} from './JenkinsSetup.styles';
import { getJenkinsServerWithSecret } from '../../api/getJenkinsServerWithSecret';
import { ParamTypes } from '../ConnectJenkins/ConnectJenkins/ConnectJenkins';
import { serverNameFormOuterContainer } from '../ServerNameForm/ServerNameForm.styles';
import { InProductHelpAction, InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import { CopiedToClipboard } from '../CopiedToClipboard/CopiedToClipboard';
import { ConnectionFlowHeader } from '../ConnectionWizard/ConnectionFlowHeader';
import { SecretTokenContent, WebhookGuideContent } from '../CopiedToClipboard/CopyToClipboardContent';
import { getWebhookUrl } from '../../common/util/jenkinsConnectionsUtils';
import { fetchGlobalPageUrl } from '../../api/fetchGlobalPageUrl';

type CopyProps = {
	handleCopyToClipboard: (copyRef: React.RefObject<HTMLDivElement>) => Promise<void> | void;
	secret?: string,
	webhookUrl?: string
};

const CopyButton = ({
	handleCopyToClipboard,
	copyRef
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
		<div className={cx(jenkinsSetupCopyButtonContainer)}>
			<Button
				iconBefore={<CopyIcon label="Copy" size="medium" />}
				onClick={() => {
					if (copyRef && copyRef.current) {
						handleCopyToClipboard(copyRef);
						setIsCopied(true);
					}
				}}
			>
				Copy
			</Button>

			{isCopied ? <CopiedToClipboard /> : null}
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
		'Send this secret token separately to the webhook URL and step-by-step guide. For example, if you used chat to send the webhook, send the secret via email.';

	return (
		<div className={cx(jenkinsSetupCopyContainer)}>
			<p className={cx(jenkinsSetupContent)}>Copy the items below and give them to your Jenkins admin</p>

			<ol className={cx(orderedList, jenkinsSetupOrderedList)}>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Webhook URL and step-by-step guide
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} copyRef={webhookGuideRef} />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Secret token
					<Tooltip content={tooltipContent} position="bottom-start">
						<InfoIcon label="help" size="small" />
					</Tooltip>
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} copyRef={secretTokenRef} />
				</li>
			</ol>

			{/* TODO - convert info panel to a component */}
			<div className={cx(jenkinsSetUpInfoPanel)}>
				<PeopleGroup label="people-group" />
				<div className={cx(jenkinsSetUpInfoPanelContentContainer)}>
					<p>
						Your Jenkins admin may need your input as they set up this server.&nbsp;
						<InProductHelpAction
							label="How to set up Jenkins servers to suit your team’s needs"
							type={InProductHelpActionType.HelpLink}
							appearance="link"
							className="setUpInfoPanelHelpLink"
						/>
					</p>
				</div>
			</div>
		</div>
	);
};

type IAmTheJenkinsAdminProps = {
	webhookUrlRef: RefObject<HTMLDivElement>,
	secretRef: RefObject<HTMLDivElement>
};

const IAmTheJenkinsAdmin = ({
	handleCopyToClipboard,
	secret,
	webhookUrl,
	webhookUrlRef,
	secretRef
}: CopyProps & IAmTheJenkinsAdminProps): JSX.Element => {
	console.log(secret);
	console.log(webhookUrl);
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
							// onClick={(e) => handleCopyClick(e)}
						>
							View
						</Button>
					</div>
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Webhook URL
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} copyRef={webhookUrlRef} />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Secret token
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} copyRef={secretRef} />
				</li>
			</ol>

			<p className={cx(jenkinsSetupContent)}>When you’re done, select Next</p>
		</div>
	);
};

const JenkinsSetup = (): JSX.Element => {
	const webhookGuideRef = useRef<HTMLDivElement>(null);
	const secretTokenRef = useRef<HTMLDivElement>(null);
	const secretRef = useRef<HTMLDivElement>(null);
	const webhookUrlRef = useRef<HTMLDivElement>(null);
	const { id: uuid } = useParams<ParamTypes>();
	const [serverName, setServerName] = useState('');
	const [showMyJenkinsAdmin, setShowMyJenkinsAdmin] = useState(false);
	const [showIAmTheJenkinsAdmin, setShowIAmTheJenkinsAdmin] = useState(false);
	const [webhookUrl, setWebhookUrl] = useState('');
	const [secret, setSecret] = useState<string>('');
	const [siteName, setSiteName] = useState<string>('');

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
				const url = await fetchGlobalPageUrl();
				setSiteName(url);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
		getServer();
		getWebhookUrl(setWebhookUrl, uuid);
	}, [uuid, getServer]);

	const handleCopyToClipboard = (copyRef: React.RefObject<HTMLDivElement>) => {
		if (copyRef.current) {
			const range = document.createRange();
			range.selectNode(copyRef.current);
			window.getSelection()?.removeAllRanges();
			window.getSelection()?.addRange(range);
			document.execCommand('copy');
			window.getSelection()?.removeAllRanges();
		}
	};

	const handleMyJenkinsAdminClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setShowMyJenkinsAdmin(true);
		setShowIAmTheJenkinsAdmin(false);
	};

	const handleIAmTheJenkinsAdminClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setShowIAmTheJenkinsAdmin(true);
		setShowMyJenkinsAdmin(false);
	};

	return (
		<div className={cx(connectionFlowContainer)}>
			<ConnectionFlowHeader />
			<p className={cx(jenkinsSetupServerName)}>Server name: {serverName}</p>

			<div className={cx(serverNameFormOuterContainer)}>
				<div className={cx(connectionFlowInnerContainer)}>
					<div className={cx(jenkinsSetupContainer)}>
						<h3 className={cx(jenkinsSetupHeader)}>Set up Jenkins</h3>
						<p className={cx(jenkinsSetupContent)}>
							A Jenkins admin needs to set up your server to complete this connection.
						</p>
						<p className={cx(jenkinsSetupContent)}>Who's logging into Jenkins?</p>

						<ButtonGroup>
							<Button
								onClick={(e) => handleMyJenkinsAdminClick(e)}
								appearance={showMyJenkinsAdmin ? 'primary' : 'default'}
							>
								My Jenkins admin
							</Button>
							<Button
								onClick={(e) => handleIAmTheJenkinsAdminClick(e)}
								appearance={showIAmTheJenkinsAdmin ? 'primary' : 'default'}
							>
								I am (I'm a Jenkins admin)
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
								secret={secret}
								webhookUrl={webhookUrl}
								webhookUrlRef={webhookUrlRef}
								secretRef={secretRef}
							/>
						) : null}
					</div>

					{showMyJenkinsAdmin || showIAmTheJenkinsAdmin ? (
						<Button type="button" appearance="primary">
							Next
						</Button>
					) : null}

					<div className={cx(jenkinsSetUpCopyHiddenContent)}>
						<WebhookGuideContent divRef={webhookGuideRef} siteName={siteName} webhookUrl={webhookUrl} />
						<SecretTokenContent divRef={secretTokenRef} siteName={siteName} secret={secret} />
						<div ref={secretRef}>{secret}</div>
						<div ref={webhookUrlRef}>{webhookUrl}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export { JenkinsSetup };
