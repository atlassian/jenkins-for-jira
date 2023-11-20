import React from 'react';
import { cx } from '@emotion/css';
import PeopleGroup from '@atlaskit/icon/glyph/people-group';
import {
	setUpGuideCode,
	setUpGuideInfoPanel,
	setUpGuideNestedOrderedList,
	setUpGuideNestedOrderedListItem,
	setUpGuideOrderedList,
	setUpGuideOrderedListItem,
	setUpGuideOrderListItemHeader,
	setUpGuideParagraph
} from './ConnectionPanel.styles';

const SetUpGuide = (): JSX.Element => {
	return (
		<>
			<p className={cx(setUpGuideParagraph)}>To receive build and deployment data from this server:</p>

			<ol className={cx(setUpGuideOrderedList)}>
				<li className={cx(setUpGuideOrderedListItem)}>
					<strong className={cx(setUpGuideOrderListItemHeader)}>Developers in your project teams</strong>
					<p id="setup-step-one-instruction">Must enter their Jira issue keys
						(e.g. <code className={cx(setUpGuideCode)}>JIRA-1234</code>)
						into their branch names and commit message.
					</p>
				</li>

				<li className={cx(setUpGuideOrderedListItem)}><strong>The person setting up your Jenkinsfile</strong>
					<ol className={cx(setUpGuideNestedOrderedList)} type="A" id="nested-list">
						<li className={cx(setUpGuideNestedOrderedListItem)}>
							Must choose what build events are sent to Jira:
							<p>add a &nbsp;
								<code className={cx(setUpGuideCode)}>jiraSendBuildInfo</code>&nbsp;
								step to the end of build stages.
							</p>
							<p><strong>OR</strong></p>
							<p>Use &nbsp;
								<code className={cx(setUpGuideCode)}>&lt;regex&gt;</code>&nbsp;
								in the names of the build stages.
							</p>
						</li>

						<li className={cx(setUpGuideNestedOrderedListItem)}>
							Must choose what deployment events are sent to Jira:
							<p>add a &nbsp;
								<code className={cx(setUpGuideCode)}>jiraSendDeploymentInfo</code>&nbsp;
								step to the end of deployment stages.</p>
							<p><strong>OR</strong></p>
							<p>Use &nbsp;
								<code className={cx(setUpGuideCode)}>&lt;regex&gt;</code>&nbsp;
								in the names of the deployment stages.
							</p>
						</li>

					</ol>
				</li>
			</ol>

			<div className={cx(setUpGuideInfoPanel)}>
				<PeopleGroup label="people-group" />
				<p>Not sure who should use this guide? It depends how your teams use Jenkins. &nbsp;
					{/* TODO - add anchor tag */}
					Here’s what you need to know.</p>
			</div>
		</>
	);
};

export { SetUpGuide };
