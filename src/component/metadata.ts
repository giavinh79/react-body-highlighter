import type { CSSProperties } from 'react';

/** Every muscle the model can highlight. Loop over this instead of listing muscles by hand. */
export const MUSCLES = [
  'trapezius',
  'upper-back',
  'lower-back',
  'chest',
  'biceps',
  'triceps',
  'forearm',
  'back-deltoids',
  'front-deltoids',
  'abs',
  'obliques',
  'adductor',
  'abductors',
  'hamstring',
  'quadriceps',
  'calves',
  'gluteal',
  'head',
  'neck',
  'knees',
  'left-soleus',
  'right-soleus',
] as const;

export type Muscle = (typeof MUSCLES)[number];

/** The views of the body the model can draw. */
export const MODEL_TYPES = ['anterior', 'posterior'] as const;

export type ModelType = (typeof MODEL_TYPES)[number];

export interface Exercise {
  name: string;
  muscles: Muscle[];
  frequency?: number;
}

export interface MuscleData {
  exercises: string[];
  frequency: number;
}

export interface MuscleStats {
  muscle: Muscle;
  data: MuscleData;
}

export interface ModelProps {
  bodyColor?: string;
  data?: Exercise[];
  highlightedColors?: string[];
  onClick?: (exercise: MuscleStats) => void;
  style?: CSSProperties;
  svgStyle?: CSSProperties;
  type?: ModelType;
}
