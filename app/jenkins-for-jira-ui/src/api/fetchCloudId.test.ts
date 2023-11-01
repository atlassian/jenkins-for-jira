import { invoke } from '@forge/bridge';
import { fetchCloudId } from './fetchCloudId';

describe('fetchCloudId', (): void => {
	it('should invoke fetchCloudId', async (): Promise<void> => {
		await fetchCloudId();
		expect(invoke).toHaveBeenCalledWith('fetchCloudId');
	});
});
