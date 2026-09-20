import { describe, expect, it } from '@rstest/core';

import { type Exercise, type Muscle, MuscleType } from '../component/metadata';
import { fillIntensityColor, fillMuscleData, muscleNavigation } from './index';

describe('fillIntensityColor', () => {
  const HIGHLIGHTED_COLORS = ['#ccc', '#bbb'];

  const ACTIVITY_MAP = {
    [MuscleType.CHEST]: { exercises: ['bench press', 'chest flies'], frequency: 0 },
    [MuscleType.ABS]: { exercises: ['crunches'], frequency: 1 },
    [MuscleType.BICEPS]: { exercises: ['bicep curl'], frequency: 3 },
  };

  it('returns undefined if frequency of muscle being exercised is 0', () => {
    expect(fillIntensityColor(ACTIVITY_MAP, HIGHLIGHTED_COLORS, MuscleType.CHEST)).toBe(undefined);
  });

  it('returns proper color depending on frequency', () => {
    expect(fillIntensityColor(ACTIVITY_MAP, HIGHLIGHTED_COLORS, MuscleType.ABS)).toBe('#ccc');
    expect(fillIntensityColor(ACTIVITY_MAP, HIGHLIGHTED_COLORS, MuscleType.BICEPS)).toBe('#bbb');
  });
});

describe('fillMuscleData', () => {
  it('returns proper muscle object given data', () => {
    const input: Exercise[] = [
      { name: 'bench press', muscles: [MuscleType.CHEST, MuscleType.TRICEPS], frequency: 2 },
      { name: 'bicep curl', muscles: [MuscleType.BICEPS], frequency: 1 },
      { name: 'triceps pulldown', muscles: [MuscleType.TRICEPS], frequency: 3 },
    ];

    const muscleObject = fillMuscleData(input);

    expect(muscleObject[MuscleType.CHEST]).toStrictEqual({ exercises: ['bench press'], frequency: 2 });
    expect(muscleObject[MuscleType.TRICEPS]).toStrictEqual({
      exercises: ['bench press', 'triceps pulldown'],
      frequency: 5,
    });
    expect(muscleObject[MuscleType.BICEPS]).toStrictEqual({ exercises: ['bicep curl'], frequency: 1 });
    expect(muscleObject[MuscleType.FOREARM]).toBeUndefined();
  });

  it('counts an explicit frequency of 0 as nothing', () => {
    const input: Exercise[] = [{ name: 'Plank', muscles: ['abs'], frequency: 0 }];

    expect(fillMuscleData(input)[MuscleType.ABS]).toStrictEqual({ exercises: ['Plank'], frequency: 0 });
  });

  it('ignores unknown muscle names', () => {
    // Simulates an untyped JavaScript caller.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const input = [{ name: 'typo', muscles: ['chest', 'not-a-muscle'] }] as unknown as Exercise[];

    expect(() => fillMuscleData(input)).not.toThrow();
    expect(fillMuscleData(input)[MuscleType.CHEST]?.frequency).toBe(1);
  });
});

const shape = (muscle: Muscle, x: number, y: number) => ({
  muscle,
  svgPoints: [`${x} ${y} ${x + 10} ${y} ${x + 10} ${y + 10} ${x} ${y + 10}`],
});

describe('muscleNavigation', () => {
  it('walks a column top to bottom and wraps at its ends', () => {
    const model = [
      shape(MuscleType.ABS, 0, 900),
      shape(MuscleType.CHEST, 0, 100),
      shape(MuscleType.QUADRICEPS, 0, 500),
    ];
    const [abs, chest, quadriceps] = muscleNavigation(model);

    expect(chest.down).toBe(2);
    expect(quadriceps.down).toBe(0);
    expect(abs.down).toBe(1);
    expect(abs.up).toBe(2);
    expect(chest.first).toBe(1);
    expect(chest.last).toBe(0);
  });

  it('steps past an arm muscle when walking down the body', () => {
    const model = [
      shape(MuscleType.ABS, 0, 100),
      shape(MuscleType.FOREARM, 900, 200),
      shape(MuscleType.QUADRICEPS, 0, 300),
    ];
    const [abs] = muscleNavigation(model);

    expect(abs.down).toBe(2);
  });

  it('crosses to the muscle level with the current one in the other column', () => {
    const model = [
      shape(MuscleType.ABS, 0, 100),
      shape(MuscleType.BICEPS, 900, 900),
      shape(MuscleType.FOREARM, 900, 120),
    ];
    const [abs, biceps, forearm] = muscleNavigation(model);

    expect(abs.across).toBe(2);
    expect(forearm.across).toBe(0);
    expect(biceps.across).toBe(0);
  });

  it('crosses to the highest muscle it is level with', () => {
    const model = [
      // A shoulder level with both the neck above it and the chest below it.
      { muscle: MuscleType.FRONT_DELTOIDS, svgPoints: ['0 300 10 300 10 500 0 500'] },
      { muscle: MuscleType.NECK, svgPoints: ['900 200 910 200 910 420 900 420'] },
      { muscle: MuscleType.CHEST, svgPoints: ['900 380 910 380 910 560 900 560'] },
    ];

    expect(muscleNavigation(model)[0].across).toBe(1);
  });

  it('keeps a muscle in place when the other column is empty', () => {
    const [abs] = muscleNavigation([shape(MuscleType.ABS, 0, 100)]);

    expect(abs).toStrictEqual({ up: 0, down: 0, across: 0, first: 0, last: 0 });
  });

  it('spans every polygon of a muscle when locating its center', () => {
    const model = [
      shape(MuscleType.ABS, 0, 500),
      { muscle: MuscleType.CHEST, svgPoints: ['0 100 10 100 10 110 0 110', '900 100 910 100 910 110 900 110'] },
    ];

    expect(muscleNavigation(model)[1].down).toBe(0);
  });

  it('reads muscles at the same height left to right', () => {
    const model = [shape(MuscleType.RIGHT_SOLEUS, 900, 100), shape(MuscleType.LEFT_SOLEUS, 100, 110)];
    const [right, left] = muscleNavigation(model);

    expect(left.down).toBe(0);
    expect(right.up).toBe(1);
    expect(left.first).toBe(1);
  });
});
