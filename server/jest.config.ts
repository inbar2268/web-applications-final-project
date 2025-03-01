/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    testTimeout: 100000,
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
};