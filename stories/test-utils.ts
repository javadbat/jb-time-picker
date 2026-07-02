import type { JBTimePickerValueObject, JBTimePickerWebComponent, TimeUnits } from 'jb-time-picker';
import { expect, waitFor } from 'storybook/test';

type TimeStep = 'substitutePrevTime' | 'prevTime' | 'currentTime' | 'nextTime' | 'substituteNextTime';

const timeStepClassMap: Record<TimeStep, string> = {
  substitutePrevTime: 'substitute-prev-time',
  prevTime: 'prev-time',
  currentTime: 'current-time',
  nextTime: 'next-time',
  substituteNextTime: 'substitute-next-time',
};

export function getTimePicker(canvasElement: HTMLElement, index = 0) {
  const timePicker = canvasElement.querySelectorAll<JBTimePickerWebComponent>('jb-time-picker')[index];
  expect(timePicker).toBeTruthy();
  expect(timePicker!.shadowRoot).toBeTruthy();
  return timePicker!;
}

export function getTimeText(timePicker: JBTimePickerWebComponent, timeUnit: TimeUnits, timeStep: TimeStep) {
  const timeText = timePicker.shadowRoot?.querySelector<SVGTextElement>(
    `.${timeStepClassMap[timeStep]} .${timeUnit}-text`,
  );
  expect(timeText).toBeTruthy();
  return timeText!;
}

export function queryTimeText(timePicker: JBTimePickerWebComponent, timeUnit: TimeUnits, timeStep: TimeStep) {
  return timePicker.shadowRoot?.querySelector<SVGTextElement>(
    `.${timeStepClassMap[timeStep]} .${timeUnit}-text`,
  ) ?? null;
}

export function getSecondIndicator(timePicker: JBTimePickerWebComponent) {
  const indicator = timePicker.shadowRoot?.querySelector<SVGUseElement>('.second-indicator');
  expect(indicator).toBeTruthy();
  return indicator!;
}

export function getSeparatorTexts(timePicker: JBTimePickerWebComponent) {
  const separators = Array.from(timePicker.shadowRoot?.querySelectorAll<SVGTextElement>('.separator-text') ?? []);
  expect(separators.length).toBe(2);
  return separators;
}

export async function waitForTimeValue(timePicker: JBTimePickerWebComponent, expectedValue: JBTimePickerValueObject) {
  await waitFor(() => {
    expect(timePicker.value.hour).toBe(expectedValue.hour);
    expect(timePicker.value.minute).toBe(expectedValue.minute);
    if (typeof expectedValue.second === 'number') {
      expect(timePicker.value.second).toBe(expectedValue.second);
    }
  });
}
