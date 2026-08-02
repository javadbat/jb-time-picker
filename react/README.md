# jb-time-picker-react

React component wrapper around [`jb-time-picker`](https://github.com/javadbat/jb-time-picker). The wrapper forwards the web component API while providing typed props and event callbacks.

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

See the [default React demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--normal) for the interactive picker.

You can also pass the value as a time string:

```tsx
<JBTimePicker value="03:10:20" />
```

## Props

| prop | type | description |
| --- | --- | --- |
| `value` | `{ hour: number, minute: number, second?: number } \| string \| null` | Controlled object or `HH:mm[:ss]` value. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--with-value) |
| `secondEnabled` | `boolean` | Shows or hides the second unit. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--without-second) |
| `frontalZero` | `boolean` | Displays values below 10 with a leading zero. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--frontal-zero) |
| `optionalUnits` | `('hour' \| 'minute' \| 'second')[]` | Marks selected units as optional/muted. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--optional-minute) |
| `showPersianNumber` | `boolean` | Displays Persian digits while the value remains numeric. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--persian-number) |
| `textWidth` | `number \| null` | Sets SVG `textLength` for custom-font alignment. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--text-width) |
| `onLoad` | `(event) => void` | Runs before initialization. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--event-test) |
| `onInit` | `(event) => void` | Runs after initialization. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--event-test) |
| `onChange` | `(event) => void` | Runs when the user changes a time unit. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--event-test) |

## Demo

- [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--normal) for the default picker.
- [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--without-second) for hour/minute-only mode.
- [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker-style--gallery) for style recipes.

## When to use

Use `JBTimePicker` when a React view needs an inline time picker for hour, minute, and optionally second selection. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--normal)

Use `JBTimeInput` when the user should type into a form field and open a picker from that input.

## Value

`value` accepts either an object with `hour`, `minute`, and optional `second`, or a time string such as `"03:10:20"`. Read `event.target.value` from `onChange`; see the [controlled value demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--with-value) and [value interaction demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--value-test).

## Focus a time unit

Use a ref for imperative web-component methods such as focusing a specific time unit when the picker should guide the next edit. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--focused-unit)

## Disable seconds

Set `secondEnabled={false}` for hour/minute-only picking. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--without-second)

```tsx
<JBTimePicker secondEnabled={false} value="03:10" />
```

## Display options

Use `frontalZero`, `optionalUnits`, `showPersianNumber`, and `textWidth` to match the web-component display behavior from React. See the [frontal-zero](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--frontal-zero), [optional-unit](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--optional-minute), [Persian-number](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--persian-number), and [text-width](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--text-width) demos.

## RTL layouts

Place `JBTimePicker` in an RTL container when it is part of a right-to-left interface. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--rtl-sample)

## Events

Use `onLoad` and `onInit` for lifecycle notifications and `onChange` for user edits. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--event-test)

## CSS parts and variables

The React wrapper uses the same CSS parts and variables as the web component. See the [web-component styling guide](../README.md#css-parts-and-variables) and [style gallery](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker-style--gallery).

```css
.compact-time-picker {
  --jb-time-picker-minute-color: #2563eb;
}
```

## Accessibility notes

Provide nearby label text that describes the time being selected; review the [interactive accessibility example](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--normal). Prefer `JBTimeInput` when the time value is part of a larger form and needs a conventional labeled input.

## Shared Documentation

For web-component behavior, events, and CSS variables, see [`jb-time-picker`](https://github.com/javadbat/jb-time-picker).
