import { type KeyboardEvent, memo, useMemo, useRef, useState } from 'react';

import { anteriorData, posteriorData } from '../assets';
import { DEFAULT_BODY_COLOR, DEFAULT_HIGHLIGHTED_COLORS, DEFAULT_MODEL_TYPE } from '../constants';
import { emptyMuscleData, fillIntensityColor, fillMuscleData, muscleNavigation } from '../utils';
import type { Exercise, ModelProps, Muscle } from './metadata';

const NO_DATA: Exercise[] = [];

/** `front-deltoids` reads as "front deltoids, button" rather than the id. */
const readable = (muscle: Muscle) => muscle.replace(/-/g, ' ');

// Focus ring only for keyboard focus, drawn on the muscle shape rather than its bounding box.
const FOCUS_STYLE = `
.rbh [role="button"]:focus { outline: none; }
.rbh [role="button"]:focus-visible polygon { stroke: var(--rbh-focus-color, currentColor); stroke-width: 2px; vector-effect: non-scaling-stroke; }
`;

const MODELS = {
  anterior: { shapes: anteriorData, navigation: muscleNavigation(anteriorData) },
  posterior: { shapes: posteriorData, navigation: muscleNavigation(posteriorData) },
};

/**
 * Body model with muscles colored by how often they appear in `data`.
 *
 * @param data Exercises, each naming the muscles it works
 * @param bodyColor Color of muscles that appear in no exercise
 * @param highlightedColors Colors by frequency; index = frequency - 1, the last color covers everything above
 * @param onClick Called with the muscle and its aggregated data when a muscle is clicked or activated with
 *   Enter or Space. When present, the model is one Tab stop. The muscles read as two columns, the body down
 *   the middle and the arms beside it: Up and Down walk a column and wrap, Left and Right cross between
 *   columns, and Home and End jump to the ends of the current one. Otherwise the model is a plain image.
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
}: ModelProps) {
  const muscleData = useMemo(() => fillMuscleData(data), [data]);
  const [focused, setFocused] = useState<number | null>(null);
  const groups = useRef<(SVGGElement | null)[]>([]);

  const { shapes: modelData, navigation } = MODELS[type] ?? MODELS[DEFAULT_MODEL_TYPE];
  const interactive = onClick != null;
  // Until a muscle has been focused the Tab stop is wherever Home leads, so the two agree.
  const current = Math.min(focused ?? navigation[0].first, modelData.length - 1);

  const select = (muscle: Muscle) => onClick?.({ muscle, data: muscleData[muscle] ?? emptyMuscleData() });

  const moveFocus = (index: number) => {
    setFocused(index);
    groups.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>, index: number, muscle: Muscle) => {
    const step = navigation[index];

    switch (event.key) {
      case 'ArrowUp':
        moveFocus(step.up);
        break;
      case 'ArrowDown':
        moveFocus(step.down);
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        moveFocus(step.across);
        break;
      case 'Home':
        moveFocus(step.first);
        break;
      case 'End':
        moveFocus(step.last);
        break;
      case 'Enter':
      case ' ':
        select(muscle);
        break;
      default:
        return;
    }

    event.preventDefault();
  };

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
        {interactive && <style>{FOCUS_STYLE}</style>}
        {modelData.map((exercise, index) => (
          <g
            key={exercise.muscle}
            ref={(el) => {
              groups.current[index] = el;
            }}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? (index === current ? 0 : -1) : undefined}
            aria-label={interactive ? readable(exercise.muscle) : undefined}
            onClick={interactive ? () => select(exercise.muscle) : undefined}
            onFocus={interactive ? () => setFocused(index) : undefined}
            onKeyDown={interactive ? (event) => handleKeyDown(event, index, exercise.muscle) : undefined}
            style={{ cursor: interactive ? 'pointer' : undefined }}
          >
            {exercise.svgPoints.map((points) => (
              <polygon
                key={points}
                points={points}
                data-muscle={exercise.muscle}
                style={{ fill: fillIntensityColor(muscleData, highlightedColors, exercise.muscle) ?? bodyColor }}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
});
