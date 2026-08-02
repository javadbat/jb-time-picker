# jb-time-picker

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-time-picker)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-time-picker/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-time-picker)](https://www.npmjs.com/package/jb-time-picker)
![GitHub Created At](https://img.shields.io/github/created-at/javadbat/jb-time-picker)

`jb-time-picker` is a 24-hour SVG time picker web component. Users can drag or tap the wheel text to change hour, minute, and optional second values; see the [default picker demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--normal).

- Uses an object value: `{ hour, minute, second }`.
- Supports hour, minute, and second selection. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--normal)
- Can hide the second unit for hour/minute-only picking. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--without-second)
- Supports Persian digit display while keeping `.value` numeric. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--persian-number)
- Supports optional time units with muted visual style. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--optional-minute)
- Exposes CSS variables and CSS parts for clock customization. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker-style--gallery)

## When to use

Use `jb-time-picker` when users need a visual clock-like picker for time values. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--normal)

Use [`jb-time-input`](https://github.com/javadbat/jb-time-input) when the user should type a time in an input field instead of using the SVG wheel.

## Demo

- [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--normal) for the default picker.
- [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--without-second) for hour/minute-only mode.
- [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--persian-number) for Persian digits.
- [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker-style--gallery) for style recipes and CSS parts.
- [CodePen](https://codepen.io/javadbat/pen/yLgjGdv) for a standalone example.

## React

The package includes a React wrapper. See [`react/README.md`](./react/README.md) and the [React usage demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--normal).

## Installation

```sh
npm i jb-time-picker
```

```js
import 'jb-time-picker';
```

```html
<jb-time-picker></jb-time-picker>
```

### CDN

```html
<script src="https://unpkg.com/jb-time-picker/dist/jb-time-picker.umd.js"></script>
```

## API reference

### Attributes

| name | type | default | description |
| --- | --- | --- | --- |
| `value` | `string` | none | Initial time value. Accepts `HH:mm`, `HH:mm:ss`, or JSON such as `{"hour":3,"minute":10,"second":20`. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--with-value) |
| `second-enabled` | `boolean` | `true` | Shows the second unit. Empty attribute and `"true"` mean true; `"false"` means false. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--without-second) |
| `frontal-zero` | `boolean` | `false` | Displays values below 10 with a leading zero. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--frontal-zero) |
| `optional-units` | `string` | `""` | Comma or space separated list of muted units: `hour`, `minute`, `second`. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--optional-minute) |
| `show-persian-number` | `boolean` | locale based | Displays Persian digits while `.value` remains numeric. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--persian-number) |
| `text-width` | `number` | `null` | SVG `textLength` used to align time text for custom fonts. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--text-width) |

### Properties

| name | type | readonly | description |
| --- | --- | --- | --- |
| `value` | `{ hour: number; minute: number; second?: number }` | no | Current selected time. Values are clamped to valid ranges. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--with-value) |
| `secondEnabled` | `boolean` | no | Shows or hides the second unit. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--without-second) |
| `frontalZero` | `boolean` | no | Displays `02` instead of `2` for values below 10. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--frontal-zero) |
| `optionalUnits` | `Array<'hour' \| 'minute' \| 'second'>` | no | Units shown as optional/muted. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--optional-minute) |
| `showPersianNumber` | `boolean` | no | Displays Persian digits in the SVG text. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--persian-number) |
| `textWidth` | `number \| null` | no | SVG text width used for alignment. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--text-width) |
| `focusedTimeUnit` | `'hour' \| 'minute' \| 'second' \| null` | no | Currently focused unit. Prefer `setTimeUnitFocus()` for updates. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--focused-unit) |

### Methods

| name | returns | description |
| --- | --- | --- |
| `setTimeUnitFocus(timeUnit)` | `void` | Focuses `hour`, `minute`, or `second` so its text and indicator use the active color. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--focused-unit) |

### Events

| event | description |
| --- | --- |
| `load` | Dispatched from `connectedCallback` before initialization. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--event-test) |
| `init` | Dispatched from `connectedCallback` after initialization. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--event-test) |
| `change` | Dispatched when the user changes a time unit. Programmatic `.value` updates do not dispatch `change`. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--event-test) |

