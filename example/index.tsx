import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ProductionModel from 'react-body-highlighter';
import Model from '../src/component/Model';

import { IExerciseData, IMuscleStats } from '../src/component/metadata';

function App() {
  const [exampleState, setExampleState] = React.useState(false); // Model should not re-render when parent component re-renders
  const [data, setData] = React.useState<IExerciseData[]>([
    { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
    { name: 'Tricep Pushdown', muscles: ['triceps'] },
  ]);

  const handleClick = React.useCallback(({ muscle, data }: IMuscleStats) => {
    const { exercises, frequency } = data;

    alert(`You clicked the ${muscle}! You've worked out this muscle ${frequency} times through the following exercises: ${JSON.stringify(exercises)}`)

  }, [data]);

  const addNewExerciseTest = () => {
    setData([...data, { name: 'Pec Deck', muscles: ['chest'] }])
  }

  return (
    <>
      <div style={styles.container}>
        <Model data={data} onClick={handleClick} bodyColor="#ccc" />
        <ProductionModel type="posterior" data={data} highlightedColors={['#e65a5a']} onClick={handleClick} />
      </div>
      <button onClick={addNewExerciseTest} style={styles.button}>Add one more bench press</button>
      <button onClick={() => setExampleState(!exampleState)}>Re-render parent</button>
    </>
  );
};

const styles = {
  button: {
    margin: '0 1rem',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
};

ReactDOM.render(<App />, document.getElementById('root'));
