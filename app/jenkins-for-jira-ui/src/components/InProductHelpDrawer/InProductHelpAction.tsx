import React, { useState } from 'react';
import { cx } from '@emotion/css';
import Button, { Appearance } from '@atlaskit/button';
import { inProductHelpActionLink } from './InProductHelp.styles';
import { InProductHelpDrawer } from './InProductHelpDrawer';
import useAlgolia, { Hit } from '../../hooks/useAlgolia';

export enum InProductHelpActionType {
	HelpLink = 'link',
	HelpButton = 'button'
}

type InProductHelpActionProps = {
	label: string,
	type: InProductHelpActionType,
	appearance: Appearance,
	indexName: string
};

export const InProductHelpAction = ({
	label,
	type,
	appearance,
	indexName
}: InProductHelpActionProps): JSX.Element => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [hits, setHits] = useState<Hit[]>([]);
	const inProductHelpTypeClassName =
		type === InProductHelpActionType.HelpLink ? inProductHelpActionLink : '';

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	const handleSearch = async () => {
		try {
			const { hits: searchResults } = await useAlgolia({ indexName });
			setHits(searchResults);
			setIsDrawerOpen(true);
		} catch (error) {
			console.error('Error searching Algolia index:', error);
		}
	};

	return (
		<>
			<Button
				className={cx(inProductHelpTypeClassName)}
				onClick={(e) => {
					e.preventDefault();
					handleSearch().then(() => {
						openDrawer();
					});
				}}
				appearance={appearance}
			>
				{label}
			</Button>
			<InProductHelpDrawer
				isDrawerOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
				hits={hits}
				indexName={indexName}
			/>
		</>
	);
};
