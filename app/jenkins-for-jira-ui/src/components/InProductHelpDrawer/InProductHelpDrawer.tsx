import React, { useEffect, useState } from 'react';
import Drawer from '@atlaskit/drawer';
import { Hit, SearchState, useAlgolia } from '../../hooks/useAlgolia';

export type InProductHelpDrawerProps = {
	isDrawerOpen: boolean,
	setIsDrawerOpen(isDrawerOpen: boolean): void,
	hits: Hit[],
	indexName: string,
	setHits(hits: Hit[]): void
};

export const InProductHelpDrawer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	hits,
	indexName,
	setHits
}: InProductHelpDrawerProps): JSX.Element => {
	const [searchState, setSearchState] = useState<SearchState>({
		query: 'product_help_dev',
		hits: []
	});

	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	const { hits: searchResults } = useAlgolia({ indexName, searchState, setSearchState });

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
			<div>Add content here for each link item {indexName}</div>
		</Drawer>
	);
};
