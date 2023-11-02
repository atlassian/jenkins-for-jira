import { isEmpty } from 'lodash';
import { createHash } from 'crypto';
import { decodeSymmetric, getAlgorithm } from 'atlassian-jwt';
import { UrlWithParsedQuery } from 'url';
import { JwtVerificationFailedError } from '../common/error';
import { Errors } from '../common/error-messages';
import { Logger } from '../config/logger';

const CANONICAL_QUERY_SEPARATOR = '&';

export interface JWTRequest extends UrlWithParsedQuery {
	method: string;
	body?: any;
}

export enum TokenType {
	normal = 'normal',
	context = 'context'
}

enum HashAlgorithm {
	HS256 = 'sha256',
	HS384 = 'sha384',
	HS512 = 'sha512',
	RS256 = 'RSA-SHA256'
}

const canonicalizeMethod = (req: JWTRequest) => req.method.toUpperCase();

const encodeRfc3986 = (value: string): string =>
	encodeURIComponent(value)
		.replace(/[!'()]/g, escape)
		.replace(/\*/g, '%2A');

const canonicalizeUri = (req: JWTRequest) => {
	let path = req.pathname;

	if (!path?.length) {
		return '/';
	}

	// If the separator is not URL encoded then the following URLs have the same query-string-hash:
	//   https://djtest9.jira-dev.com/rest/api/2/project&a=b?x=y
	//   https://djtest9.jira-dev.com/rest/api/2/project?a=b&x=y
	path = path.replace(new RegExp(CANONICAL_QUERY_SEPARATOR, 'g'), encodeRfc3986(CANONICAL_QUERY_SEPARATOR));

	// Prefix with /
	if (path[0] !== '/') {
		path = `/${path}`;
	}

	// Remove trailing /
	if (path.length > 1 && path[path.length - 1] === '/') {
		path = path.substring(0, path.length - 1);
	}

	return path;
};

const canonicalizeQueryString = (req: JWTRequest, checkBodyForParams?: boolean): string => {
	// Change Dict to Object
	let query: Record<string, any> = JSON.parse(JSON.stringify(req.query));
	const method = req.method.toUpperCase();

	// Apache HTTP client (or something) sometimes likes to take the query string and put it into the request body
	// if the method is PUT or POST
	if (checkBodyForParams && isEmpty(query) && (method === 'POST' || method === 'PUT')) {
		query = Object.fromEntries(req.body);
	}

	if (isEmpty(query)) {
		return '';
	}

	// Remove the 'jwt' query string param
	delete query.jwt;

	return Object.keys(query)
		.sort()
		.reduce((acc: string[], key) => {
			// The __proto__ field can sometimes sneak in depending on what node version is being used.
			// Get rid of it or the qsh calculation will be wrong.
			acc.push(`${encodeRfc3986(key)}=${[].concat(query[key]).sort().map(encodeRfc3986).join(',')}`);
			return acc;
		}, [])
		.join(CANONICAL_QUERY_SEPARATOR);
};

export const createCanonicalRequest = (req: JWTRequest, checkBodyForParams?: boolean): string =>
	canonicalizeMethod(req) +
	CANONICAL_QUERY_SEPARATOR +
	canonicalizeUri(req) +
	CANONICAL_QUERY_SEPARATOR +
	canonicalizeQueryString(req, checkBodyForParams);

export const createQueryStringHash = (req: JWTRequest, checkBodyForParams?: boolean): string => {
	const request = createCanonicalRequest(req, checkBodyForParams);
	const hash = createHash(HashAlgorithm.HS256)
		.update(request)
		.digest('hex');
	return hash;
};

export const validateJwtClaims = (
	verifiedClaims: { exp: number, aud: string[] | undefined, iat: number, iss: string }
): void => {
	if (!verifiedClaims.aud || verifiedClaims.aud[0] !== 'jenkins-forge-app') {
		throw new Error('Invalid audience');
	}

	if (verifiedClaims.iss !== 'jenkins-plugin') {
		throw new Error('Invalid issuer');
	}

	const currentTimestamp = Math.floor(Date.now() / 1000);
	const leeway = 3;

	if (currentTimestamp < verifiedClaims.iat) {
		throw new Error('JWT issued in the future');
	}

	if (verifiedClaims.exp && currentTimestamp > verifiedClaims.exp + leeway) {
		throw new Error('JWT validation failed, token is expired');
	}
};

export const verifySymmetricJwt = (jwtToken: string, secret: string, logger?: Logger) => {
	try {
		const algorithm = getAlgorithm(jwtToken);
		const decodedToken = decodeSymmetric(jwtToken, secret, algorithm, false);
		validateJwtClaims(decodedToken);
		logger?.debug('JWT verified');
		return decodedToken;
	} catch (error) {
		logger?.error(Errors.JWT_VERIFICATION_FAILED);
		throw new JwtVerificationFailedError(Errors.JWT_VERIFICATION_FAILED);
	}
};

export const extractBodyFromSymmetricJwt = (verifiedJwtToken: { request_body_json: any; }): any => {
	const requestBodyJsonString = verifiedJwtToken.request_body_json;
	const requestBodyObject = JSON.parse(requestBodyJsonString);
	return requestBodyObject;
};
