import React from 'react';
import { cx } from '@emotion/css';
import EditorSuccessIcon from '@atlaskit/icon/glyph/editor/success';
import { copyToClipboard, copyToClipboardContainer } from '../ServerManagement/ServerManagement.styles';

const CopiedToClipboard = () => {
	return (
		<div className={cx(copyToClipboardContainer)}>
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
