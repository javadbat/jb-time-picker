import type { Meta, StoryObj } from '@storybook/react';
import 'jb-time-picker';
import { JBTimePicker } from 'jb-time-picker/react';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import JBTimePickerValueTest from './samples/JBTimePickerValueTest';
import {
  getSecondIndicator,
  getSeparatorTexts,
  getTimePicker,
  getTimeText,
  queryTimeText,
  waitForTimeValue,
} from './test-utils';

const meta = {
  title: 'Components/form elements/JBTimePicker',
  component: JBTimePicker,
} satisfies Meta<typeof JBTimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const timePicker = getTimePicker(canvasElement);

    await waitForTimeValue(timePicker, { hour: 0, minute: 0, second: 0 });

    expect(getTimeText(timePicker, 'hour', 'currentTime')).toBeTruthy();
    expect(getTimeText(timePicker, 'minute', 'currentTime')).toBeTruthy();
    expect(getTimeText(timePicker, 'second', 'currentTime')).toBeTruthy();
  },
};

export const WithoutSecond: Story = {
  args: {
    secondEnabled: false,
  },
  play: async ({ canvasElement }) => {
    const timePicker = getTimePicker(canvasElement);

    await waitFor(() => {
      expect(timePicker.secondEnabled).toBe(false);
      expect(queryTimeText(timePicker, 'second', 'currentTime')).toBeNull();
      expect(getSecondIndicator(timePicker).classList.contains('--hidden')).toBe(true);
      expect(getSeparatorTexts(timePicker)[1].classList.contains('--hidden')).toBe(true);
    });
  },
};
export const RTLSample: Story = {
  render: (args) => <div style={{ direction: 'rtl' }}><JBTimePicker {...args}></JBTimePicker></div>,
  args: {},
  play: async ({ canvasElement }) => {
    const timePicker = getTimePicker(canvasElement);

    await waitFor(() => {
      expect(getComputedStyle(timePicker).direction).toBe('rtl');
    });
  },
};

export const ValueTest: Story = {
  render: (args) => <JBTimePickerValueTest {...args}></JBTimePickerValueTest>,
  play: async ({ canvasElement }) => {
    const timePicker = getTimePicker(canvasElement);
    const setValueButton = Array.from(canvasElement.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('12:30:12')
    );

    expect(setValueButton).toBeTruthy();

    await userEvent.click(setValueButton!);
    await waitForTimeValue(timePicker, { hour: 12, minute: 30, second: 12 });
  },
};

export const WithValue: Story = {
  args: {
    value: { hour: 12, minute: 30, second: 12 },
  },
  play: async ({ canvasElement }) => {
    const timePicker = getTimePicker(canvasElement);

    await waitForTimeValue(timePicker, { hour: 12, minute: 30, second: 12 });
  },
};

export const FrontalZero: Story = {
  args: {
    value: { hour: 2, minute: 5, second: 9 },
    frontalZero: true,
  },
  play: async ({ canvasElement }) => {
    const timePicker = getTimePicker(canvasElement);

    await waitForTimeValue(timePicker, { hour: 2, minute: 5, second: 9 });

    await waitFor(() => {
      expect(getTimeText(timePicker, 'hour', 'currentTime').textContent).toBe('02');
      expect(getTimeText(timePicker, 'minute', 'currentTime').textContent).toBe('05');
      expect(getTimeText(timePicker, 'second', 'currentTime').textContent).toBe('09');
    });
  },
};

export const PersianNumber: Story = {
  args: {
    value: { hour: 12, minute: 30, second: 45 },
    showPersianNumber: true,
  },
  play: async ({ canvasElement }) => {
    const timePicker = getTimePicker(canvasElement);

    await waitForTimeValue(timePicker, { hour: 12, minute: 30, second: 45 });

    await waitFor(() => {
      expect(getTimeText(timePicker, 'hour', 'currentTime').textContent).toBe('\u06F1\u06F2');
      expect(getTimeText(timePicker, 'minute', 'currentTime').textContent).toBe('\u06F3\u06F0');
      expect(getTimeText(timePicker, 'second', 'currentTime').textContent).toBe('\u06F4\u06F5');
    });
  },
};

export const OptionalMinute: Story = {
  args: {
    optionalUnits: ['minute'],
  },
  play: async ({ canvasElement }) => {
    const timePicker = getTimePicker(canvasElement);

    await waitFor(() => {
      expect(getTimeText(timePicker, 'minute', 'currentTime').classList.contains('--optional')).toBe(true);
      expect(getTimeText(timePicker, 'hour', 'currentTime').classList.contains('--optional')).toBe(false);
    });
  },
};

export const EventTest: Story = {
  args: {
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const timePicker = getTimePicker(canvasElement);

    await userEvent.click(getTimeText(timePicker, 'minute', 'nextTime'));

    await waitFor(() => {
      expect(timePicker.value.minute).toBe(1);
      expect(args.onChange).toHaveBeenCalled();
    });
  },
};
