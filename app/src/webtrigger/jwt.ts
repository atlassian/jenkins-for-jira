import jwt, { JwtPayload } from 'jsonwebtoken';
import {
	InvalidPayloadError,
	JwtDecodingFailedError,
	JwtVerificationFailedError
} from '../common/error';
import { Errors } from '../common/error-messages';
import { log } from '../config/logger';

/**
 * Verifies the signature of a JWT.
 * @param jwtToken string representation of the JWT to verify.
 * @param secret the secret which was used to generate the JWT.
 */
export const verifyJwt = (jwtToken: string, secret: string, claims: object) => {
	try {
		jwt.verify(jwtToken, secret, claims);
	} catch (error) {
		log(
			'extractBodyFromJwt',
			'error',
			{
				eventType: 'extractBodyFromJwtEvent',
				errorMsg: `JWT verification failed: ${error}`,
				error
			}
		);

		throw new JwtVerificationFailedError(Errors.JWT_VERIFICATION_FAILED);
	}
};

/**
 * We use the JWT as a wrapper for a request body. This function extracts the request body
 * from the JWT. The request body is expected to be a JSON string.
 * @param jwtToken string representation of the JWT to extract the body from.
 */
export const extractBodyFromJwt = (jwtToken: string): any => {
	const decodedToken = jwt.decode(jwtToken) as JwtPayload;

	if (!decodedToken) {
		throw new InvalidPayloadError('JWT could not be decoded!');
	}

	const bodyAsString = decodedToken.request_body_json;

	try {
		return JSON.parse(bodyAsString);
	} catch (error) {
		log(
			'extractBodyFromJwt',
			'error',
			{
				eventType: 'extractBodyFromJwtEvent',
				errorMsg: `Could not parse payload as JSON: ${bodyAsString} because of: ${error}`,
				error
			}
		);

		throw new JwtDecodingFailedError(Errors.JWT_DECODING_ERROR);
	}
};
