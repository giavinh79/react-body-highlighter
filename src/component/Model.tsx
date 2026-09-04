import { memo, useMemo } from 'react';

import { anteriorData, posteriorData } from '../assets';
import { DEFAULT_BODY_COLOR, DEFAULT_HIGHLIGHTED_COLORS, DEFAULT_MODEL_TYPE } from '../constants';
import { fillIntensityColor, fillMuscleData } from '../utils';
import { type IExerciseData, type IModelProps, ModelType } from './metadata';

const NO_DATA: IExerciseData[] = [];

/**
 * Body model with muscles colored by how often they appear in `data`.
 *
 * @param data Exercises, each naming the muscles it works
 * @param bodyColor Color of muscles that appear in no exercise
 * @param highlightedColors Colors by frequency; index = frequency - 1, the last color covers everything above
 * @param onClick Called with the muscle and its aggregated data when a muscle is clicked
 * @param svgStyle Style object passed to the SVG element
 * @param style Style object passed to the wrapping div
 * @param type `anterior` (front) or `posterior` (back) view
 *
 * @example
 * const data = [{ name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] }];
 * return <Model type="posterior" data={data} />;
 */
export default memo(function Model({
  data = NO_DATA,
  bodyColor = DEFAULT_BODY_COLOR,
  highlightedColors = DEFAULT_HIGHLIGHTED_COLORS,
  onClick,
  svgStyle,
  style,
  type = DEFAULT_MODEL_TYPE,
}: IModelProps) {
  const muscleData = useMemo(() => fillMuscleData(data), [data]);

  const modelData = type === ModelType.ANTERIOR ? anteriorData : posteriorData;

  return (
    <div style={style} className="rbh-wrapper">
      <svg className="rbh" width="100%" height="100%" viewBox="0 0 100 200" style={svgStyle}>
        {modelData.map((exercise) =>
          exercise.svgPoints.map((points) => (
            <polygon
              key={points}
              points={points}
              onClick={() => onClick?.({ muscle: exercise.muscle, data: muscleData[exercise.muscle] })}
              style={{
                cursor: 'pointer',
                fill: fillIntensityColor(muscleData, highlightedColors, exercise.muscle) ?? bodyColor,
              }}
            />
          ))
        )}
      </svg>
    </div>
  );
});
