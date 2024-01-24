import React, { useCallback, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import Drawer from '@atlaskit/drawer';
import { cx } from '@emotion/css';
import Spinner from '@atlaskit/spinner';
import { router } from '@forge/bridge';
import Button from '@atlaskit/button/standard-button';
import { loadingContainer } from '../JenkinsSetup/JenkinsSetup.styles';
import { inProductHelpDrawerContainer, inProductHelpDrawerTitle } from './InProductHelp.styles';
import { getIdForLinkInIphDrawer } from './InProductHelpIds';
import {
	HELP_LINK,
	SET_UP_JENKINS_CONNECT_TO_JIRA_TEXT,
	HERE,
	SHARE_GUIDE_WITH_PROJECT_TEAMS, HOW_TO_FIND_OUT
} from '../../common/constants';

const openUrlInNewTab = () => {
	const url = HELP_LINK;
	router.open(url);
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

const InProductHelpDrawerError = () => {
	return (
		<>
			<InProductHelpDrawerError />
			<h4>Content not found</h4>
			<p>Something went wrong, the content that you’re looking for isn’t here. </p>
			<Button appearance="primary">Try again</Button>
		</>
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
	setHasError(hasError: boolean): void
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
	setHasError
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

	const {
		tempDiv: tempDivBody
	} = (!isLoading && replaceAnchorsWithSpanElement(results[0].body)) as {
		tempDiv: HTMLDivElement;
	};

	const {
		tempDiv: tempDivBodyText
	} = (!isLoading && replaceAnchorsWithSpanElement(results[0].bodyText)) as {
		tempDiv: HTMLDivElement;
	};

	const search = useCallback(async (searchId: string) => {
		setIsLoading(true);
		setHasError(false);

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
			setHasError(true);
		} catch (e) {
			console.error('Error searching Algolia index:', e);
			setIsLoading(false);
		}
	}, [index, setSearchResults, innerSearchQuery, setIsLoading, setHasError]);

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

	let iphContentToRender;

	if (isLoading) {
		iphContentToRender = (
			<div className={cx(loadingContainer)} data-testid="loading-spinner">
				<Spinner size="large" />
			</div>
		);
	} else if (hasError) {
		iphContentToRender = (
			<div className={cx(inProductHelpDrawerContainer)}>
				<InProductHelpDrawerError />
			</div>
		);
	} else {
		iphContentToRender = (
			<div className={cx(inProductHelpDrawerContainer)}>
				{results.length ? (
					<>
						<h3 className={cx(inProductHelpDrawerTitle)}>{results[0].title}</h3>
						<div
							dangerouslySetInnerHTML={{
								__html: tempDivBody.innerHTML || tempDivBodyText.innerHTML || ''
							}}
						/>
					</>
				) : (
					<></>
				)}
			</div>
		);
	}

	return (
		<Drawer onClose={closeDrawer} isOpen={isDrawerOpen} width="wide" label="Basic drawer">
			{iphContentToRender}
		</Drawer>
	);
};
