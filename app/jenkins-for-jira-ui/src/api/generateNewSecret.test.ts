import { invoke } from '@forge/bridge';
import { generateNewSecret } from './generateNewSecret';

describe('generateNewSecret', () => {
	it('should invoke generateNewSecret and return a secret', async (): Promise<void> => {
		await generateNewSecret();
		expect(invoke).toHaveBeenCalledWith('generateNewSecret');
	});
});
