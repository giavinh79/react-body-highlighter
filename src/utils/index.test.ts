import { describe, expect, it } from '@rstest/core';

import type { MuscleShape } from '../assets';
import type { Exercise, Muscle } from '../component/metadata';
import { fillIntensityColor, fillMuscleData, muscleNavigation } from './index';

describe('fillIntensityColor', () => {
  const HIGHLIGHTED_COLORS = ['#ccc', '#bbb'];

  const ACTIVITY_MAP = {
    chest: { exercises: ['bench press', 'chest flies'], frequency: 0 },
    abs: { exercises: ['crunches'], frequency: 1 },
    biceps: { exercises: ['bicep curl'], frequency: 3 },
  };

  it('returns undefined if frequency of muscle being exercised is 0', () => {
    expect(fillIntensityColor(ACTIVITY_MAP, HIGHLIGHTED_COLORS, 'chest')).toBe(undefined);
  });

  it('returns proper color depending on frequency', () => {
    expect(fillIntensityColor(ACTIVITY_MAP, HIGHLIGHTED_COLORS, 'abs')).toBe('#ccc');
    expect(fillIntensityColor(ACTIVITY_MAP, HIGHLIGHTED_COLORS, 'biceps')).toBe('#bbb');
  });
});

describe('fillMuscleData', () => {
  it('returns proper muscle object given data', () => {
    const input: Exercise[] = [
      { name: 'bench press', muscles: ['chest', 'triceps'], frequency: 2 },
      { name: 'bicep curl', muscles: ['biceps'], frequency: 1 },
      { name: 'triceps pulldown', muscles: ['triceps'], frequency: 3 },
    ];

    const muscleObject = fillMuscleData(input);

    expect(muscleObject.chest).toStrictEqual({ exercises: ['bench press'], frequency: 2 });
    expect(muscleObject.triceps).toStrictEqual({
      exercises: ['bench press', 'triceps pulldown'],
      frequency: 5,
    });
    expect(muscleObject.biceps).toStrictEqual({ exercises: ['bicep curl'], frequency: 1 });
    expect(muscleObject.forearm).toBeUndefined();
  });

  it('counts an explicit frequency of 0 as nothing', () => {
    const input: Exercise[] = [{ name: 'Plank', muscles: ['abs'], frequency: 0 }];

    expect(fillMuscleData(input).abs).toStrictEqual({ exercises: ['Plank'], frequency: 0 });
  });

  it('ignores unknown muscle names', () => {
    // Simulates an untyped JavaScript caller.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const input = [{ name: 'typo', muscles: ['chest', 'not-a-muscle'] }] as unknown as Exercise[];

    expect(() => fillMuscleData(input)).not.toThrow();
    expect(fillMuscleData(input).chest?.frequency).toBe(1);
  });
});

const shape = (muscle: Muscle, x: number, y: number) => ({
  muscle,
  svgPoints: [`${x} ${y} ${x + 10} ${y} ${x + 10} ${y + 10} ${x} ${y + 10}`],
});

describe('muscleNavigation', () => {
  it('walks a column top to bottom and wraps at its ends', () => {
    const model = [shape('abs', 0, 900), shape('chest', 0, 100), shape('quadriceps', 0, 500)];
    const [abs, chest, quadriceps] = muscleNavigation(model);

    expect(chest.down).toBe(2);
    expect(quadriceps.down).toBe(0);
    expect(abs.down).toBe(1);
    expect(abs.up).toBe(2);
    expect(chest.first).toBe(1);
    expect(chest.last).toBe(0);
  });

  it('steps past an arm muscle when walking down the body', () => {
    const model = [shape('abs', 0, 100), shape('forearm', 900, 200), shape('quadriceps', 0, 300)];
    const [abs] = muscleNavigation(model);

    expect(abs.down).toBe(2);
  });

  it('crosses to the muscle level with the current one in the other column', () => {
    const model = [shape('abs', 0, 100), shape('biceps', 900, 900), shape('forearm', 900, 120)];
    const [abs, biceps, forearm] = muscleNavigation(model);

    expect(abs.across).toBe(2);
    expect(forearm.across).toBe(0);
    expect(biceps.across).toBe(0);
  });

  it('crosses to the highest muscle it is level with', () => {
    const model: MuscleShape[] = [
      // A shoulder level with both the neck above it and the chest below it.
      { muscle: 'front-deltoids', svgPoints: ['0 300 10 300 10 500 0 500'] },
      { muscle: 'neck', svgPoints: ['900 200 910 200 910 420 900 420'] },
      { muscle: 'chest', svgPoints: ['900 380 910 380 910 560 900 560'] },
    ];

    expect(muscleNavigation(model)[0].across).toBe(1);
  });

  it('keeps a muscle in place when the other column is empty', () => {
    const [abs] = muscleNavigation([shape('abs', 0, 100)]);

    expect(abs).toStrictEqual({ up: 0, down: 0, across: 0, first: 0, last: 0 });
  });

  it('spans every polygon of a muscle when locating its center', () => {
    const model: MuscleShape[] = [
      shape('abs', 0, 500),
      { muscle: 'chest', svgPoints: ['0 100 10 100 10 110 0 110', '900 100 910 100 910 110 900 110'] },
    ];

    expect(muscleNavigation(model)[1].down).toBe(0);
  });

  it('reads muscles at the same height left to right', () => {
    const model = [shape('right-soleus', 900, 100), shape('left-soleus', 100, 110)];
    const [right, left] = muscleNavigation(model);

    expect(left.down).toBe(0);
    expect(right.up).toBe(1);
    expect(left.first).toBe(1);
  });
});
