import { generateNewSecret, SECRET_LENGTH } from './generate-new-secret';

describe('generateNewSecret', () => {
    it('should generate a secret of the specified length', async () => {
        const secret = await generateNewSecret();
        expect(secret.length).toBe(SECRET_LENGTH);
    });

    it('should generate a secret containing only valid characters', async () => {
        const secret = await generateNewSecret();
        expect(secret).toMatch(/^[A-Za-z0-9]*$/); // Match against alphanumeric characters only
    });

    it('should generate unique secrets', async () => {
        const secret1 = await generateNewSecret();
        const secret2 = await generateNewSecret();
        expect(secret1).not.toBe(secret2);
    });
});
