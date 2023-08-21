const invoke = jest.fn() as jest.MockedFunction<typeof import('@forge/bridge').invoke>;

// Optional: Mock additional methods or properties as needed
invoke.mockResolvedValue('mocked-secret');
invoke.mockRejectedValue(new Error('Mocked error'));

export { invoke };
