import { generateSecret, SECRET_LENGTH } from './generate-secret';

describe('generateSecret', () => {
    it('should generate a secret of the specified length', () => {
        const secret = generateSecret();
        expect(secret.length).toBe(SECRET_LENGTH);
    });

    it('should generate a secret containing only valid characters', () => {
        const secret = generateSecret();
        expect(secret).toMatch(/^[A-Za-z0-9]*$/); // Match against alphanumeric characters only
    });

    it('should generate unique secrets', () => {
        const secret1 = generateSecret();
        const secret2 = generateSecret();
        expect(secret1).not.toBe(secret2);
    });
});
