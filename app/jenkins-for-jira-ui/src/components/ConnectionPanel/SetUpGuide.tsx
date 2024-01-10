import React from 'react';
import { cx } from '@emotion/css';
import Button from '@atlaskit/button/standard-button';
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
import { InProductHelpAction, InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import {
	nestedOrderedList, nestedOrderedListItem, orderedList, orderedListItem
} from '../../GlobalStyles.styles';
import { InfoPanel } from '../InfoPanel/InfoPanel';

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
				{/* Button */}
				<InProductHelpAction label="Learn more" type={InProductHelpActionType.HelpButton} />

				<Button onClick={() => refreshServerAfterUpdate(serverUuid)}>Refresh</Button>
			</div>
		</>
	);
};

type SetUpGuidePipelineStepInstructionProps = {
	eventType: string,
	pipelineStepLabel: string
};

const SetUpGuidePipelineStepInstruction = ({
	eventType,
	pipelineStepLabel
}: SetUpGuidePipelineStepInstructionProps): JSX.Element => {
	return (
		<p>Add a&nbsp;
			<InProductHelpAction
				label={pipelineStepLabel}
				type={InProductHelpActionType.HelpLink}
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
				/>
				<p>
					<strong>OR</strong>
				</p>
				<p>
					Name {eventType === PipelineEventType.DEPLOYMENT ? 'deployment' : 'build'}
					&nbsp;stages to match this regex:&nbsp;
					<InProductHelpAction
						label={regex || '<regex>'}
						type={InProductHelpActionType.HelpLink}
					/>
				</p>
			</>
		);
	} else if (eventType === PipelineEventType.BUILD && globalSettings && !regex?.length) {
		contentToRender =
			<p>
				<InProductHelpAction label="No setup required" type={InProductHelpActionType.HelpLink} />
			</p>;
	} else {
		contentToRender = (
			<SetUpGuidePipelineStepInstruction
				eventType={eventType}
				pipelineStepLabel={pipelineStepLabel}
			/>
		);
	}

	return (
		<li className={cx(nestedOrderedListItem)}>
			Set up what {eventType} events are sent to Jira: {pipelineStepLabel}
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
						(e.g. <InProductHelpAction label="JIRA-1234" type={InProductHelpActionType.HelpLink} />)
						into their branch names and commit message.
					</p>
				</li>

				<li className={cx(orderedListItem)}><strong>The person setting up your Jenkinsfile</strong>
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

			<InfoPanel
				content="Not sure who should use this guide? It depends how your teams use Jenkins."
				iphLabel="Here’s what you need to know."
				iphType={InProductHelpActionType.HelpLink}
			/>
		</>
	);
};

export { SetUpGuide };
