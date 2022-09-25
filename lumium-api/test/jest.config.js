module.exports = {
    clearMocks: true,
    maxWorkers: 1,
    rootDir: "../",
    setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.spec.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    globalTeardown: '<rootDir>/test/jest-teardown-globals.ts',
};
