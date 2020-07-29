import * as React from 'react';
import { Svg, Polygon } from './styles';
import { CSSProperties } from 'react';

import anteriorData from './assets/anteriorData';
import posteriorData from './assets/posteriorData';

/* Types for component props */
export interface Props {
  bodyColor?: string; // default color of body model (with no muscles worked)
  data?: DataExercise | null; // array containing exercise JSON objects
  highlightedColors?: string[] | undefined; // array containing colors to display frequency muscle is worked (array[frequency-1] = color)
  hoverColor?: string; // body muscle color shown when a user hovers their mouse over it
  onClick?: (exercise?: { muscle: string; stats: MuscleData }) => any; // called when a muscle is clicked (gets passed JSON object of muscle, exercises, and frequency)
  responsive?: boolean; // whether SVG will automatically resize with parent container
  scale?: number | null; // integer or decimal value for manually scaling model
  style?: CSSProperties; // style object that gets passed to SVG's parent container (div)
  svgStyle?: CSSProperties; // style object that gets passed to model SVG element
  type?: 'anterior' | 'posterior'; // denotes type of model (anterior vs posterior view) - default: posterior
}

/* Types for handleClick callback */
export interface MuscleData {
  exercises: string[];
  frequency: number;
}

export interface MuscleStats {
  muscle: string;
  stats: MuscleData;
}

/* Types for data passed to component */
export type DataExercise = Data[] | null | undefined;
export interface Data {
  name: string;
  muscles: string[];
  frequency?: number;
}

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
    knees: { exercises: [], frequency: 0 },
    'left-soleus': { exercises: [], frequency: 0 },
    'right-soleus': { exercises: [], frequency: 0 },
  };

  if (data) {
    for (let exercise of data) {
      for (let muscle of exercise.muscles) {
        activityMap[muscle].exercises = [...activityMap[muscle].exercises, exercise.name];
        activityMap[muscle].frequency += exercise.frequency || 1;
      }
    }
  }

  const handleClickCallback = (muscle: string, handleMuscleClick?: (data: MuscleStats) => void) => {
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

export default Model;
