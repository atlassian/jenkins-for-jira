module.exports = {
	roots: ['<rootDir>'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	testMatch: [
		'<rootDir>/src/**/*.test.{ts,tsx}'
	],
	testEnvironment: 'jest-environment-jsdom',
	moduleFileExtensions: [
		'ts',
		'tsx',
		'js',
		'jsx',
		'json',
		'node'
	],
	testPathIgnorePatterns: ['/node_modules/', '/public/'],
	setupFilesAfterEnv: [
		'@testing-library/jest-dom/extend-expect'
	],
	moduleNameMapper: {
		"\\.(css|less|scss|sass|styl)$": "identity-obj-proxy",
		'\\.(png|jpg|webp|ttf|woff|woff2|svg|mp4)$': '<rootDir>/src/common/testUtils/media-mock.ts'
	},
	collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*',
		'!src/common/*/*.ts',
		'!src/index.tsx',
		'!src/**/*.styles.*'
  ],
  coverageReporters: ['html', 'lcov']
}
