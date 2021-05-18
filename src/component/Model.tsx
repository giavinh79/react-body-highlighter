import * as React from 'react';

import { ModelType, Muscle, IExerciseData, IModelProps, IMuscleData, IMuscleStats } from './metadata';
import { Polygon } from './styles';

import { anteriorData, posteriorData } from '../assets';
import {
  DEFAULT_MUSCLE_DATA,
  DEFAULT_BODY_COLOR,
  DEFAULT_HIGHLIGHTED_COLORS,
  DEFAULT_HOVER_COLOR,
  DEFAULT_MODEL_TYPE,
} from '../constants';

/**
 * Function which determines color of muscle based on how often it has been exercised
 */
const fillIntensityColor = (
  activityMap: Record<Muscle, IMuscleData>,
  highlightedColors: string[],
  muscle: Muscle
): string | undefined => {
  const { frequency } = activityMap[muscle];

  if (frequency === 0) {
    return undefined;
  }

  return highlightedColors[Math.min(highlightedColors.length - 1, frequency - 1)];
};

/**
 * Function which generates object with muscle data
 */
const fillMuscleData = (data: IExerciseData[]): Record<Muscle, IMuscleData> => {
  return data.reduce(
    (acc, exercise: IExerciseData) => {
      for (const muscle of exercise.muscles) {
        acc[muscle].exercises = [...acc[muscle].exercises, exercise.name];
        acc[muscle].frequency += exercise.frequency || 1;
      }

      return acc;
    },
    { ...DEFAULT_MUSCLE_DATA }
  );
};

/**
 * Component which displays a model of a body. Accepts many optional props for manipulating functionality or visuals of the component.
 *
 * @param data Array containing exercise objects
 * @param bodyColor Default color of body model (with no muscles worked)
 * @param highlightedColors Array containing colors to display depending on frequency muscle is worked (where array index = frequency - 1)
 * @param hoverColor Color shown when a user hovers their mouse over a muscle on the model
 * @param onClick Callback function when a muscle is clicked (returns back object with muscle-related data)
 * @param style Style object that gets passed to SVG element
 * @param type Denotes type of model (default anterior view vs posterior view)
 *
 * @component
 * @example
 * const data = [{ name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] }]
 * return (
 *   <Model type="posterior" data={data} />
 * )
 */
export default function Model({
  data = [],
  bodyColor = DEFAULT_BODY_COLOR,
  highlightedColors = DEFAULT_HIGHLIGHTED_COLORS,
  hoverColor = DEFAULT_HOVER_COLOR,
  onClick,
  style,
  type = DEFAULT_MODEL_TYPE,
}: IModelProps) {
  const muscleData = React.useRef<Record<Muscle, IMuscleData>>(fillMuscleData([...data]));

  const handleClick = (muscle: Muscle, callback?: (data: IMuscleStats) => void) => {
    callback && callback({ muscle, data: muscleData.current[muscle] });
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 200"
      style={{
        width: '100%',
        height: 'auto',
        ...style,
      }}
    >
      {(type === ModelType.POSTERIOR ? posteriorData : anteriorData).map(exercise =>
        exercise.svgPoints.map((points, index) => (
          <Polygon
            key={index}
            points={points}
            style={{
              fill: fillIntensityColor(muscleData.current, highlightedColors, exercise.muscle),
            }}
            onClick={() => handleClick(exercise.muscle, onClick)}
            bodyColor={bodyColor}
            hoverColor={hoverColor}
          />
        ))
      )}
    </svg>
  );
}
