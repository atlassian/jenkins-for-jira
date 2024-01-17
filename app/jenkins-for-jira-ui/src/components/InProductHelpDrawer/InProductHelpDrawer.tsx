import React, { useEffect, useState } from 'react';
import Drawer from '@atlaskit/drawer';
import { Hit, SearchState, useAlgolia } from '../../hooks/useAlgolia';

export type InProductHelpDrawerProps = {
	isDrawerOpen: boolean,
	setIsDrawerOpen(isDrawerOpen: boolean): void,
	hits: Hit[],
	searchQuery: string,
	setHits(hits: Hit[]): void
};

export const InProductHelpDrawer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	hits,
	searchQuery,
	setHits
}: InProductHelpDrawerProps): JSX.Element => {
	const [searchState, setSearchState] = useState<SearchState>({
		query: searchQuery,
		hits: []
	});

	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	const { hits: searchResults } = useAlgolia({ searchState, setSearchState });

	useEffect(() => {
		setHits(searchResults);
	});

	console.log(hits);

	return (
		<Drawer
			onClose={closeDrawer}
			isOpen={isDrawerOpen}
			width="wide"
			label="Basic drawer"
		>
			<div>Add content here for each link item {searchQuery}</div>
		</Drawer>
	);
};
