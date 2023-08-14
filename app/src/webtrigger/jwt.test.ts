import * as jwtModule from './jwt';
import { Logger } from '../config/logger';

jest.mock('../config/logger', () => ({
	Logger: {
		getInstance: jest.fn(() => ({
			logDebug: jest.fn(),
			logError: jest.fn()
		}))
	}
}));

jest.mock('atlassian-jwt', () => ({
	...jest.requireActual('atlassian-jwt'),
	getAlgorithm: jest.fn(() => 'HS256'),
	decodeSymmetric: jest.fn(() => {
		// Calculate the timestamp 2 seconds in the past
		const now = Date.now() / 1000; // Convert milliseconds to seconds
		const iat = now - 2; // Subtract 2 seconds

		// Mock verified claims data with the updated iat
		const verifiedClaims = {
			exp: now + 3600,
			aud: ['jenkins-forge-app'],
			iat,
			iss: 'jenkins-plugin',
			request_body_json: JSON.stringify({ requestType: 'ping' }),
		};

		return verifiedClaims;
	})
}));

describe('JWT', () => {
	const mockVerifiedClaims = {
		exp: Math.floor(Date.now() / 1000) + 3600,
		aud: ['jenkins-forge-app'],
		iat: Math.floor(Date.now() / 1000) - 3600,
		iss: 'jenkins-plugin',
		request_body_json: JSON.stringify({ requestType: 'ping' })
	};

	const mockJwtToken = 'test-token';
	const mockSecret = 'mock-secret';

	it('should validate JWT claims', () => {
		expect(() => jwtModule.validateJwtClaims(mockVerifiedClaims)).not.toThrow();
	});

	it('should throw error for invalid audience', () => {
		const invalidClaims = { ...mockVerifiedClaims, aud: undefined };
		expect(() => jwtModule.validateJwtClaims(invalidClaims)).toThrow('Invalid audience');
	});

	it('should extract body from symmetric JWT', () => {
		const mockVerifiedJwtToken = { request_body_json: JSON.stringify({ requestType: 'ping' }) };
		expect(jwtModule.extractBodyFromSymmetricJwt(mockVerifiedJwtToken)).toEqual({ requestType: 'ping' });
	});

	it('should create canonical request', () => {
		const mockReq: any = {
			method: 'GET',
			pathname: '/some/path',
			query: { param1: 'value1', param2: 'value2' }
		};

		const canonicalRequest = jwtModule.createCanonicalRequest(mockReq);
		expect(canonicalRequest).toBe('GET&/some/path&param1=value1&param2=value2');
	});

	it('should verify symmetric JWT', () => {
		// Mock the Logger methods
		const mockLogger = Logger.getInstance('test');
		mockLogger.logDebug = jest.fn();

		// Call the function under test
		const verifiedBody = jwtModule.verifySymmetricJwt(mockJwtToken, mockSecret, mockLogger);

		// Assertions
		expect(verifiedBody).toEqual({ requestType: 'ping' });

		// Verify logger calls
		expect(mockLogger.logDebug).toHaveBeenCalledWith({
			eventType: 'verifySymmetricJwt',
			message: 'JWT verified',
		});
	});
});
