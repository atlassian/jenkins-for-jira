import React, {
	useCallback, useEffect, useRef, useState
} from 'react';
import { cx } from '@emotion/css';
import Button, { ButtonGroup } from '@atlaskit/button';
import InfoIcon from '@atlaskit/icon/glyph/info';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import Tooltip from '@atlaskit/tooltip';
import PeopleGroup from '@atlaskit/icon/glyph/people-group';
import { useParams } from 'react-router';
import { KeyboardOrMouseEvent } from '@atlaskit/modal-dialog';
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
	jenkinsSetUpCopyContent
} from './JenkinsSetup.styles';
import { getJenkinsServerWithSecret } from '../../api/getJenkinsServerWithSecret';
import { ParamTypes } from '../ConnectJenkins/ConnectJenkins/ConnectJenkins';
import { serverNameFormOuterContainer } from '../ServerNameForm/ServerNameForm.styles';
import { InProductHelpAction, InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import { CopiedToClipboard } from '../CopiedToClipboard/CopiedToClipboard';
import { ConnectionFlowHeader } from '../ConnectionWizard/ConnectionFlowHeader';
import { WebhookGuideContent } from '../CopiedToClipboard/CopyToClipboardContent';

type CopyProps = {
	handleCopyToClipboard(
		event: KeyboardOrMouseEvent
	): Promise<void> | void;
};

const CopyButton = ({ handleCopyToClipboard }: CopyProps): JSX.Element => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyClick = (e: React.MouseEvent) => {
		handleCopyToClipboard(e);
		setIsCopied(true);

		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	return (
		<div className={cx(jenkinsSetupCopyButtonContainer)}>
			<Button
				iconBefore={<CopyIcon label="Copy" size="medium" />}
				onClick={(e) => handleCopyClick(e)}
			>
				Copy
			</Button>

			{isCopied ? <CopiedToClipboard /> : null}
		</div>
	);
};

const MyJenkinsAdmin = ({ handleCopyToClipboard }: CopyProps): JSX.Element => {
	const tooltipContent =
		'Send this secret token separately to the webhook URL and step-by-step guide. For example, if you used chat to send the webhook, send the secret via email.';

	return (
		<div className={cx(jenkinsSetupCopyContainer)}>
			<p className={cx(jenkinsSetupContent)}>Copy the items below and give them to your Jenkins admin</p>

			<ol className={cx(orderedList, jenkinsSetupOrderedList)}>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Webhook URL and step-by-step guide
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Secret token
					<Tooltip content={tooltipContent} position="bottom-start">
						<InfoIcon label="help" size="small" />
					</Tooltip>
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} />
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

const IAmTheJenkinsAdmin = ({ handleCopyToClipboard }: CopyProps): JSX.Element => {
	return (
		<div className={cx(jenkinsSetupCopyContainer)}>
			<p className={cx(jenkinsSetupContent)}>
				Log in to Jenkins in another window and use the items below to set up your server.
			</p>

			<ol className={cx(orderedList, jenkinsSetupOrderedList)}>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Step-by-step guide
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Webhook URL
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} />
				</li>
				<li className={cx(orderedListItem, jenkinsSetupListItem)}>
					Secret token
					<CopyButton handleCopyToClipboard={handleCopyToClipboard} />
				</li>
			</ol>

			<p className={cx(jenkinsSetupContent)}>When you’re done, select Next</p>
		</div>
	);
};

const JenkinsSetup = (): JSX.Element => {
	const { id: uuid } = useParams<ParamTypes>();
	const [serverName, setServerName] = useState('');
	const [showMyJenkinsAdmin, setShowMyJenkinsAdmin] = useState(false);
	const [showIAmTheJenkinsAdmin, setShowIAmTheJenkinsAdmin] = useState(false);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const handleCopyToClipboard = async () => {
		if (textAreaRef.current) {
			textAreaRef.current.select();
			document.execCommand('copy');
			textAreaRef.current.setSelectionRange(textAreaRef.current.value.length, textAreaRef.current.value.length);
		}
	};

	const getServer = useCallback(async () => {
		try {
			const { name } = await getJenkinsServerWithSecret(uuid);
			setServerName(name);
		} catch (e) {
			console.error('No Jenkins server found.');
		}
	}, [uuid]);

	useEffect(() => {
		getServer();
	}, [uuid, getServer]);

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
							<MyJenkinsAdmin handleCopyToClipboard={handleCopyToClipboard} />
						) : null}

						{showIAmTheJenkinsAdmin ? (
							<IAmTheJenkinsAdmin handleCopyToClipboard={handleCopyToClipboard} />
						) : null}
					</div>

					{showMyJenkinsAdmin || showIAmTheJenkinsAdmin ? (
						<Button type="button" appearance="primary">
							Next
						</Button>
					) : null}

					<div className={cx(jenkinsSetUpCopyContent)}>
						<WebhookGuideContent textAreaRef={textAreaRef} />
					</div>
				</div>
			</div>
		</div>
	);
};

export { JenkinsSetup };
