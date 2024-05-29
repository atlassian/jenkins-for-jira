import React, { useCallback, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import Drawer from '@atlaskit/drawer';
import { cx } from '@emotion/css';
import Spinner from '@atlaskit/spinner';
import { router } from '@forge/bridge';
import Button from '@atlaskit/button/standard-button';
import {
	inProductHelpDrawerContainer,
	inProductHelpDrawerErrorContainer,
	inProductHelpDrawerErrorContent,
	inProductHelpDrawerErrorIcon,
	inProductHelpDrawerErrorTitle,
	inProductHelpDrawerTitle,
	iphLoadingContainer
} from './InProductHelp.styles';
import { getIdForLinkInIphDrawer } from './InProductHelpIds';
import {
	HELP_LINK,
	SET_UP_JENKINS_CONNECT_TO_JIRA_TEXT,
	HERE,
	SHARE_GUIDE_WITH_PROJECT_TEAMS,
	HOW_TO_FIND_OUT,
	SET_UP_GUIDE_SCREEN_NAME,
	CONNECTION_WIZARD_SCREEN_NAME,
	JENKINS_SETUP_SCREEN_NAME
} from '../../common/constants';
import { InProductHelpDrawerErrorIcon } from '../icons/InProductHelpDrawerErrorIcon';
import {
	AnalyticsEventTypes, AnalyticsScreenEventsEnum,
	AnalyticsTrackEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';

const analyticsClient = new AnalyticsClient();

const openUrlInNewTab = () => {
	const url = HELP_LINK;
	router.open(url);
};

export const iphClickSource = (screenName?: string): string => {
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

const addAttributesToSpanElement =
	(linkSpan: HTMLSpanElement, anchorTag: HTMLAnchorElement, anchorMap: { link?: string }) => {
		linkSpan.className = 'iph-link';
		linkSpan.style.color = '#0C66E4';
		linkSpan.style.cursor = 'pointer';
		linkSpan.innerHTML = anchorTag.innerText;
		linkSpan.tabIndex = 0;
		linkSpan.role = 'link';
		anchorMap.link = anchorTag.href;
	};

const replaceAnchorsWithSpanElement = (content: string) => {
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = DOMPurify.sanitize(content);

	const anchorMap: { link?: string } = {};
	const anchorTags = tempDiv.getElementsByTagName('a');

	Array.from(anchorTags).forEach((anchorTag: HTMLAnchorElement) => {
		const linkSpan = document.createElement('span');
		addAttributesToSpanElement(linkSpan, anchorTag, anchorMap);
		anchorTag.parentNode?.replaceChild(linkSpan, anchorTag);
	});

	return { tempDiv, anchorMap };
};

type InProductHelpDrawerErrorProps = {
	onClick(): void
};

const InProductHelpDrawerError = ({ onClick }: InProductHelpDrawerErrorProps) => {
	return (
		<div className={cx(inProductHelpDrawerErrorContainer)}>
			<InProductHelpDrawerErrorIcon className={inProductHelpDrawerErrorIcon} />
			<h4 className={cx(inProductHelpDrawerErrorTitle)}>Content not found</h4>
			<p className={cx(inProductHelpDrawerErrorContent)}>
				Something went wrong, the content that you’re looking for isn’t here.
			</p>
			<Button appearance="primary" onClick={onClick}>Try again</Button>
		</div>
	);
};

export type Hit = {
	id: string,
	body?: string,
	bodyText?: string,
	objectID: string,
	title: string
};

export type InProductHelpDrawerProps = {
	isDrawerOpen: boolean,
	setIsDrawerOpen(isDrawerOpen: boolean): void,
	searchResults: any,
	isLoading: boolean,
	searchQuery: string,
	setIsLoading(isLoading: boolean): void,
	setSearchResults(hits: Hit[]): void,
	index: {
		search<T>(query: string): Promise<{ hits: T[] }>
	},
	hasError: boolean,
	setHasError(hasError: boolean): void,
	screenName?: string,
	label?: string
};

export const InProductHelpDrawer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	searchResults,
	isLoading,
	searchQuery,
	setIsLoading,
	setSearchResults,
	index,
	hasError,
	setHasError,
	screenName,
	label
}: InProductHelpDrawerProps): JSX.Element => {
	const [innerSearchQuery, setInnerSearchQuery] = useState<string>('');
	const closeDrawer = (e: React.SyntheticEvent<HTMLElement, Event>) => {
		e.preventDefault();
		const target = e.target as HTMLElement;

		if (innerSearchQuery && target.role !== 'presentation') {
			setInnerSearchQuery('');
			search(searchQuery);
		} else {
			setIsDrawerOpen(false);
		}
	};

	const results = Array.isArray(searchResults) ? searchResults : searchResults.hits;
	let tempDivBody: HTMLDivElement | undefined;
	let tempDivBodyText: HTMLDivElement | undefined;
	if (results.length !== 2) {
		setHasError(true);
	} else {
		setHasError(false);
		const { tempDiv: tempDivB } = (!isLoading && !hasError && replaceAnchorsWithSpanElement(results[1]?.body)) as {
			tempDiv: HTMLDivElement;
		};
		tempDivBody = tempDivB;
		const { tempDiv: tempDivBT } = (
			!isLoading && !hasError && replaceAnchorsWithSpanElement(results[1]?.bodyText)) as {
			tempDiv: HTMLDivElement;
		};
		tempDivBodyText = tempDivBT;
	}

	const search = useCallback(async (searchId: string) => {
		setIsLoading(true);
		setHasError(false);

		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.OpenInProductionHelpDrawerName,
			{
				source: iphClickSource(screenName) || '',
				action: `clicked - ${AnalyticsUiEventsEnum.OpenInProductionHelpDrawerName}`,
				actionSubject: 'link',
				elementName: label,
				iphLocation: 'drawer'
			}
		);

		if (innerSearchQuery && innerSearchQuery.trim() === '') {
			setSearchResults([]);
			return;
		}

		try {
			const subsequentResults = await index.search<Hit>(searchId);
			const hitsData: Hit[] = subsequentResults.hits.map((hit: Hit) => ({
				id: hit.objectID,
				objectID: hit.objectID,
				title: hit.title,
				body: hit.body || '',
				bodyText: hit.bodyText || ''
			}));

			setSearchResults(hitsData);
			setIsLoading(false);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.InProductHelpRequestSuccessName,
				{
					action: `submitted ${AnalyticsTrackEventsEnum.InProductHelpRequestSuccessName}`,
					actionSubject: 'form'
				}
			);
		} catch (e) {
			console.error('Error searching Algolia index:', e);
			setIsLoading(false);
			setHasError(true);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.InProductHelpRequestFailureName,
				{
					action: `submitted ${AnalyticsTrackEventsEnum.InProductHelpRequestFailureName}`,
					actionSubject: 'form'
				}
			);
		}
	}, [index, setSearchResults, innerSearchQuery, setIsLoading, setHasError, label, screenName]);

	useEffect(() => {
		const containers = document.getElementsByClassName('iph-link');

		Array.from(containers).forEach((container) => {
			if (container instanceof HTMLElement) {
				container.addEventListener('click', (e) => {
					const clickedElement = e.target as HTMLElement;
					const linkText = clickedElement.innerHTML.toLowerCase();

					const openSupportUrl = linkText === SET_UP_JENKINS_CONNECT_TO_JIRA_TEXT ||
						linkText === HERE ||
						linkText === SHARE_GUIDE_WITH_PROJECT_TEAMS ||
						linkText === HOW_TO_FIND_OUT;

					if (openSupportUrl) {
						setIsDrawerOpen(false);
						openUrlInNewTab();
					} else {
						e.preventDefault();
						const iphDrawerLinkId = getIdForLinkInIphDrawer(linkText);
						setInnerSearchQuery(iphDrawerLinkId);
						search(iphDrawerLinkId);
					}
				});
			}
		});
	}, [search, setIsDrawerOpen]);

	if (isLoading) {
		return (
			<Drawer onClose={closeDrawer} isOpen={isDrawerOpen} width="wide" label="Basic drawer">
				<div className={cx(iphLoadingContainer)} data-testid="loading-spinner">
					<Spinner size="large" />
				</div>
			</Drawer>
		);
	}

	return (
		<>
			<Drawer onClose={closeDrawer} isOpen={isDrawerOpen} width="wide" label="Basic drawer">
				{
					hasError
						? <InProductHelpDrawerError onClick={() => search(searchQuery || innerSearchQuery)} />
						: <div className={cx(inProductHelpDrawerContainer)}>
							<h3 className={cx(inProductHelpDrawerTitle)}>{results[1]?.title}</h3>
							<div
								dangerouslySetInnerHTML={{
									__html: tempDivBody?.innerHTML || tempDivBodyText?.innerHTML || ''
								}}
							/>
						</div>
				}
			</Drawer>
		</>
	);
};
