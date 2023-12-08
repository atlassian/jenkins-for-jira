import React from 'react';
import { cx } from '@emotion/css';
import Button, { Appearance } from '@atlaskit/button';
import { KeyboardOrMouseEvent } from '@atlaskit/modal-dialog';
import { inProductHelpActionLink } from './InProductHelp.styles';

export enum InProductHelpActionType {
	HelpLink = 'link',
	HelpButton = 'button'
}

type InProductHelpActionProps = {
	onClick(e: KeyboardOrMouseEvent): void,
	label: string,
	type: InProductHelpActionType,
	appearance: Appearance
};

export const InProductHelpAction = ({
	onClick,
	label,
	type,
	appearance
}: InProductHelpActionProps): JSX.Element => {
	const inProductHelpTypeClassName =
		type === InProductHelpActionType.HelpLink ? inProductHelpActionLink : '';

	return (
		<Button
			className={cx(inProductHelpTypeClassName)}
			onClick={onClick}
			appearance={appearance}
		>
			{label}
		</Button>
	);
};
