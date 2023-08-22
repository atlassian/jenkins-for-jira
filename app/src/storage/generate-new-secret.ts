import crypto from 'crypto';
import { Logger } from '../config/logger';

export const SECRET_LENGTH = 20;

async function generateNewSecret(): Promise<string> {
    const eventType = 'generateNewSecretEvent';
    const logger = Logger.getInstance('generateNewSecret');

    try {
        logger.logInfo({ eventType });

        const randomBytes = crypto.randomBytes(SECRET_LENGTH);

        // Convert the random bytes to a base64-encoded string,
        // and then remove characters (+, /, and =) that might
        // be undesirable or problematic in certain contexts.
        // After that, truncate the string to the desired length.
        return randomBytes
            .toString('base64')
            .replace(/[+/=]/g, '')
            .substring(0, SECRET_LENGTH);
    } catch (error) {
        logger.logError(
            {
                eventType,
                errorMsg: 'Failed to generate new secret',
                error
            }
        );
        throw error;
    }
}

export { generateNewSecret };
