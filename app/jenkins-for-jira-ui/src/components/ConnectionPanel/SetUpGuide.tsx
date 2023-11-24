import React, { useState } from 'react';
import { cx } from '@emotion/css';
import Drawer from '@atlaskit/drawer';
import PeopleGroup from '@atlaskit/icon/glyph/people-group';
import {
	setUpGuideLink,
	setUpGuideInfoPanel,
	setUpGuideNestedOrderedList,
	setUpGuideNestedOrderedListItem,
	setUpGuideOrderedList,
	setUpGuideOrderedListItem,
	setUpGuideOrderListItemHeader,
	setUpGuideParagraph,
	setUpGuideContainer
} from './ConnectionPanel.styles';
import { JenkinsPluginConfig } from '../../../../src/common/types';

type SetUpGuideLinkProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
	label: string,
};

export const SetUpGuideLink = ({ onClick, label }: SetUpGuideLinkProps): JSX.Element => {
	return (
		<button className={cx(setUpGuideLink)} onClick={onClick}>
			{label}
		</button>
	);
};

type SetUpGuidePipelineStepInstructionProps = {
	eventType: string,
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
	pipelineStepLabel: string
};

const SetUpGuidePipelineStepInstruction = ({
	eventType,
	onClick,
	pipelineStepLabel
}: SetUpGuidePipelineStepInstructionProps): JSX.Element => {
	return (
		<p>Add a &nbsp;
			<SetUpGuideLink onClick={onClick} label={pipelineStepLabel} />&nbsp;
			step to the end of {eventType} stages.
		</p>
	);
};

export enum PipelineEventType {
	BUILD = 'build',
	DEPLOYMENT = 'deployment'
}

type SetUpGuideInstructionsProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
	eventType: PipelineEventType,
	globalSettings?: boolean,
	regex?: string
};

export const SetUpGuideInstructions = ({
	onClick,
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
					onClick={onClick}
					pipelineStepLabel={pipelineStepLabel}
				/>
				<p>
					<strong>OR</strong>
				</p>
				<p>
					Use &nbsp;
					<SetUpGuideLink
						onClick={onClick}
						label={regex || '<regex>'}
					/>
					&nbsp; in the names of the {eventType} stages.
				</p>
			</>
		);
	} else if (eventType === PipelineEventType.BUILD && globalSettings && !regex?.length) {
		contentToRender = <p><SetUpGuideLink onClick={onClick} label="No setup required" /></p>;
	} else {
		contentToRender = (
			<SetUpGuidePipelineStepInstruction
				eventType={eventType}
				onClick={onClick}
				pipelineStepLabel={pipelineStepLabel}
			/>
		);
	}

	return (
		<li className={cx(setUpGuideNestedOrderedListItem)}>
			Set up what {eventType} events are sent to Jira: {pipelineStepLabel}
			{contentToRender}
		</li>
	);
};

type SetUpGuideProps = {
	pluginConfig?: JenkinsPluginConfig
};

const SetUpGuide = ({ pluginConfig }: SetUpGuideProps): JSX.Element => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	const onClose = () => {
		setIsDrawerOpen(false);
	};

	if (!pluginConfig) {
		return <div>Yet to be decided...</div>;
	}

	return (
		<div className={cx(setUpGuideContainer)}>
			<Drawer
				onClose={onClose}
				isOpen={isDrawerOpen}
				width="wide"
				label="Basic drawer"
			>
				{/* TODO - update this to render content for the 'link' clicked
					(will be done after I dig into drawer usage */}
				<div>Add content here for each link item</div>
			</Drawer>
			<p className={cx(setUpGuideParagraph)}>To receive build and deployment data from this server:</p>

			<ol className={cx(setUpGuideOrderedList)}>
				<li className={cx(setUpGuideOrderedListItem)}>
					<strong className={cx(setUpGuideOrderListItemHeader)}>Developers in your project teams</strong>
					<p id="setup-step-one-instruction">Must enter their Jira issue keys
						(e.g. <SetUpGuideLink onClick={openDrawer} label="JIRA-1234" />)
						into their branch names and commit message.
					</p>
				</li>

				<li className={cx(setUpGuideOrderedListItem)}><strong>The person setting up your Jenkinsfile</strong>
					<ol className={cx(setUpGuideNestedOrderedList)} type="A" id="nested-list">
						<SetUpGuideInstructions
							onClick={openDrawer}
							eventType={PipelineEventType.BUILD}
							globalSettings={!!pluginConfig?.autoBuildEnabled}
							regex={pluginConfig?.autoBuildRegex}
						/>
						<SetUpGuideInstructions
							onClick={openDrawer}
							eventType={PipelineEventType.DEPLOYMENT}
							globalSettings={!!pluginConfig?.autoDeploymentsEnabled}
							regex={pluginConfig?.autoDeploymentsRegex}
						/>
					</ol>
				</li>
			</ol>

			<div className={cx(setUpGuideInfoPanel)}>
				<PeopleGroup label="people-group" />
				<p>
					Not sure who should use this guide? It depends how your teams use Jenkins.&nbsp;
					<SetUpGuideLink onClick={openDrawer} label="Here’s what you need to know." />
				</p>
			</div>
		</div>
	);
};

export { SetUpGuide };
