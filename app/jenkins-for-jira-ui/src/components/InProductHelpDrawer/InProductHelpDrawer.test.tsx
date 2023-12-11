import React from 'react';
import { render } from '@testing-library/react';
import { InProductHelpAction, InProductHelpActionType } from './InProductHelpAction';

describe('InProductHelpAction', () => {
	test('renders InProductHelpAction with label', () => {
		const { getByText } = render(
			<InProductHelpAction
				label="build"
				type={InProductHelpActionType.HelpButton}
				appearance="primary"
				indexName="some name"
			/>
		);

		expect(getByText('build')).toBeInTheDocument();
	});
});
