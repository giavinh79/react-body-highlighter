import { CSSProperties } from 'react';

export enum EMuscle {
  TRAPEZIUS = 'trapezius',
  UPPER_BACK = 'upper-back',
  LOWER_BACK = 'lower-back',
  CHEST = 'chest',
  BICEPS = 'biceps',
  TRICEPS = 'triceps',
  FOREARM = 'forearm',
  BACK_DELTOIDS = 'back-deltoids',
  FRONT_DELTOIDS = 'front-deltoids',
  ABS = 'abs',
  OBLIQUES = 'obliques',
  ABDUCTOR = 'adductor',
  ABDUCTORS = 'abductors',
  HAMSTRING = 'hamstring',
  QUADRICEPS = 'quadriceps',
  CALVES = 'calves',
  GLUTEAL = 'gluteal',
  HEAD = 'head',
  NECK = 'neck',
  KNEES = 'knees',
  LEFT_SOLEUS = 'left-soleus',
  RIGHT_SOLEUS = 'right-soleus',
}

export type EMuscleType = `${EMuscle}`;

export enum EModel {
  POSTERIOR = 'posterior',
  ANTERIOR = 'anterior'
}

export type EModelType = `${EModel}`;

export interface IExerciseData {
  name: string
  muscles: EMuscleType[]
  frequency?: number
}

export interface IMuscleData {
  exercises: string[]
  frequency: number
}

export interface IMuscleStats {
  muscle: EMuscle
  data: IMuscleData
}

export interface IModelProps {
  bodyColor?: string
  data?: IExerciseData[]
  highlightedColors?: string[]
  hoverColor?: string
  onClick?: (exercise?: IMuscleStats) => void
  scale?: number | null
  style?: CSSProperties
  type?: EModelType
}
