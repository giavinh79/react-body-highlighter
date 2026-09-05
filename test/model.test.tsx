import { describe, expect, it } from '@rstest/core';
import { render } from '@testing-library/react';

import Model, { type IExerciseData } from '../src/index';

describe('model', () => {
  it('renders without crashing', () => {
    const data: IExerciseData[] = [
      { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
      { name: 'Tricep Pushdown', muscles: ['triceps'] },
    ];

    const { container } = render(
      <Model type="posterior" data={data} highlightedColors={['#e65a5a']} onClick={() => {}} />
    );

    expect(container.querySelectorAll('polygon').length).toBeGreaterThan(0);
  });
});
