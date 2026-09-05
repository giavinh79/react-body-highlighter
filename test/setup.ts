import { afterEach } from '@rstest/core';
import { cleanup } from '@testing-library/react';

// Rstest exposes no global afterEach, so Testing Library cannot register its own cleanup.
afterEach(cleanup);
