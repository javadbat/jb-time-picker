# jb-time-picker-react

React component wrapper around [`jb-time-picker`](https://github.com/javadbat/jb-time-picker).

## Installation

```bash
npm i jb-time-picker-react
```

## Usage

```tsx
import { JBTimePicker } from 'jb-time-picker-react';

export function TimePickerSample() {
  return (
    <JBTimePicker
      value={{ hour: 3, minute: 10, second: 20 }}
      frontalZero
      onChange={(e) => console.log(e.target.value)}
    />
  );
}
```

You can also pass the value as a time string:

```tsx
<JBTimePicker value="03:10:20" />
```

## Props

- `value?: { hour: number, minute: number, second?: number } | string | null`
- `secondEnabled?: boolean`
- `frontalZero?: boolean`
- `optionalUnits?: ('hour' | 'minute' | 'second')[]`
- `showPersianNumber?: boolean`
- `textWidth?: number | null`
- `onLoad?: (event) => void`
- `onInit?: (event) => void`
- `onChange?: (event) => void`

## Demo

- [Storybook](https://javadbat.github.io/design-system/?path=/docs/components-jbtimepicker)

## Shared Documentation

For web-component behavior, events, and CSS variables, see [`jb-time-picker`](https://github.com/javadbat/jb-time-picker).
