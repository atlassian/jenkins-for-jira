import React from 'react';
import { cx } from '@emotion/css';
import Button from '@atlaskit/button/standard-button';
import { Code } from '@atlaskit/code';
import {
	setUpGuideOrderListItemHeader,
	setUpGuideParagraph,
	setUpGuideUpdateAvailableButtonContainer,
	setUpGuideUpdateAvailableContent,
	setUpGuideUpdateAvailableHeader,
	setUpGuideUpdateAvailableIconContainer
} from './ConnectionPanel.styles';
import { JenkinsPluginConfig } from '../../../../src/common/types';
import { UpdateAvailableIcon } from '../icons/UpdateAvailableIcon';
import {
	InProductHelpAction,
	InProductHelpActionButtonAppearance,
	InProductHelpActionType
} from '../InProductHelpDrawer/InProductHelpAction';
import {
	nestedOrderedList, nestedOrderedListItem, orderedList, orderedListItem
} from '../../GlobalStyles.styles';
import { SET_UP_GUIDE_SCREEN_NAME } from '../../common/constants';
import { InProductHelpIds } from '../InProductHelpDrawer/InProductHelpIds';

type UpdateAvailableProps = {
	refreshServerAfterUpdate(serverUuidToUpdate: string): void,
	serverUuid: string
};

export const UpdateAvailable = ({
	refreshServerAfterUpdate,
	serverUuid
}: UpdateAvailableProps): JSX.Element => {
	return (
		<>
			<UpdateAvailableIcon containerClassName={setUpGuideUpdateAvailableIconContainer} />
			<h3 className={cx(setUpGuideUpdateAvailableHeader)}>Update available</h3>
			<p className={cx(setUpGuideUpdateAvailableContent)}>This server is connected to Jira and sending data,
				but is using an outdated Atlassian Software Cloud plugin.</p>
			<p className={cx(setUpGuideUpdateAvailableContent)}>To access features like this set up guide,
				a Jenkins admin must log into this server and update the plugin.</p>
			<div className={cx(setUpGuideUpdateAvailableButtonContainer)}>
				<InProductHelpAction
					label="Learn more"
					type={InProductHelpActionType.HelpButton}
					appearance={InProductHelpActionButtonAppearance.Primary}
					searchQuery={InProductHelpIds.UPDATE_AVAILABLE_SERVER_LEARN_MORE}
					screenName={SET_UP_GUIDE_SCREEN_NAME}
				/>
				<Button onClick={() => refreshServerAfterUpdate(serverUuid)}>Refresh</Button>
			</div>
		</>
	);
};

type SetUpGuidePipelineStepInstructionProps = {
	eventType: string,
	pipelineStepLabel: string,
	searchQuery: string
};

const SetUpGuidePipelineStepInstruction = ({
	eventType,
	pipelineStepLabel,
	searchQuery
}: SetUpGuidePipelineStepInstructionProps): JSX.Element => {
	return (
		<p>Add a&nbsp;
			<InProductHelpAction
				label={pipelineStepLabel}
				type={InProductHelpActionType.HelpLink}
				searchQuery={searchQuery}
				screenName={SET_UP_GUIDE_SCREEN_NAME}
			/>&nbsp;step to the end of {eventType} stages.
		</p>
	);
};

export enum PipelineEventType {
	BUILD = 'build',
	DEPLOYMENT = 'deployment'
}

type SetUpGuideInstructionsProps = {
	eventType: PipelineEventType,
	globalSettings?: boolean,
	regex?: string
};

export const SetUpGuideInstructions = ({
	eventType,
	globalSettings,
	regex
}: SetUpGuideInstructionsProps): JSX.Element => {
	const pipelineStepLabel =
		eventType === PipelineEventType.BUILD
			? 'jiraSendBuildInfo'
			: 'jiraSendDeploymentInfo';

	const infoSearchQuery =
		eventType === PipelineEventType.BUILD
			? InProductHelpIds.SET_UP_GUIDE_JIRA_SEND_BUILD_INFO
			: InProductHelpIds.SET_UP_GUIDE_JIRA_SEND_DEPLOYMENT_INFO;

	const regexSearchQuery =
		eventType === PipelineEventType.BUILD
			? InProductHelpIds.SET_UP_GUIDE_BUILD_STAGES
			: InProductHelpIds.SET_UP_GUIDE_DEPLOYMENT_STAGES;

	let contentToRender;

	if (
		globalSettings &&
		((eventType === PipelineEventType.DEPLOYMENT) ||
			(eventType === PipelineEventType.BUILD && regex?.length))
	) {
		contentToRender = (
			<>
				<SetUpGuidePipelineStepInstruction
					eventType={eventType}
					pipelineStepLabel={pipelineStepLabel}
					searchQuery={infoSearchQuery}
				/>
				<p><strong>OR</strong> name {eventType === PipelineEventType.DEPLOYMENT ? 'deployment' : 'build'}
					&nbsp;stages to match this regex:&nbsp;
					<InProductHelpAction
						label={regex || '<regex>'}
						type={InProductHelpActionType.HelpLink}
						searchQuery={regexSearchQuery}
						screenName={SET_UP_GUIDE_SCREEN_NAME}
					/>
				</p>
			</>
		);
	} else if (eventType === PipelineEventType.BUILD && globalSettings && !regex?.length) {
		contentToRender =
			<p>
				<InProductHelpAction
					label="No setup required"
					type={InProductHelpActionType.HelpLink}
					searchQuery={InProductHelpIds.SET_UP_GUIDE_NO_SET_UP_REQUIRED}
					screenName={SET_UP_GUIDE_SCREEN_NAME}
				/>
			</p>;
	} else {
		contentToRender = (
			<SetUpGuidePipelineStepInstruction
				eventType={eventType}
				pipelineStepLabel={pipelineStepLabel}
				searchQuery={infoSearchQuery}
			/>
		);
	}

	return (
		<li className={cx(nestedOrderedListItem)}>
			Must choose what <strong>{eventType} events</strong> are sent to Jira. To do this:
			{contentToRender}
		</li>
	);
};

type SetUpGuideProps = {
	pluginConfig?: JenkinsPluginConfig
};

const SetUpGuide = ({
	pluginConfig
}: SetUpGuideProps): JSX.Element => {
	return (
		<>
			<p className={cx(setUpGuideParagraph)}>To receive build and deployment data from this server:</p>

			<ol className={cx(orderedList)}>
				<li className={cx(orderedListItem)}>
					<strong className={cx(setUpGuideOrderListItemHeader)}>
						Developers in your project teams
					</strong>
					<p id="setup-step-one-instruction">Must enter their Jira issue keys
						(e.g. <Code>JIRA-1234</Code>) into their branch names and commit message.
					</p>
				</li>

				<li className={cx(orderedListItem)}><strong>The person setting up your Jenkinsfile(s)</strong>
					<ol className={cx(nestedOrderedList)} type="A" id="nested-list">
						<SetUpGuideInstructions
							eventType={PipelineEventType.BUILD}
							globalSettings={pluginConfig?.autoBuildEnabled}
							regex={pluginConfig?.autoBuildRegex}
						/>
						<SetUpGuideInstructions
							eventType={PipelineEventType.DEPLOYMENT}
							globalSettings={pluginConfig?.autoDeploymentsEnabled}
							regex={pluginConfig?.autoDeploymentsRegex}
						/>
					</ol>
				</li>
			</ol>
		</>
	);
};

export { SetUpGuide };
