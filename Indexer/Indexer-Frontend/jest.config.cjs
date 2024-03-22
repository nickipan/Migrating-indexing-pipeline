// Used the following source: https://stackoverflow.com/questions/57905383/testing-images-imported-in-the-component-with-jest-react-native

const config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/imageMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/cssMock.js',
  },
};

module.exports = config;


