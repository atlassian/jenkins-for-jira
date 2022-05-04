import Spinner from '@atlaskit/spinner';
import { cx } from '@emotion/css';
import { spinnerContainerBase } from '../../common/styles/spinner.styles';

type JenkinsSpinnerProps = {
	secondaryClassName?: string;
};

export const JenkinsSpinner = ({
	secondaryClassName
} : JenkinsSpinnerProps): JSX.Element => {
	return (
		<div className={cx(spinnerContainerBase, secondaryClassName)}>
			<Spinner size='large' />
		</div>
	);
};
