import { describe, expect, it, rs } from '@rstest/core';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import Model, { type IExerciseData, type IMuscleStats } from '../index';

const data: IExerciseData[] = [{ name: 'Bench Press', muscles: ['chest', 'triceps'] }];

describe('Model in a real browser', () => {
  it('receives pointer clicks on the rendered polygon geometry', async () => {
    const onClick = rs.fn<(stats: IMuscleStats) => void>();
    const { container } = render(<Model data={data} onClick={onClick} style={{ width: 300, height: 600 }} />);

    await userEvent.click(container.querySelector('polygon[data-muscle="chest"]')!);

    expect(onClick).toHaveBeenCalledWith({
      muscle: 'chest',
      data: { exercises: ['Bench Press'], frequency: 1 },
    });
  });

  it('paints highlight and body colors as computed fills', () => {
    const { container } = render(
      <Model data={data} bodyColor="#010203" highlightedColors={['#0a0a0a']} style={{ width: 300 }} />
    );

    expect(getComputedStyle(container.querySelector('polygon[data-muscle="chest"]')!).fill).toBe('rgb(10, 10, 10)');
    expect(getComputedStyle(container.querySelector('polygon[data-muscle="abs"]')!).fill).toBe('rgb(1, 2, 3)');
  });

  it('shows a pointer cursor over muscles', () => {
    const { container } = render(<Model />);

    expect(getComputedStyle(container.querySelector('polygon')!).cursor).toBe('pointer');
  });
});
