import * as jwtModule from './jwt';
import { Logger } from '../config/logger';

jest.mock('../config/logger', () => ({
	Logger: {
		getInstance: jest.fn(() => ({
			debug: jest.fn(),
			error: jest.fn()
		}))
	}
}));

const currentTimestamp = Date.now();

// Mock Date.now() implementation
jest.spyOn(global.Date, 'now').mockReturnValue(currentTimestamp);

const mockVerifiedClaims = {
	exp: currentTimestamp + 3600,
	aud: ['jenkins-forge-app'],
	iat: Math.floor(currentTimestamp / 1000),
	iss: 'jenkins-plugin',
	request_body_json: JSON.stringify({ requestType: 'ping' })
};

jest.mock('atlassian-jwt', () => ({
	...jest.requireActual('atlassian-jwt'),
	getAlgorithm: jest.fn(() => 'HS256'),
	decodeSymmetric: jest.fn(() => {
		return mockVerifiedClaims;
	})
}));

describe('JWT', () => {
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
		const mockLogger = Logger.getInstance('test');
		mockLogger.debug = jest.fn();
		const verifiedBody = jwtModule.verifySymmetricJwt(mockJwtToken, mockSecret, mockLogger);
		expect(verifiedBody).toEqual(mockVerifiedClaims);
		expect(mockLogger.debug).toHaveBeenCalledWith('JWT verified');
	});
});
