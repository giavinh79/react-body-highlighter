import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module '@rstest/core' {
  interface Assertion<T = any> extends TestingLibraryMatchers<unknown, T> {}
}
