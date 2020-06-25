import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Model from '../src/index';

const data = [
  { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { name: 'Tricep Pushdown', muscles: ['triceps'] },
];

const handleClick = (exercise: any) => {
  const {
    muscle,
    stats: { exercises, frequency },
  } = exercise;
  alert(
    `You clicked the ${muscle}! You've worked out this muscle ${frequency} times through the following exercises: ${JSON.stringify(
      exercises
    )}`
  );
};

const App = () => {
  return (
    <div style={styles.container}>
      <Model
        data={[
          {
            name: 'Bench Press',
            muscles: ['chest', 'triceps', 'front-deltoids'],
            frequency: 4,
          },
          {
            name: 'Lat Pulldown',
            muscles: ['upper-back'],
          },
          { name: 'Tricep Pushdown', muscles: ['triceps'] },
        ]}
        onClick={handleClick}
      />
      <Model type="posterior" data={data} highlightedColors={['#e65a5a', '#db2f2f']} onClick={handleClick} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10rem',
  },
};

ReactDOM.render(<App />, document.getElementById('root'));
