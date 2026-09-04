import { afterEach, expect } from '@rstest/core';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

// Rstest exposes no global afterEach, so Testing Library cannot register its own cleanup.
afterEach(cleanup);
