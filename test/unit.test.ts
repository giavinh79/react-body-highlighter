import { describe, expect, it } from '@rstest/core';

import { type IExerciseData, type IMuscleData, type Muscle, MuscleType } from '../src/component/metadata';
import { ensure, fillIntensityColor, fillMuscleData } from '../src/utils';

describe('ensure', () => {
  it('returns backup value if main value is null', () => {
    expect(ensure(null, 'test')).toBe('test');
  });

  it('returns backup value if main value is undefined', () => {
    expect(ensure(undefined, 5)).toBe(5);
  });

  it('returns main value is it is neither null or undefined', () => {
    expect(ensure('original', 'backup')).toBe('original');
  });
});

describe('fillIntensityColor', () => {
  const HIGHLIGHTED_COLORS = ['#ccc', '#bbb'];

  const ACTIVITY_MAP = {
    [MuscleType.CHEST]: { exercises: ['bench press', 'chest flies'], frequency: 0 },
    [MuscleType.ABS]: { exercises: ['crunches'], frequency: 1 },
    [MuscleType.BICEPS]: { exercises: ['bicep curl'], frequency: 3 },
  } as Record<Muscle, IMuscleData>;

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
    expect(muscleObject[MuscleType.FOREARM]).toBeDefined();
  });
});
