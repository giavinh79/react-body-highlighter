import { describe, expect, it, rs } from '@rstest/core';
import { fireEvent, render } from '@testing-library/react';

import Model, { type Exercise, type ModelType, type MuscleStats } from '../index';

const data: Exercise[] = [
  { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { name: 'Tricep Pushdown', muscles: ['triceps'], frequency: 2 },
];

const polygon = (container: HTMLElement, muscle: string) =>
  container.querySelector<SVGPolygonElement>(`polygon[data-muscle="${muscle}"]`)!;

const button = (container: HTMLElement, muscle: string) => polygon(container, muscle).parentElement!;

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
    const onClick = rs.fn<(stats: MuscleStats) => void>();
    const { container } = render(<Model data={data} onClick={onClick} />);

    fireEvent.click(polygon(container, 'triceps'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith({
      muscle: 'triceps',
      data: { exercises: ['Bench Press', 'Tricep Pushdown'], frequency: 3 },
    });
  });

  it('exposes one button per muscle, only when onClick is given', () => {
    const plain = render(<Model />).container;
    const interactive = render(<Model onClick={() => {}} />).container;

    expect(plain.querySelector('svg')).toHaveAttribute('role', 'img');
    expect(plain.querySelectorAll('[role="button"]')).toHaveLength(0);
    expect(button(plain, 'chest')).not.toHaveStyle({ cursor: 'pointer' });

    expect(interactive.querySelector('svg')).toHaveAttribute('role', 'group');
    expect(button(interactive, 'chest')).toHaveAttribute('role', 'button');
    expect(button(interactive, 'chest')).toHaveAccessibleName('chest');
    // Screen readers should hear the muscle, not its id.
    expect(button(interactive, 'front-deltoids')).toHaveAccessibleName('front deltoids');
    expect(button(interactive, 'chest')).toHaveStyle({ cursor: 'pointer' });
    expect(interactive.querySelectorAll('[role="button"][aria-label="chest"]')).toHaveLength(1);
  });

  it('is a single Tab stop and walks the body column with Up and Down', () => {
    const { container } = render(<Model onClick={() => {}} />);
    const buttons = [...container.querySelectorAll<SVGGElement>('[role="button"]')];

    // Tab lands where Home leads, at the top of the body column.
    expect(buttons.filter((b) => b.getAttribute('tabindex') === '0')).toHaveLength(1);
    expect(button(container, 'head')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'head'), { key: 'ArrowDown' });
    expect(button(container, 'head')).toHaveAttribute('tabindex', '-1');
    expect(button(container, 'neck')).toHaveAttribute('tabindex', '0');

    // Down the torso, past the biceps and the forearm that sit beside it.
    fireEvent.keyDown(button(container, 'neck'), { key: 'ArrowDown' });
    expect(button(container, 'chest')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'chest'), { key: 'ArrowDown' });
    expect(button(container, 'obliques')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'obliques'), { key: 'ArrowDown' });
    expect(button(container, 'abs')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'abs'), { key: 'ArrowDown' });
    expect(button(container, 'abductors')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'abductors'), { key: 'ArrowUp' });
    expect(button(container, 'abs')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'abs'), { key: 'End' });
    expect(button(container, 'calves')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'calves'), { key: 'ArrowDown' });
    expect(button(container, 'head')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'head'), { key: 'Home' });
    expect(button(container, 'head')).toHaveAttribute('tabindex', '0');
  });

  it('crosses between the body and the arms with Left and Right', () => {
    const { container } = render(<Model onClick={() => {}} />);

    fireEvent.keyDown(button(container, 'chest'), { key: 'ArrowRight' });
    expect(button(container, 'front-deltoids')).toHaveAttribute('tabindex', '0');

    // A shoulder is level with both the neck and the chest, and reads as joining the neck.
    fireEvent.keyDown(button(container, 'front-deltoids'), { key: 'ArrowLeft' });
    expect(button(container, 'neck')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'neck'), { key: 'ArrowRight' });
    expect(button(container, 'front-deltoids')).toHaveAttribute('tabindex', '0');

    // The arm column has its own ends, so Up and Down stay inside it.
    fireEvent.keyDown(button(container, 'front-deltoids'), { key: 'ArrowDown' });
    expect(button(container, 'biceps')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'biceps'), { key: 'End' });
    expect(button(container, 'forearm')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'forearm'), { key: 'ArrowLeft' });
    expect(button(container, 'abs')).toHaveAttribute('tabindex', '0');
  });

  it('orders the posterior soleus pair left to right', () => {
    const { container } = render(<Model type="posterior" onClick={() => {}} />);

    fireEvent.keyDown(button(container, 'calves'), { key: 'ArrowDown' });
    expect(button(container, 'left-soleus')).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(button(container, 'left-soleus'), { key: 'ArrowDown' });
    expect(button(container, 'right-soleus')).toHaveAttribute('tabindex', '0');
  });

  it('activates a muscle with Enter or Space', () => {
    const onClick = rs.fn<(stats: MuscleStats) => void>();
    const { container } = render(<Model data={data} onClick={onClick} />);

    fireEvent.keyDown(button(container, 'chest'), { key: 'Enter' });
    fireEvent.keyDown(button(container, 'chest'), { key: ' ' });
    fireEvent.keyDown(button(container, 'chest'), { key: 'a' });

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

  it('falls back to the anterior view for an unknown type from untyped callers', () => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const { container } = render(<Model type={'sideways' as ModelType} />);

    expect(polygon(container, 'chest')).toBeInTheDocument();
  });

  it('ignores unknown muscle names from untyped callers', () => {
    // Simulates an untyped JavaScript caller.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const untyped = [{ name: 'Typo', muscles: ['chest', 'not-a-muscle'] }] as unknown as Exercise[];

    expect(() => render(<Model data={untyped} />)).not.toThrow();
  });
});
