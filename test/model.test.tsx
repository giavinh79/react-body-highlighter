import { describe, expect, it } from '@rstest/core';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import Model, { type IExerciseData } from '../src/index';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('model', () => {
  it('renders without crashing', async () => {
    const data: IExerciseData[] = [
      { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
      { name: 'Tricep Pushdown', muscles: ['triceps'] },
    ];

    const div = document.createElement('div');
    const root = createRoot(div);

    await act(async () => {
      root.render(<Model type="posterior" data={data} highlightedColors={['#e65a5a']} onClick={() => {}} />);
    });

    expect(div.querySelectorAll('polygon').length).toBeGreaterThan(0);

    await act(async () => {
      root.unmount();
    });
  });
});
