import React from 'react';
import { render } from '@testing-library/react';
import { InProductHelpAction, InProductHelpActionType } from './InProductHelpAction';

describe('InProductHelpAction', () => {
	const onClickMock = jest.fn();

	test('renders InProductHelpAction with label', () => {
		const { getByText } = render(
			<InProductHelpAction
				handleOpenDrawer={onClickMock}
				label="build"
				type={InProductHelpActionType.HelpButton}
				appearance="primary"
				indexName="test-iph"
			/>
		);

		expect(getByText('build')).toBeInTheDocument();
	});
});
