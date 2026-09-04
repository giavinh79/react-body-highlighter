import { describe, expect, it, rs } from '@rstest/core';
import { fireEvent, render } from '@testing-library/react';

import Model, { type IExerciseData, type IMuscleStats } from '../index';

const data: IExerciseData[] = [
  { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { name: 'Tricep Pushdown', muscles: ['triceps'], frequency: 2 },
];

const polygon = (container: HTMLElement, muscle: string) =>
  container.querySelector<SVGPolygonElement>(`polygon[data-muscle="${muscle}"]`)!;

describe('Model', () => {
  it('renders the anterior view by default and the posterior view on request', () => {
    const anterior = render(<Model />).container;
    const posterior = render(<Model type="posterior" />).container;

    expect(anterior.querySelectorAll('polygon').length).toBeGreaterThan(0);
    expect(polygon(anterior, 'chest')).toBeInTheDocument();
    expect(polygon(anterior, 'upper-back')).toBeNull();
    expect(polygon(posterior, 'upper-back')).toBeInTheDocument();
    expect(polygon(posterior, 'chest')).toBeNull();
  });

  it('colors muscles by frequency and leaves the rest in the body color', () => {
    const { container } = render(
      <Model data={data} bodyColor="rgb(1, 2, 3)" highlightedColors={['rgb(10, 10, 10)', 'rgb(20, 20, 20)']} />
    );

    expect(polygon(container, 'chest')).toHaveStyle({ fill: 'rgb(10, 10, 10)' });
    expect(polygon(container, 'triceps')).toHaveStyle({ fill: 'rgb(20, 20, 20)' });
    expect(polygon(container, 'abs')).toHaveStyle({ fill: 'rgb(1, 2, 3)' });
  });

  it('uses the last highlight color once frequency exceeds the palette', () => {
    const { container } = render(
      <Model
        data={[{ name: 'Curls', muscles: ['biceps'], frequency: 9 }]}
        highlightedColors={['rgb(255, 0, 0)', 'rgb(0, 0, 255)']}
      />
    );

    expect(polygon(container, 'biceps')).toHaveStyle({ fill: 'rgb(0, 0, 255)' });
  });

  it('reports the clicked muscle with its aggregated data', () => {
    const onClick = rs.fn<(stats: IMuscleStats) => void>();
    const { container } = render(<Model data={data} onClick={onClick} />);

    fireEvent.click(polygon(container, 'triceps'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith({
      muscle: 'triceps',
      data: { exercises: ['Bench Press', 'Tricep Pushdown'], frequency: 3 },
    });
  });

  it('exposes muscles as focusable buttons only when onClick is given', () => {
    const plain = render(<Model />).container;
    const interactive = render(<Model onClick={() => {}} />).container;

    expect(plain.querySelector('svg')).toHaveAttribute('role', 'img');
    expect(polygon(plain, 'chest')).not.toHaveAttribute('role');
    expect(polygon(plain, 'chest')).not.toHaveAttribute('tabindex');
    expect(polygon(plain, 'chest')).not.toHaveStyle({ cursor: 'pointer' });

    expect(interactive.querySelector('svg')).toHaveAttribute('role', 'group');
    expect(polygon(interactive, 'chest')).toHaveAttribute('role', 'button');
    expect(polygon(interactive, 'chest')).toHaveAttribute('tabindex', '0');
    expect(polygon(interactive, 'chest')).toHaveAccessibleName('chest');
    expect(polygon(interactive, 'chest')).toHaveStyle({ cursor: 'pointer' });
  });

  it('activates a muscle with Enter or Space', () => {
    const onClick = rs.fn<(stats: IMuscleStats) => void>();
    const { container } = render(<Model data={data} onClick={onClick} />);

    fireEvent.keyDown(polygon(container, 'chest'), { key: 'Enter' });
    fireEvent.keyDown(polygon(container, 'chest'), { key: ' ' });
    fireEvent.keyDown(polygon(container, 'chest'), { key: 'a' });

    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onClick).toHaveBeenLastCalledWith({
      muscle: 'chest',
      data: { exercises: ['Bench Press'], frequency: 1 },
    });
  });

  it('passes style to the wrapper and svgStyle to the svg', () => {
    const { container } = render(<Model style={{ width: '123px' }} svgStyle={{ opacity: 0.5 }} />);

    expect(container.firstElementChild).toHaveStyle({ width: '123px' });
    expect(container.querySelector('svg')).toHaveStyle({ opacity: '0.5' });
  });

  it('ignores unknown muscle names from untyped callers', () => {
    // Simulates an untyped JavaScript caller.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const untyped = [{ name: 'Typo', muscles: ['chest', 'not-a-muscle'] }] as unknown as IExerciseData[];

    expect(() => render(<Model data={untyped} />)).not.toThrow();
  });
});
