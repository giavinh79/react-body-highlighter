import { describe, expect, it } from '@rstest/core';

import { type IExerciseData, MuscleType } from '../src/component/metadata';
import { emptyMuscleData, fillIntensityColor, fillMuscleData } from '../src/utils';

describe('fillIntensityColor', () => {
  const HIGHLIGHTED_COLORS = ['#ccc', '#bbb'];

  const ACTIVITY_MAP = {
    ...emptyMuscleData(),
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
    const input: IExerciseData[] = [
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
    expect(muscleObject[MuscleType.FOREARM]).toStrictEqual({ exercises: [], frequency: 0 });
  });

  it('counts an explicit frequency of 0 as nothing', () => {
    const input: IExerciseData[] = [{ name: 'Plank', muscles: ['abs'], frequency: 0 }];

    expect(fillMuscleData(input)[MuscleType.ABS]).toStrictEqual({ exercises: ['Plank'], frequency: 0 });
  });

  it('ignores unknown muscle names', () => {
    // Simulates an untyped JavaScript caller.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const input = [{ name: 'typo', muscles: ['chest', 'not-a-muscle'] }] as unknown as IExerciseData[];

    expect(() => fillMuscleData(input)).not.toThrow();
    expect(fillMuscleData(input)[MuscleType.CHEST].frequency).toBe(1);
  });
});
