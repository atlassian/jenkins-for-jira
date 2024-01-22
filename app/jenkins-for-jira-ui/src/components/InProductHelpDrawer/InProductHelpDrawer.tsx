import React from 'react';
import DOMPurify from 'dompurify';
import Drawer from '@atlaskit/drawer';
import { cx } from '@emotion/css';
import Spinner from '@atlaskit/spinner';
import { router } from '@forge/bridge';
// import ReactDOM from 'react-dom';
import { loadingContainer } from '../JenkinsSetup/JenkinsSetup.styles';
import { inProductHelpDrawerContainer, inProductHelpDrawerTitle } from './InProductHelp.styles';

// const LinkSpan = ({ linkText, linkUrl }: { linkText: string; linkUrl: string }) => {
// 	const handleClick = (e: React.MouseEvent) => {
// 		console.log('clicking...');
// 		e.preventDefault();
// 		router.open(linkUrl);
// 	};
//
// 	const handleKeyDown = (e: React.KeyboardEvent) => {
// 		if (e.key === 'Enter') {a
// 			console.log('pressing Enter...');
// 			e.preventDefault();
// 			router.open(linkUrl);
// 		}
// 	};
//
// 	return (
// 		<span
// 			role="link"
// 			tabIndex={0}
// 			style={{ cursor: 'pointer', textDecoration: 'underline' }}
// 			onClick={handleClick}
// 			onKeyDown={handleKeyDown}
// 		>
// 			{linkText}
// 		</span>
// 	);
// };

const replaceAnchorsWithButtons = (content: string) => {
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = DOMPurify.sanitize(content);

	const anchorTags = tempDiv.getElementsByTagName('a');

	Array.from(anchorTags).forEach((anchorTag: HTMLAnchorElement) => {
		const linkSpan = document.createElement('span');
		const uniqueId = `button-${Math.random().toString(36).substring(7)}`;
		linkSpan.id = uniqueId;
		linkSpan.style.color = '#0C66E4';
		linkSpan.style.cursor = 'pointer';
		linkSpan.innerHTML = anchorTag.innerText;
		linkSpan.tabIndex = 0;
		anchorTag.parentNode?.replaceChild(linkSpan, anchorTag);

		// Use event delegation to handle the click event
		linkSpan.addEventListener('click', (e) => {
			if (e.target instanceof Element && e.target.id === uniqueId) {
				console.log('clicking...');
				e.preventDefault();
				router.open(anchorTag.href);
			}
		});
	});

	return tempDiv.innerHTML;
};

export type Hit = {
	id: string;
	body?: string;
	bodyText?: string;
	objectID: string;
	title: string;
};

export type InProductHelpDrawerProps = {
	isDrawerOpen: boolean;
	setIsDrawerOpen(isDrawerOpen: boolean): void;
	searchResults: any;
	isLoading: boolean;
};

export const InProductHelpDrawer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	searchResults,
	isLoading
}: InProductHelpDrawerProps): JSX.Element => {
	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	const results = Array.isArray(searchResults) ? searchResults : searchResults.hits;
	const body = !isLoading && replaceAnchorsWithButtons(results[0].body);
	const bodyText = !isLoading && replaceAnchorsWithButtons(results[0].bodyText);

	return (
		<Drawer onClose={closeDrawer} isOpen={isDrawerOpen} width="wide" label="Basic drawer">
			{isLoading ? (
				<div className={cx(loadingContainer)} data-testid="loading-spinner">
					<Spinner size="large" />
				</div>
			) : (
				<div className={cx(inProductHelpDrawerContainer)}>
					{results.length ? (
						<>
							<h3 className={cx(inProductHelpDrawerTitle)}>{results[0].title}</h3>
							<div
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(body || bodyText || '')
								}}
							/>
						</>
					) : (
						<></>
					)}
				</div>
			)}
		</Drawer>
	);
};
