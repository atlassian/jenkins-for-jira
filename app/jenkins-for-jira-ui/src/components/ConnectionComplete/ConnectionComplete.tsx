import React from 'react';

type ConnectionCompleteProps = {
	isJenkinsAdmin?: boolean
};

const ConnectionComplete = ({ isJenkinsAdmin }: ConnectionCompleteProps) => {
	return (
		<>
			{isJenkinsAdmin
				? <div>view for jenkins admin</div>
				: <div>view for non jenkins admin</div>
			}
		</>
	);
};

export { ConnectionComplete };
