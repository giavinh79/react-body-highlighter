---
'react-body-highlighter': major
---

Muscle and model names are plain strings, and the exported types drop their `I` prefix.

- `MuscleType` and the `ModelType` object are gone, along with the `MuscleType.ABDUCTOR` alias for `'adductor'`. Write `'chest'` and `'posterior'` instead of `MuscleType.CHEST` and `ModelType.POSTERIOR`; the `Muscle` and `ModelType` types still check them, and misspellings are still caught.
- `MUSCLES` lists every muscle name and `MODEL_TYPES` lists `anterior` and `posterior`, both as readonly arrays of those literals.
- `IExerciseData` is now `Exercise`. `IMuscleData`, `IMuscleStats` and `IModelProps` are now `MuscleData`, `MuscleStats` and `ModelProps`.
