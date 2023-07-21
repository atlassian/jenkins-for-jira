import { createHmac, createHash } from 'crypto';

export const createHashWithSharedSecret = (data?: string): string => {
    if (!data) {
        return '';
    }
    const cleanedData = removeNonAlphaNumericCharacters(data);
    // return createHmac('sha256', envVars.GLOBAL_HASH_SECRET)
    // TODO - update
    return createHmac('sha256', 'testsecret')
        .update(cleanedData)
        .digest('hex');
};

export const createHashWithoutSharedSecret = (data: string | null | undefined) => {
    if (!data) {
        return '';
    }

    return createHash('sha256').update(data).digest('hex');
};

const removeNonAlphaNumericCharacters = (str: string): string => {
    return str.replace(/[^\p{L}\p{N}]+/ug, ''); // Tests all unicode characters and only keeps Letters and Numbers
};
