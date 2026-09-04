import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';

import Model from './Model';
import type { IExerciseData } from './metadata';

const workout: IExerciseData[] = [
  { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { name: 'Push Ups', muscles: ['chest'] },
  { name: 'Tricep Pushdown', muscles: ['triceps'] },
  { name: 'Squat', muscles: ['quadriceps', 'gluteal', 'hamstring'], frequency: 3 },
];

const meta = {
  title: 'Model',
  component: Model,
  args: {
    data: workout,
    onClick: fn(),
    style: { width: '16rem' },
  },
  argTypes: {
    type: { control: 'radio', options: ['anterior', 'posterior'] },
    bodyColor: { control: 'color' },
  },
} satisfies Meta<typeof Model>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Anterior: Story = {};

export const Posterior: Story = {
  args: { type: 'posterior' },
};

export const CustomColors: Story = {
  args: {
    bodyColor: '#2d3436',
    highlightedColors: ['#fab1a0', '#e17055', '#d63031'],
  },
};

/** One color per frequency step. The last color covers every frequency beyond the palette. */
export const FrequencyScale: Story = {
  args: {
    data: [
      { name: 'Once', muscles: ['biceps'], frequency: 1 },
      { name: 'Twice', muscles: ['chest'], frequency: 2 },
      { name: 'Three times', muscles: ['abs'], frequency: 3 },
      { name: 'Ten times', muscles: ['quadriceps'], frequency: 10 },
    ],
    highlightedColors: ['#dfe6e9', '#74b9ff', '#0984e3', '#2d3436'],
  },
};

export const Empty: Story = {
  args: { data: [] },
};

/**
 * The parent re-renders on every button click while `data` keeps its identity.
 * The Performance panel's React section should show no Model re-render.
 */
export const MemoizedAgainstParentRenders: Story = {
  render: (args) => <RerenderingParent {...args} />,
};

function RerenderingParent(args: ComponentProps<typeof Model>) {
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
      <Model {...args} />
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Re-render parent ({count})
      </button>
    </div>
  );
}
