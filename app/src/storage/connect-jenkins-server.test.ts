import { JenkinsServer } from '../common/types';
import { connectJenkinsServer } from './connect-jenkins-server';

jest.mock('@forge/api', () => {
	return {
		__getRuntime: jest.fn(),
		storage: {
			set: jest.fn(),
			setSecret: jest.fn()
		}
	};
});

jest.mock('@forge/metrics', () => {
	const incr = jest.fn();
	const counter = jest.fn(() => ({ incr }));

	return {
		__esModule: true,
		default: {
			internalMetrics: {
				counter
			}
		},
		internalMetrics: {
			counter
		}
	};
});

describe('Connect Jenkins Server Suite', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Should store Jenkins server configuration to Forge Storage', async () => {
		const jenkinsServer: JenkinsServer = {
			name: 'test-jenkins-server',
			uuid: 'unique-uid',
			secret: 'secret!!!',
			pipelines: []
		};
		const result = await connectJenkinsServer(jenkinsServer, 'cloudId', 'accountId');
		expect(result).toBeTruthy();
	});
});
