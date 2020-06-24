import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Model from '../dist/index';

const App = () => {
  return (
    <div style={styles.container}>
      <Model
        data={[
          { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
          { name: 'Tricep Pushdown', muscles: ['triceps'] },
        ]}
        onClick={exercise => alert(JSON.stringify(exercise))}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: '10rem 0',
  },
};

ReactDOM.render(<App />, document.getElementById('root'));
