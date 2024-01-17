import React, { useCallback, useState } from 'react';
import { cx } from '@emotion/css';
import algoliasearch from 'algoliasearch';
import {
	inProductHelpActionButton, inProductHelpActionButtonDefault,
	inProductHelpActionButtonPrimary,
	inProductHelpActionLink
} from './InProductHelp.styles';
import {Hit, InProductHelpDrawer, SearchState} from './InProductHelpDrawer';
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
import envVars from '../../common/env';

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
	searchQuery: string
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

const ALGOLIA_APP_ID = '8K6J5OJIQW';
const { ALGOLIA_API_KEY } = envVars;

export const InProductHelpAction = ({
	label,
	type,
	appearance,
	searchQuery,
	screenName
}: InProductHelpActionProps): JSX.Element => {
	const [searchState, setSearchState] = useState<SearchState>({
		query: searchQuery,
		hits: []
	});
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
		await search();

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

	const indexName = 'product_help_dev';
	const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
	const index = algoliaClient.initIndex(indexName);

	const search = useCallback(async () => {
		if (searchState.query.trim() === '') {
			setSearchState({ ...searchState, hits: [] });
			return;
		}

		try {
			const results = await index.search<Hit>('fkXjwybosO2ev4g5lLsZw');
			console.log('Algolia results:', results, searchState.query); // Log Algolia results
			setSearchState(results);
		} catch (e) {
			console.error('Error searching Algolia index:', e);
		}
	}, [index, searchState, setSearchState]);

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
			{
				isDrawerOpen &&
					<InProductHelpDrawer
						isDrawerOpen={isDrawerOpen}
						setIsDrawerOpen={setIsDrawerOpen}
						hits={hits}
					/>
			}
		</>
	);
};
