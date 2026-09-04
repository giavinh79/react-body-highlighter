---
'react-body-highlighter': major
---

Rebuilt on rslib, Rstest, TypeScript 7 and Storybook 10.

- ESM-first package with an `exports` map: `import` and `require` conditions with matching `.d.ts` and `.d.cts`. `src/` is no longer shipped.
- Node 20 or newer to build; consumers need React 16.8 or newer.
- The `ModelType` type is exported. `MuscleType.ADDUCTOR` is added; `MuscleType.ABDUCTOR` (value `'adductor'`) is deprecated.
- Unknown muscle names in `data` are ignored instead of throwing. An explicit `frequency: 0` adds 0 to a muscle; it used to count as 1.
- With `onClick`, muscles are keyboard-accessible buttons (`role="button"`, `tabIndex=0`, `aria-label`, Enter and Space). Without it the svg is `role="img"` and no longer shows a pointer cursor.
- Polygons carry `data-muscle="<name>"`.
- Docs: `highlightedColors` defaults to `['#81b1d9', '#277abf']` and `onClick` receives `{ muscle, data }`; both were misdocumented.
