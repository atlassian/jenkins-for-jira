import React, { useState } from 'react';
import { cx } from '@emotion/css';
import Button, { Appearance } from '@atlaskit/button';
import { inProductHelpActionLink } from './InProductHelp.styles';
import { InProductHelpDrawer } from './InProductHelpDrawer';

export enum InProductHelpActionType {
	HelpLink = 'link',
	HelpButton = 'button'
}

type InProductHelpActionProps = {
	label: string,
	type: InProductHelpActionType,
	appearance: Appearance
};

export const InProductHelpAction = ({
	label,
	type,
	appearance
}: InProductHelpActionProps): JSX.Element => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const inProductHelpTypeClassName =
		type === InProductHelpActionType.HelpLink ? inProductHelpActionLink : '';

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	return (
		<>
			<Button
				className={cx(inProductHelpTypeClassName)}
				onClick={(e) => {
					e.preventDefault();
					openDrawer();
				}}
				appearance={appearance}
			>
				{label}
			</Button>
			<InProductHelpDrawer
				isDrawerOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
			/>
		</>
	);
};
