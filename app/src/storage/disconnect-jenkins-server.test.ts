import { disconnectJenkinsServer } from './disconnect-jenkins-server';

jest.mock('@forge/api', () => {
	return {
		__getRuntime: jest.fn(),
		storage: {
			delete: jest.fn(),
			deleteSecret: jest.fn()
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

describe('Delete Jenkins Server Suite', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Should delete Jenkins server configuration from Forge Storage', async () => {
		const result = await disconnectJenkinsServer('test-uid', 'cloudId', 'accountId');
		expect(result).toBe(true);
	});
});
