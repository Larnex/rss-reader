// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Path to your Next.js app
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!**/node_modules/**",
  ],
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
};

module.exports = createJestConfig(customJestConfig);
