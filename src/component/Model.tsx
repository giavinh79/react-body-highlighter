import * as React from 'react';

import { ModelType, Muscle, IExerciseData, IModelProps, IMuscleData, IMuscleStats } from './metadata';

import { anteriorData, posteriorData } from '../assets';
import { DEFAULT_MUSCLE_DATA, DEFAULT_BODY_COLOR, DEFAULT_HIGHLIGHTED_COLORS, DEFAULT_MODEL_TYPE } from '../constants';

/*
 * Utility function for choosing backup value if first value is undefined
 */
const ensure = (value: string | undefined, backupValue: string): string => {
  return value == null ? backupValue : value;
};

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
    { ...JSON.parse(JSON.stringify(DEFAULT_MUSCLE_DATA)) }
  );
};

/**
 * Component which displays a model of a body. Accepts many optional props for manipulating functionality or visuals of the component.
 *
 * @param data Array containing exercise objects
 * @param bodyColor Default color of body model (with no muscles worked)
 * @param highlightedColors Array containing colors to display depending on frequency muscle is worked (where array index = frequency - 1)
 * @param onClick Callback function when a muscle is clicked (returns back object with muscle-related data)
 * @param svgStyle Style object that gets passed to SVG element
 * @param style Style object that gets passed to SVG parent wrapper (div)
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
  onClick,
  svgStyle,
  style,
  type = DEFAULT_MODEL_TYPE,
}: IModelProps) {
  const muscleData = React.useRef<Record<Muscle, IMuscleData>>(fillMuscleData([...data]));

  const modelData = type === ModelType.ANTERIOR ? anteriorData : posteriorData;

  const handleClick = (muscle: Muscle, callback?: (data: IMuscleStats) => void) => {
    callback && callback({ muscle, data: muscleData.current[muscle] });
  };

  return (
    <div style={style} className="rbh-wrapper">
      <svg
        className="rbh"
        width="100%"
        height="100%"
        viewBox="0 0 100 200"
        style={{
          ...svgStyle,
        }}
      >
        {modelData.map(exercise =>
          exercise.svgPoints.map((points, index) => (
            <polygon
              key={index}
              points={points}
              onClick={() => handleClick(exercise.muscle, onClick)}
              style={{
                cursor: 'pointer',
                fill: ensure(fillIntensityColor(muscleData.current, highlightedColors, exercise.muscle), bodyColor),
              }}
            />
          ))
        )}
      </svg>
    </div>
  );
}
