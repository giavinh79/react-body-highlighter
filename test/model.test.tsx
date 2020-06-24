import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Model from '../src/index';

describe('model', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Model />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
