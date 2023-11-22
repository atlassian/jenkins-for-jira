import React, { useEffect, useState } from 'react';
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

type SetUpGuideLinkProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
	label: string,
};

const SetUpGuideLink = ({ onClick, label }: SetUpGuideLinkProps): JSX.Element => {
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

enum PipelineEventType {
	BUILD = 'build',
	DEPLOYMENT = 'deployment'
}

type SetUpGuideInstructionsProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
	eventType: PipelineEventType,
	globalSettings: boolean,
	buildFilters: boolean
};

const SetUpGuideInstructions = ({
	onClick,
	eventType,
	globalSettings,
	buildFilters
}: SetUpGuideInstructionsProps): JSX.Element => {
	const pipelineStepLabel = eventType === PipelineEventType.BUILD ? 'jiraSendBuildInfo' : 'jiraSendDeploymentInfo';

	return (
		<li className={cx(setUpGuideNestedOrderedListItem)}>
			Set up what {eventType} events are sent to Jira:
			{
				!globalSettings
					? <SetUpGuidePipelineStepInstruction
						eventType={eventType}
						onClick={onClick}
						pipelineStepLabel={pipelineStepLabel}
					/>
					: <>
						{
							!buildFilters && eventType === PipelineEventType.BUILD
								? <p><SetUpGuideLink onClick={onClick} label="No setup required" /></p>
								: <>
									<SetUpGuidePipelineStepInstruction
										eventType={eventType}
										onClick={onClick}
										pipelineStepLabel={pipelineStepLabel}
									/>
									<p><strong>OR</strong></p>
									<p>Use &nbsp;
										<SetUpGuideLink onClick={onClick} label="&lt;regex&gt;" />&nbsp;
										in the names of the {eventType} stages.
									</p>
								</>
						}
					</>
			}
		</li>
	);
};

const SetUpGuide = (): JSX.Element => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [areGlobalSettingsOn, setAreGlobalSettingsOn] = useState(false);
	const [hasBuildFilters, setHasBuildFilters] = useState(false);

	useEffect(() => {
		// TODO - update global settings based on new data received from Jenkins plugin
		setAreGlobalSettingsOn(false);
		setHasBuildFilters(false);
	}, []);

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	const onClose = () => {
		setIsDrawerOpen(false);
	};

	return (
		<div className={cx(setUpGuideContainer)}>
			<Drawer
				onClose={onClose}
				isOpen={isDrawerOpen}
				width="wide"
				label="Basic drawer"
			>
				{/* TODO - update this to render content for the 'link' clicked */}
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
							globalSettings={areGlobalSettingsOn}
							buildFilters={hasBuildFilters}
						/>
						<SetUpGuideInstructions
							onClick={openDrawer}
							eventType={PipelineEventType.DEPLOYMENT}
							globalSettings={areGlobalSettingsOn}
							buildFilters={hasBuildFilters}
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
