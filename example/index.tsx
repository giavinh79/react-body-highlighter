import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Model, { IExerciseData } from '../src/index';

const data: IExerciseData[] = [
  { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
  // { name: 'Tricep Pushdown', muscles: ['triceps'] },
];

const handleClick = ({ muscle, data }) => {
  const { exercises, frequency } = data;

  const message = `You clicked the ${muscle}! You've worked out this muscle ${frequency} times through the following exercises: ${JSON.stringify(exercises)}`
  alert(message);
};

const App = () => {
  return (
    <div style={styles.container}>
      <Model data={data} onClick={handleClick} />
      <Model type="posterior" data={data} highlightedColors={['#e65a5a', '#db2f2f']} onClick={handleClick} style={{ width: '20rem' }} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50rem',
  },
};

ReactDOM.render(<App />, document.getElementById('root'));
