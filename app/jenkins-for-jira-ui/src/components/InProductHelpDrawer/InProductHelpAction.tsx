import React, { useState } from 'react';
import { cx } from '@emotion/css';
import {
	inProductHelpActionButton, inProductHelpActionButtonDefault,
	inProductHelpActionButtonPrimary,
	inProductHelpActionLink
} from './InProductHelp.styles';
import { InProductHelpDrawer } from './InProductHelpDrawer';
import { Hit } from '../../hooks/useAlgolia';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import {
	CONNECTION_WIZARD_SCREEN_NAME,
	JENKINS_SETUP_SCREEN_NAME,
	SET_UP_GUIDE_SCREEN_NAME
} from '../../common/constants';

export enum InProductHelpActionButtonAppearance {
	Primary = 'primary',
	Default = 'default'
}

export enum InProductHelpActionType {
	HelpLink = 'link',
	HelpButton = 'button'
}

type InProductHelpActionProps = {
	label: string,
	type: InProductHelpActionType,
	appearance?: InProductHelpActionButtonAppearance,
	indexName: string
	screenName?: string
};

const analyticsClient = new AnalyticsClient();

const iphClickSource = (screenName?: string): string => {
	switch (screenName) {
		case SET_UP_GUIDE_SCREEN_NAME:
			return AnalyticsScreenEventsEnum.ServerManagementScreenName;
		case CONNECTION_WIZARD_SCREEN_NAME:
			return AnalyticsScreenEventsEnum.ConnectionWizardScreenName;
		case JENKINS_SETUP_SCREEN_NAME:
			return AnalyticsScreenEventsEnum.JenkinsSetupScreenName;
		default:
			return '';
	}
};
// ...

export const InProductHelpAction = ({
	label,
	type,
	appearance,
	indexName,
	screenName
}: InProductHelpActionProps): JSX.Element => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [hits, setHits] = useState<Hit[]>([]);
	const inProductHelpTypeClassName =
		type === InProductHelpActionType.HelpLink
			? inProductHelpActionLink
			: inProductHelpActionButton;
	const actionRole = InProductHelpActionType.HelpLink ? 'link' : 'button';
	const inProductHelpButtonStyles =
		appearance === InProductHelpActionButtonAppearance.Primary
			? inProductHelpActionButtonPrimary
			: inProductHelpActionButtonDefault;

	const actionSubject = type === InProductHelpActionType.HelpButton ? 'button' : 'link';

	const openDrawer = async () => {
		setIsDrawerOpen(true);

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.OpenInProductionHelpDrawerName,
			{
				source: iphClickSource(screenName) || '',
				actionSubject,
				elementName: label
			}
		);
	};

	return (
		<>
			<span
				role={actionRole}
				className={cx(inProductHelpTypeClassName, inProductHelpButtonStyles)}
				onClick={(e) => {
					e.preventDefault();
					openDrawer();
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						openDrawer();
					}
				}}
				tabIndex={0}
			>
				{label}
			</span>
			<InProductHelpDrawer
				isDrawerOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
				hits={hits}
				indexName={indexName}
				setHits={setHits}
			/>
		</>
	);
};
