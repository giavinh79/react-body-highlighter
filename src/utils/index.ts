import { type Exercise, type Muscle, type MuscleData, MUSCLES, MuscleType } from '../component/metadata';

const MUSCLE_SET: ReadonlySet<string> = new Set(MUSCLES);

export const isMuscle = (value: string): value is Muscle => MUSCLE_SET.has(value);

export const emptyMuscleData = (): MuscleData => ({ exercises: [], frequency: 0 });

/** Muscles that appear in the exercise data. Muscles without exercises are absent. */
export type MuscleDataMap = Partial<Record<Muscle, MuscleData>>;

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
export const fillMuscleData = (data: Exercise[]): MuscleDataMap =>
  data.reduce<MuscleDataMap>((acc, exercise) => {
    for (const muscle of exercise.muscles) {
      if (!isMuscle(muscle)) continue;
      const entry = (acc[muscle] ??= emptyMuscleData());
      entry.exercises.push(exercise.name);
      entry.frequency += exercise.frequency ?? 1;
    }
    return acc;
  }, {});

/** Muscle centers within this many viewBox units share a row and read left to right. */
const ROW_BAND = 25;

/** Muscles drawn beside the body rather than down the middle of it. */
const ARM_MUSCLES: ReadonlySet<Muscle> = new Set([
  MuscleType.FRONT_DELTOIDS,
  MuscleType.BACK_DELTOIDS,
  MuscleType.BICEPS,
  MuscleType.TRICEPS,
  MuscleType.FOREARM,
]);

interface Bounds {
  x: number;
  y: number;
  top: number;
  bottom: number;
}

/** Where each arrow key leads from a muscle, as indices into the model it was built from. */
export interface MuscleNavigation {
  up: number;
  down: number;
  across: number;
  first: number;
  last: number;
}

const boundsOf = ({ svgPoints }: { svgPoints: string[] }): Bounds => {
  const coords = svgPoints.flatMap((points) => points.split(/[\s,]+/).map(Number));
  const xs = coords.filter((_, index) => index % 2 === 0);
  const ys = coords.filter((_, index) => index % 2 === 1);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);

  return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (top + bottom) / 2, top, bottom };
};

/** Muscle indices top to bottom, with muscles at the same height reading left to right. */
const byHeight = (indices: number[], bounds: Bounds[]): number[] => {
  const sorted = [...indices];
  sorted.sort((a, b) => bounds[a].y - bounds[b].y || bounds[a].x - bounds[b].x);

  const ordered: number[] = [];
  let row: number[] = [];

  const flushRow = () => {
    row.sort((a, b) => bounds[a].x - bounds[b].x);
    ordered.push(...row);
  };

  for (const index of sorted) {
    if (row.length > 0 && bounds[index].y - bounds[row[0]].y > ROW_BAND) {
      flushRow();
      row = [];
    }
    row.push(index);
  }
  flushRow();

  return ordered;
};

/**
 * The muscle to cross to from `from`. A shoulder sits level with both the neck and the chest and is a
 * hair from each, so proximity cannot choose between them: take the highest muscle the current one is
 * level with, which is the one it reads as joining. Nothing level means the columns have run out
 * beside each other, as below the hands, so fall back to the nearest by height.
 */
const acrossFrom = (others: number[], bounds: Bounds[], from: Bounds): number | undefined => {
  const level = others.filter((index) => bounds[index].top <= from.y && from.y <= bounds[index].bottom);

  if (level.length > 0) {
    return level.reduce((highest, index) => (bounds[index].y < bounds[highest].y ? index : highest));
  }

  return others.reduce<number | undefined>(
    (nearest, index) =>
      nearest == null || Math.abs(bounds[index].y - from.y) < Math.abs(bounds[nearest].y - from.y) ? index : nearest,
    undefined
  );
};

/**
 * Where every arrow key leads, for each muscle in the model.
 *
 * The model reads as two columns, the body down the middle and the arms beside it. Up and Down walk a
 * column top to bottom and wrap at its ends, so descending the torso never detours through an arm.
 * Left and Right cross to the muscle the current one is level with in the other column.
 */
export const muscleNavigation = (model: readonly { muscle: Muscle; svgPoints: string[] }[]): MuscleNavigation[] => {
  const bounds = model.map(boundsOf);
  const columns: number[][] = [[], []];
  model.forEach(({ muscle }, index) => {
    columns[ARM_MUSCLES.has(muscle) ? 1 : 0].push(index);
  });

  const navigation: MuscleNavigation[] = [];

  columns
    .map((column) => byHeight(column, bounds))
    .forEach((column, side, sorted) => {
      const other = sorted[side === 0 ? 1 : 0];

      column.forEach((index, rank) => {
        navigation[index] = {
          up: column[(rank - 1 + column.length) % column.length],
          down: column[(rank + 1) % column.length],
          across: acrossFrom(other, bounds, bounds[index]) ?? index,
          first: column[0],
          last: column[column.length - 1],
        };
      });
    });

  return navigation;
};
