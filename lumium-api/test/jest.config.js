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
    transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
    modulePathIgnorePatterns: ["<rootDir>/build/"],
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/test/tsconfig.test.json"
        }
    }
};
