import { memo, useMemo } from 'react';

import { anteriorData, posteriorData } from '../assets';
import { DEFAULT_BODY_COLOR, DEFAULT_HIGHLIGHTED_COLORS, DEFAULT_MODEL_TYPE } from '../constants';
import { emptyMuscleData, fillIntensityColor, fillMuscleData } from '../utils';
import { type IExerciseData, type IModelProps, ModelType, type Muscle } from './metadata';

const NO_DATA: IExerciseData[] = [];

/**
 * Body model with muscles colored by how often they appear in `data`.
 *
 * @param data Exercises, each naming the muscles it works
 * @param bodyColor Color of muscles that appear in no exercise
 * @param highlightedColors Colors by frequency; index = frequency - 1, the last color covers everything above
 * @param onClick Called with the muscle and its aggregated data when a muscle is clicked or activated with
 *   Enter or Space. When present, muscles are focusable buttons; otherwise the model is a plain image.
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
  const interactive = onClick != null;

  const select = (muscle: Muscle) => onClick?.({ muscle, data: muscleData[muscle] ?? emptyMuscleData() });

  return (
    <div style={style} className="rbh-wrapper">
      <svg
        className="rbh"
        width="100%"
        height="100%"
        viewBox="0 0 1000 2000"
        style={svgStyle}
        role={interactive ? 'group' : 'img'}
        aria-label={`${type} body model`}
      >
        {modelData.map((exercise) =>
          exercise.svgPoints.map((points) => (
            <polygon
              key={points}
              points={points}
              data-muscle={exercise.muscle}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={interactive ? exercise.muscle : undefined}
              onClick={interactive ? () => select(exercise.muscle) : undefined}
              onKeyDown={
                interactive
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        select(exercise.muscle);
                      }
                    }
                  : undefined
              }
              style={{
                cursor: interactive ? 'pointer' : undefined,
                fill: fillIntensityColor(muscleData, highlightedColors, exercise.muscle) ?? bodyColor,
              }}
            />
          ))
        )}
      </svg>
    </div>
  );
});
