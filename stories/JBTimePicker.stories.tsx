import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import 'jb-time-picker';
import JBTimePickerValueTest from './samples/JBTimePickerValueTest';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-time-picker': any;
    }
  }
}
const meta = {
  title: 'Components/JBTimePicker',
  // component:
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  render: (args) => <jb-time-picker {...args}></jb-time-picker>,
  args: {
    hour: 0,
    minute: 0,
    second: 0
  }
};

export const RTLSample: Story = {
  render: (args) => <div style={{ direction: 'rtl' }}><jb-time-picker {...args}></jb-time-picker></div>,
  args: {}
};

export const ValueTest: Story = {
  render: (args) => <JBTimePickerValueTest {...args}></JBTimePickerValueTest>
};
