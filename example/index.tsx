import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Model from '../src/component/Model';
import ProductionModel, { IExerciseData } from 'react-body-highlighter';

const data: IExerciseData[] = [
  { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { name: 'Tricep Pushdown', muscles: ['triceps'] },
];

const handleClick = ({ muscle, data }) => {
  const { exercises, frequency } = data;

  const message = `You clicked the ${muscle}! You've worked out this muscle ${frequency} times through the following exercises: ${JSON.stringify(exercises)}`
  alert(message);
};

const App = () => {
  return (
    <div style={styles.container}>
      <Model data={data} onClick={handleClick} bodyColor="#ccc" />
      <ProductionModel type="posterior" data={data} highlightedColors={['#e65a5a']} onClick={handleClick} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

ReactDOM.render(<App />, document.getElementById('root'));
