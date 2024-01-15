import React, { useState } from 'react';
import { cx } from '@emotion/css';
import {
	inProductHelpActionButton, inProductHelpActionButtonDefault,
	inProductHelpActionButtonPrimary,
	inProductHelpActionLink
} from './InProductHelp.styles';
import { InProductHelpDrawer } from './InProductHelpDrawer';
import { useAlgolia } from '../../hooks/useAlgolia';
import { Hit } from '../../hooks/old';

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
};
// ...

export const InProductHelpAction = ({
	label,
	type,
	appearance,
	indexName
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

	const { hits: searchResults } = useAlgolia({ indexName });

	const openDrawer = () => {
		setHits(searchResults);
		setIsDrawerOpen(true);
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
			/>
		</>
	);
};
