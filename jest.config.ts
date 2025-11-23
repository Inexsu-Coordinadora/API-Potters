process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  maxWorkers: 1,
  setupFilesAfterEnv: ['./test/setupTests.ts'],
};
