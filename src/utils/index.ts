import { type IExerciseData, type IMuscleData, type Muscle, MuscleType } from '../component/metadata';

const MUSCLES = [...new Set<Muscle>(Object.values(MuscleType))];

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
 */
export const fillMuscleData = (data: IExerciseData[]): Record<Muscle, IMuscleData> => {
  const result = {} as Record<Muscle, IMuscleData>;
  for (const muscle of MUSCLES) {
    result[muscle] = { exercises: [], frequency: 0 };
  }

  for (const exercise of data) {
    for (const muscle of exercise.muscles) {
      const entry = result[muscle];
      if (!entry) continue;
      entry.exercises.push(exercise.name);
      entry.frequency += exercise.frequency || 1;
    }
  }

  return result;
};
