import React from 'react';
import { cx } from '@emotion/css';
import EditorSuccessIcon from '@atlaskit/icon/glyph/editor/success';
import { copyToClipboard, copyToClipboardContainer } from '../ServerManagement/ServerManagement.styles';

type CopiedToClipboardProps = {
	leftPositionPercent: string
};

const CopiedToClipboard = ({ leftPositionPercent }: CopiedToClipboardProps) => {
	return (
		<div className={cx(copyToClipboardContainer)} style={{ left: leftPositionPercent }}>
			<EditorSuccessIcon
				primaryColor="#23a06b"
				label="Copied to clipboard successfully"
			/>
			<div className={cx(copyToClipboard)}>
				Copied to clipboard
			</div>
		</div>
	);
};

export { CopiedToClipboard };
