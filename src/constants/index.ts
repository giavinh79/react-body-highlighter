import { ModelType, Muscle, IMuscleData } from '../component/metadata';

export const DEFAULT_MUSCLE_DATA: Record<Muscle, IMuscleData> = {
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

export const DEFAULT_BODY_COLOR = '#B6BDC3';
export const DEFAULT_HIGHLIGHTED_COLORS = ['#81b1d9', '#277abf'];
export const DEFAULT_HOVER_COLOR = '#757782';

export const DEFAULT_MODEL_TYPE = ModelType.ANTERIOR;
