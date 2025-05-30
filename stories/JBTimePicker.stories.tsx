import React from 'react';
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
export default {
  title: 'Components/JBTimePicker',
  // component:
};
const Template = (args) => <jb-time-picker {...args}></jb-time-picker>;
export const Normal = Template.bind({});
Normal.args = {
};
const RTLTemplate = (args) => <div style={{direction:'rtl'}}><jb-time-picker {...args}></jb-time-picker></div>;
export const RTLSample = RTLTemplate.bind({});
RTLSample.args = {
};
const ValueTestTemplate = (args) => <JBTimePickerValueTest {...args}></JBTimePickerValueTest>;
export const ValueTest = ValueTestTemplate.bind({});
Normal.args = {
  hour:0,
  minute:0,
  second:0
};
