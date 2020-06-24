import React from 'react';
import { Props, MuscleData, MuscleTypes } from 'types';
import { Svg, Polygon } from './styles';

import anteriorData from './assets/anteriorData';
import posteriorData from './assets/posteriorData';

/* Utility function for determining muscle color */
const fillIntensityColor = (
  activityMap: { [name: string]: MuscleData },
  highlightedColors: string[],
  muscle: string
) => {
  try {
    const { frequency } = activityMap[muscle];
    if (frequency === 0) {
      return undefined;
    } else {
      return highlightedColors[Math.min(highlightedColors.length - 1, frequency - 1)];
    }
  } catch (err) {
    return undefined;
  }
};

/* Object of supported muscles */
const activityMap: { [name: string]: MuscleData } = {
  trapezius: { exercises: [], frequency: 0 },
  'upper-back': { exercises: [], frequency: 0 },
  'lower-back': { exercises: [], frequency: 0 },
  chest: { exercises: [], frequency: 0 },
  biceps: { exercises: [], frequency: 0 },
  triceps: { exercises: [], frequency: 0 },
  forearm: { exercises: [], frequency: 0 },
  'back-deltoids': { exercises: [], frequency: 0 },
  'front-deltoids': { exercises: [], frequency: 0 },
  abs: { exercises: [], frequency: 0 },
  obliques: { exercises: [], frequency: 0 },
  adductor: { exercises: [], frequency: 0 },
  hamstring: { exercises: [], frequency: 0 },
  quadriceps: { exercises: [], frequency: 0 },
  abductors: { exercises: [], frequency: 0 },
  calves: { exercises: [], frequency: 0 },
  gluteal: { exercises: [], frequency: 0 },
  head: { exercises: [], frequency: 0 },
  neck: { exercises: [], frequency: 0 },
};

const Model: React.FC<Props> = ({
  bodyColor = '#B6BDC3',
  data,
  highlightedColors = ['#81b1d9', '#277abf'],
  hoverColor = '#757782',
  onClick,
  responsive = true,
  scale,
  style,
  svgStyle,
  type = 'anterior',
}) => {
  const modelTypeData = type === 'posterior' ? posteriorData : anteriorData;

  if (data) {
    for (let exercise of data) {
      for (let muscle of exercise.muscles) {
        activityMap[muscle].exercises = [...activityMap[muscle].exercises, exercise.name as MuscleTypes];
        activityMap[muscle].frequency += 1;
      }
    }
  }

  const handleClickCallback = (
    muscle: string,
    handleMuscleClick?: (data?: { muscle: string; stats: MuscleData }) => any
  ) => {
    if (handleMuscleClick == null || muscle == null) {
      return undefined;
    } else {
      return handleMuscleClick({ muscle, stats: activityMap[muscle] });
    }
  };

  return (
    <div style={{ width: 'auto', ...style }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 200"
        responsive={responsive}
        transform={scale ? `scale(${scale})` : undefined}
        style={svgStyle}
      >
        {modelTypeData.map(exercise =>
          exercise.pointsArray.map((points, index) => (
            <Polygon
              key={index}
              points={points}
              style={{
                fill: fillIntensityColor(activityMap, highlightedColors, exercise.muscle),
              }}
              onClick={() => handleClickCallback(exercise.muscle, onClick)}
              bodyColor={bodyColor}
              hoverColor={hoverColor}
            />
          ))
        )}
      </Svg>
    </div>
  );
};

export default React.memo(Model);
