//@ts-nocheck (sometimes giving partial input object for easier testing)

import { ensure, fillIntensityColor, fillMuscleData } from '../src/utils';
import { IMuscleData, Muscle, MuscleType } from '../src/component/metadata';

describe('ensure', () => {
  it('returns backup value if main value is null', () => {
    const mainValue = null;
    const backupValue = 'test';

    const result = ensure(mainValue, backupValue);

    expect(result).toBe(backupValue);
  });

  it('returns backup value if main value is undefined', () => {
    const mainValue = undefined;
    const backupValue = 5;

    const result = ensure(mainValue, backupValue);

    expect(result).toBe(backupValue);
  });

  it('returns main value is it is neither null or undefined', () => {
    const mainValue = 'original';
    const backupValue = 'backup';

    const result = ensure(mainValue, backupValue);

    expect(result).toBe(mainValue);
  });
});

describe('fillIntensityColor', () => {
  const HIGHLIGHTED_COLORS = ['#ccc', '#bbb'];

  const ACTIVITY_MAP: Partial<Record<Muscle, IMuscleData>> = {
    [MuscleType.CHEST]: {
      exercises: ['bench press', 'chest flies'],
      frequency: 0,
    },
    [MuscleType.ABS]: {
      exercises: ['crunches'],
      frequency: 1,
    },
    [MuscleType.BICEPS]: {
      exercises: ['bicep curl'],
      frequency: 3,
    },
  };

  it('returns undefined if frequency of muscle being exercised is 0', () => {
    const highlightedColor = fillIntensityColor(ACTIVITY_MAP, HIGHLIGHTED_COLORS, MuscleType.CHEST);

    expect(highlightedColor).toBe(undefined);
  });

  it('returns proper color depending on frequency', () => {
    const highlightedColorBiceps = fillIntensityColor(ACTIVITY_MAP, HIGHLIGHTED_COLORS, MuscleType.BICEPS);
    const highlightedColorAbs = fillIntensityColor(ACTIVITY_MAP, HIGHLIGHTED_COLORS, MuscleType.ABS);

    expect(highlightedColorAbs).toBe('#ccc');
    expect(highlightedColorBiceps).toBe('#bbb');
  });
});

describe('fillMuscleData', () => {
  it('returns proper muscle object given data', () => {
    const EXAMPLE_INPUT = [
      {
        name: 'bench press',
        muscles: [MuscleType.CHEST, MuscleType.TRICEPS],
        frequency: 2,
      },
      {
        name: 'bicep curl',
        muscles: [MuscleType.BICEPS],
        frequency: 1,
      },
      {
        name: 'triceps pulldown',
        muscles: [MuscleType.TRICEPS],
        frequency: 3,
      },
    ];

    const EXPECTED_OUTPUT = {
      [MuscleType.CHEST]: {
        exercises: ['bench press'],
        frequency: 2,
      },
      [MuscleType.TRICEPS]: {
        exercises: ['bench press', 'triceps pulldown'],
        frequency: 5,
      },
      [MuscleType.BICEPS]: {
        exercises: ['bicep curl'],
        frequency: 1,
      },
    };

    const muscleObject = fillMuscleData(EXAMPLE_INPUT);

    expect(muscleObject[MuscleType.CHEST]).toStrictEqual(EXPECTED_OUTPUT[MuscleType.CHEST]);
    expect(muscleObject[MuscleType.TRICEPS]).toStrictEqual(EXPECTED_OUTPUT[MuscleType.TRICEPS]);
    expect(muscleObject[MuscleType.BICEPS]).toStrictEqual(EXPECTED_OUTPUT[MuscleType.BICEPS]);

    expect(muscleObject[MuscleType.FOREARM]).toBeDefined(); // initializes other muscles to default values
  });
});