## Value

Set and read the time through the `.value` property; see the [controlled value demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--with-value) and [value interaction demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--value-test).

```js
const timePicker = document.querySelector('jb-time-picker');

timePicker.value = { hour: 3, minute: 10, second: 20 };

console.log(timePicker.value); // { hour: 3, minute: 10, second: 20 }
```

In HTML, use a compact string or JSON:

```html
<jb-time-picker value="03:10:20"></jb-time-picker>
<jb-time-picker value='{"hour":3,"minute":10,"second":20}'></jb-time-picker>
```

## Focus a time unit

Use `setTimeUnitFocus()` when an interaction should guide the user to a specific unit. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--focused-unit)

```js
const timePicker = document.querySelector('jb-time-picker');

timePicker.setTimeUnitFocus('hour');
timePicker.setTimeUnitFocus('minute');
timePicker.setTimeUnitFocus('second');
```

## Disable seconds

Use this when the picker should only collect hour and minute. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--without-second)

```html
<jb-time-picker second-enabled="false"></jb-time-picker>
```

```js
document.querySelector('jb-time-picker').secondEnabled = false;
```

## Display options

Use the display properties for leading zeros, optional units, localized digits, and custom text alignment: [frontal zero](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--frontal-zero), [optional unit](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--optional-minute), [Persian digits](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--persian-number), and [text width](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--text-width).

```js
const timePicker = document.querySelector('jb-time-picker');

timePicker.frontalZero = true;
timePicker.optionalUnits = ['second'];
timePicker.showPersianNumber = true;
timePicker.textWidth = 150;
```

```html
<jb-time-picker
  frontal-zero
  optional-units="second"
  show-persian-number
  text-width="150"
></jb-time-picker>
```

`textWidth` is useful when custom fonts make narrow digits such as `1` look visually misaligned with wider digits such as `8`. A practical range is usually `150` to `300`.

## RTL layouts

Place the picker in an RTL container when it is part of a right-to-left interface. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--rtl-sample)

## CSS parts and variables

For complete styling guidance, live examples, official parts, custom states, and copyable style recipes, see [Styling](https://javadbat.github.io/design-system/?path=/docs/components-form-elements-jbtimepicker-styling) and the [style gallery](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker-style--gallery).

```css
jb-time-picker {
  --jb-time-picker-hour-color: #2563eb;
  --jb-time-picker-minute-color: #059669;
  --jb-time-picker-second-color: #dc2626;
}

jb-time-picker::part(outer-circle) {
  opacity: 0.9;
}
```

## Accessibility notes

- The component is an SVG interaction surface, not a native form control. Review the [interactive demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jbtimepicker--normal) when adding an accessible surrounding label.
- It does not currently attach `ElementInternals` or submit a form value automatically.
- Add surrounding labels and summary text in your app when screen-reader users need an accessible time editing flow.

## Related Docs

- See [`jb-time-picker/react`](./react/README.md) for React usage and [`jb-time-input`](https://github.com/javadbat/jb-time-input) for typed time input.
- See [All JB Design System Component List](https://javadbat.github.io/design-system/) for more components.
- Use [Contribution Guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) if you want to contribute to this component.

## AI agent notes

- Import `jb-time-picker` once before using `<jb-time-picker>`.
- Use `.value` as the canonical API; it is an object, not a string.
- Use `value="HH:mm:ss"` or a JSON string only for initial markup.
- Use `secondEnabled = false` or `second-enabled="false"` for hour/minute-only picking.
- Use `setTimeUnitFocus('hour' | 'minute' | 'second')` to change the focused unit.
- Listen to `change` for user edits. Programmatic `.value` updates are silent.
- This package includes [`custom-elements.json`](./custom-elements.json) and points to it with the package.json `customElements` field. The field is documented by the Custom Elements Manifest project in [Referencing manifests from npm packages](https://github.com/webcomponents/custom-elements-manifest#referencing-manifests-from-npm-packages).
- In `custom-elements.json`, `exports.kind: "js"` describes JavaScript/TypeScript exports and `exports.kind: "custom-element-definition"` maps the `jb-time-picker` tag name to `JBTimePickerWebComponent`.
