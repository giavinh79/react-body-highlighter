import { type IExerciseData, type IMuscleData, type Muscle, MUSCLES } from '../component/metadata';

const MUSCLE_SET: ReadonlySet<string> = new Set(MUSCLES);

export const isMuscle = (value: string): value is Muscle => MUSCLE_SET.has(value);

export const emptyMuscleData = (): IMuscleData => ({ exercises: [], frequency: 0 });

/** Muscles that appear in the exercise data. Muscles without exercises are absent. */
export type MuscleDataMap = Partial<Record<Muscle, IMuscleData>>;

/**
 * Color for a muscle based on how often it has been exercised, or undefined when it has not been.
 */
export const fillIntensityColor = (
  activityMap: MuscleDataMap,
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
export const fillMuscleData = (data: IExerciseData[]): MuscleDataMap => {
  const result: MuscleDataMap = {};

  for (const exercise of data) {
    for (const muscle of exercise.muscles) {
      if (!isMuscle(muscle)) continue;
      const entry = (result[muscle] ??= emptyMuscleData());
      entry.exercises.push(exercise.name);
      entry.frequency += exercise.frequency ?? 1;
    }
  }

  return result;
};
