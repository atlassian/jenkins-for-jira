import React from 'react';
import { render } from '@testing-library/react';
import { InProductHelpAction, InProductHelpActionType } from './InProductHelpAction';

describe('InProductHelpAction', () => {
	const onClickMock = jest.fn();

	test('renders InProductHelpAction with label', () => {
		const { getByText } = render(
			<InProductHelpAction onClick={onClickMock} label="build" type={InProductHelpActionType.HelpButton} appearance="primary" />
		);

		expect(getByText('build')).toBeInTheDocument();
	});
});
