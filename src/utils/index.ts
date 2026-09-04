import type { IExerciseData, IMuscleData, Muscle } from '../component/metadata';

const empty = (): IMuscleData => ({ exercises: [], frequency: 0 });

/**
 * A fresh record with every muscle at zero. Adding a value to `Muscle` fails to compile until it is listed here.
 */
export const emptyMuscleData = (): Record<Muscle, IMuscleData> => ({
  trapezius: empty(),
  'upper-back': empty(),
  'lower-back': empty(),
  chest: empty(),
  biceps: empty(),
  triceps: empty(),
  forearm: empty(),
  'back-deltoids': empty(),
  'front-deltoids': empty(),
  abs: empty(),
  obliques: empty(),
  adductor: empty(),
  abductors: empty(),
  hamstring: empty(),
  quadriceps: empty(),
  calves: empty(),
  gluteal: empty(),
  head: empty(),
  neck: empty(),
  knees: empty(),
  'left-soleus': empty(),
  'right-soleus': empty(),
});

/**
 * Color for a muscle based on how often it has been exercised, or undefined when it has not been.
 */
export const fillIntensityColor = (
  activityMap: Record<Muscle, IMuscleData>,
  highlightedColors: string[],
  muscle: Muscle
): string | undefined => {
  const frequency = activityMap[muscle]?.frequency;

  if (frequency == null || frequency === 0) {
    return undefined;
  }

  return highlightedColors[Math.min(highlightedColors.length - 1, frequency - 1)];
};

/**
 * Per-muscle exercise names and total frequency. Unknown muscle names are ignored.
 * An exercise without `frequency` counts once; an explicit `0` adds nothing.
 */
export const fillMuscleData = (data: IExerciseData[]): Record<Muscle, IMuscleData> => {
  const result = emptyMuscleData();

  for (const exercise of data) {
    for (const muscle of exercise.muscles) {
      const entry = result[muscle];
      if (!entry) continue;
      entry.exercises.push(exercise.name);
      entry.frequency += exercise.frequency ?? 1;
    }
  }

  return result;
};
