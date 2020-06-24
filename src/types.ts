import { CSSProperties } from 'react';

/* Component Props */
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
  exercises: MuscleTypes[];
  frequency: number;
}
export type MuscleTypes =
  | 'trapezius'
  | 'upper-back'
  | 'lower-back'
  | 'chest'
  | 'biceps'
  | 'triceps'
  | 'forearm'
  | 'back-deltoids'
  | 'front-deltoids'
  | 'abs'
  | 'obliques'
  | 'abductor'
  | 'hamstring'
  | 'quadriceps'
  | 'abductors'
  | 'calves'
  | 'gluteal'
  | 'head'
  | 'neck';

/* Types for data passed to component */
export type DataExercise = Data[] | null | undefined;
export interface Data {
  name: string;
  muscles: MuscleTypes[];
}
