import type { Meta, StoryObj } from '@storybook/react';
import 'jb-time-picker';
import {JBTimePicker} from 'jb-time-picker/react';
import JBTimePickerValueTest from './samples/JBTimePickerValueTest';

const meta = {
  title: 'Components/JBTimePicker',
  component:JBTimePicker
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  render: (args) => <JBTimePicker {...args}></JBTimePicker>,
  args:{}
};

export const RTLSample: Story = {
  render: (args) => <div style={{ direction: 'rtl' }}><JBTimePicker {...args}></JBTimePicker></div>,
  args: {}
};

export const ValueTest: Story = {
  render: (args) => <JBTimePickerValueTest {...args}></JBTimePickerValueTest>
};
