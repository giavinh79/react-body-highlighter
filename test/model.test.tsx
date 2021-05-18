import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Model, { IExerciseData } from '../src/index';

describe('model', () => {
  it('renders without crashing', () => {
    const data: IExerciseData[] = [
      { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
      { name: 'Tricep Pushdown', muscles: ['triceps'] },
    ];

    const div = document.createElement('div');

    ReactDOM.render(
      <Model type="posterior" data={data} highlightedColors={['#e65a5a']} onClick={() => alert('test')} />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
