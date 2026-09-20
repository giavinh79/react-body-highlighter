import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { type ComponentProps, useCallback, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import Model from './Model';
import type { Exercise, MuscleStats } from './metadata';

const workout: Exercise[] = [
  { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { name: 'Push Ups', muscles: ['chest'] },
  { name: 'Tricep Pushdown', muscles: ['triceps'] },
  { name: 'Squat', muscles: ['quadriceps', 'gluteal', 'hamstring'], frequency: 3 },
];

const meta = {
  title: 'Model',
  component: Model,
  tags: ['autodocs'],
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

/** Clicking a muscle reports its name and aggregated exercise data. Click one to see the payload. */
export const ClickReportsMuscle: Story = {
  render: (args) => <ClickReporter {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'chest' }));
    await expect(args.onClick).toHaveBeenCalledWith({
      muscle: 'chest',
      data: { exercises: ['Bench Press', 'Push Ups'], frequency: 2 },
    });
    await expect(canvas.getByRole('status')).toHaveTextContent('"muscle": "chest"');
  },
};

function ClickReporter({ onClick, ...args }: ComponentProps<typeof Model>) {
  const [last, setLast] = useState<MuscleStats>();
  const report = useCallback(
    (stats: MuscleStats) => {
      setLast(stats);
      onClick?.(stats);
    },
    [onClick]
  );

  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
      <Model {...args} onClick={report} />
      <output
        style={{
          whiteSpace: 'pre',
          padding: '0.75rem 1rem',
          minWidth: '16rem',
          borderRadius: '0.5rem',
          background: '#f4f5f7',
          color: '#2d3436',
          font: '0.75rem/1.5 ui-monospace, monospace',
        }}
      >
        {last ? JSON.stringify(last, null, 2) : 'Click a muscle to see the onClick payload.'}
      </output>
    </div>
  );
}

/** One Tab stop; Up and Down walk the body, Left and Right cross to the arms, Enter activates. A shoulder crosses back to the neck it joins. */
export const KeyboardActivation: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'head' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(canvas.getByRole('button', { name: 'chest' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'front deltoids' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('button', { name: 'neck' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
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
