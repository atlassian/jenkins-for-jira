import React from 'react';
import ReactDOM from 'react-dom';
import WrappedApp from './App';

import '@atlaskit/css-reset';

ReactDOM.render(
	<React.StrictMode>
		<WrappedApp />
	</React.StrictMode>,
	document.getElementById('root')
);
