import crypto from 'crypto';

export const SECRET_LENGTH = 20;

export const generateSecret = (): string => {
    const randomBytes = crypto.randomBytes(SECRET_LENGTH);

    // Convert the random bytes to a base64-encoded string,
    // and then remove characters (+, /, and =) that might
    // be undesirable or problematic in certain contexts.
    // After that, truncate the string to the desired length.
    return randomBytes
        .toString('base64')
        .replace(/[+/=]/g, '')
        .substring(0, SECRET_LENGTH);
};
