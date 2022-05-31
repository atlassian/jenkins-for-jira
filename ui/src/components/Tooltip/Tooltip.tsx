import { ReactNode } from 'react';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { StyledTooltip } from './Tooltip.styles';

type FormTooltipProps = {
	content: ReactNode;
	label: string;
};

export const FormTooltip = ({
	content,
	label
}: FormTooltipProps): JSX.Element => {
	return (
		<Tooltip content={content} position="right" component={StyledTooltip}>
			{(tooltipProps) => (
				<Button
					aria-label={label}
					iconBefore={<QuestionCircleIcon label={label} size="medium" />}
					{...tooltipProps}
				/>
			)}
		</Tooltip>
	);
};
