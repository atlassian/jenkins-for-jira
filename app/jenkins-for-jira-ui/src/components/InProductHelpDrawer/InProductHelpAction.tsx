import React, { useCallback, useState } from 'react';
import { cx } from '@emotion/css';
import algoliasearch from 'algoliasearch';
import {
	inProductHelpActionButton, inProductHelpActionButtonDefault,
	inProductHelpActionButtonPrimary,
	inProductHelpActionLink
} from './InProductHelp.styles';
import { Hit, InProductHelpDrawer } from './InProductHelpDrawer';
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
const { ALGOLIA_API_KEY, ENVIRONMENT } = envVars;

enum AlgoliaEnvironmentIndicies {
	Development = 'product_help_dev',
	Staging = 'product_help_stg',
	Production = 'product_help_prod'
}

const getIndexNameForEnvironment = (): string => {
	if (ENVIRONMENT === 'staging') {
		return AlgoliaEnvironmentIndicies.Staging;
	}

	if (ENVIRONMENT === 'production') {
		return AlgoliaEnvironmentIndicies.Production;
	}

	return AlgoliaEnvironmentIndicies.Development;
};

export const InProductHelpAction = ({
	label,
	type,
	appearance,
	searchQuery,
	screenName
}: InProductHelpActionProps): JSX.Element => {
	const [isLoading, setIsLoading] = useState(false);
	const [searchResults, setSearchResults] = useState<Hit[]>([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [hasError, setHasError] = useState(false);

	const inProductHelpTypeClassName =
		type === InProductHelpActionType.HelpLink
			? inProductHelpActionLink
			: inProductHelpActionButton;
	const actionRole = InProductHelpActionType.HelpLink ? 'link' : 'button';
	const inProductHelpButtonStyles =
		appearance === InProductHelpActionButtonAppearance.Primary
			? inProductHelpActionButtonPrimary
			: inProductHelpActionButtonDefault;

	const openDrawer = async () => {
		setIsDrawerOpen(true);
		await search();

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.OpenInProductionHelpDrawerName,
			{
				source: iphClickSource(screenName) || '',
				action: `clicked - ${AnalyticsUiEventsEnum.OpenInProductionHelpDrawerName}`,
				actionSubject: actionRole,
				elementName: label
			}
		);
	};

	const indexName = getIndexNameForEnvironment();
	const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
	const index = algoliaClient.initIndex(indexName);

	const search = useCallback(async () => {
		setIsLoading(true);
		setHasError(false);

		if (searchQuery && searchQuery.trim() === '') {
			setSearchResults([]);
			return;
		}

		try {
			const results = await index.search<Hit>(searchQuery);
			const hitsData: Hit[] = results.hits.map((hit) => ({
				id: hit.objectID,
				objectID: hit.objectID,
				title: hit.title,
				body: hit.body || '',
				bodyText: hit.bodyText || ''
			}));

			setSearchResults(hitsData);
			setIsLoading(false);
		} catch (e) {
			console.error('Error searching Algolia index:', e);
			setIsLoading(false);
			setHasError(true);
		}
	}, [index, setSearchResults, searchQuery]);

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
						searchResults={searchResults}
						isLoading={isLoading}
						searchQuery={searchQuery}
						setIsLoading={setIsLoading}
						setSearchResults={setSearchResults}
						index={index}
						hasError={hasError}
						setHasError={setHasError}
					/>
			}
		</>
	);
};
