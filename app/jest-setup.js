jest.mock('@forge/api', () => ({
	storage: {
		get: mockStorageGetApi,
		set: jest.fn(),
		setSecret: jest.fn(),
		getSecret: jest.fn(),
		delete: jest.fn(),
		deleteSecret: jest.fn(),
		query: jest.fn(),
	},
	startsWith: jest.fn().mockImplementation(() => {
		return {
			condition: 'STARTS_WITH',
			value: '',
		};
	}),
	webTrigger: {
		getUrl: jest.fn(),
	},
}));

const mockStorageGetApi = jest.fn((key) => {
	if (key == "jenkinsServer-unique-uid") {
		return Promise.resolve({
			uuid: "unique-uid",
			name: "Jenkins-server-1",
			pipelines: [{
				name: "PipelineA",
				lastEventType: "build",
				lastEventStatus: "successful",
				lastEventDate: new Date("2022-01-25T23:27:25.000Z")
			}]
		});
	}
});
