# jb-time-picker

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-time-picker)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-time-picker/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-time-picker)](https://www.npmjs.com/package/jb-time-picker)
![GitHub Created At](https://img.shields.io/github/created-at/javadbat/jb-time-picker)

`jb-time-picker` is a 24-hour SVG time picker web component. Users can drag or tap the wheel text to change hour, minute, and optional second values.

- Uses an object value: `{ hour, minute, second }`.
- Supports hour, minute, and second selection.
- Can hide the second unit for hour/minute-only picking.
- Supports Persian digit display while keeping `.value` numeric.
- Supports optional time units with muted visual style.
- Exposes CSS variables and CSS parts for clock customization.

## When to use

Use `jb-time-picker` when users need a visual clock-like picker for time values.

Use [`jb-time-input`](https://github.com/javadbat/jb-time-input) when the user should type a time in an input field instead of using the SVG wheel.

## Demo

- [CodePen](https://codepen.io/javadbat/pen/yLgjGdv)
- [Storybook](https://javadbat.github.io/design-system/?path=/docs/components-jbtimepicker)

## React

A React wrapper is not available yet. Use the web component directly in React and see [`react/README.md`](./react/README.md) for current notes.

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
| `value` | `string` | none | Initial time value. Accepts `HH:mm`, `HH:mm:ss`, or JSON such as `{"hour":3,"minute":10,"second":20}`. |
| `second-enabled` | `boolean` | `true` | Shows the second unit. Empty attribute and `"true"` mean true; `"false"` means false. |
| `frontal-zero` | `boolean` | `false` | Displays values below 10 with a leading zero. |
| `optional-units` | `string` | `""` | Comma or space separated list of muted units: `hour`, `minute`, `second`. |
| `show-persian-number` | `boolean` | locale based | Displays Persian digits while `.value` remains numeric. |
| `text-width` | `number` | `null` | SVG `textLength` used to align time text for custom fonts. |

### Properties

| name | type | readonly | description |
| --- | --- | --- | --- |
| `value` | `{ hour: number; minute: number; second?: number }` | no | Current selected time. Values are clamped to valid ranges. |
| `secondEnabled` | `boolean` | no | Shows or hides the second unit. |
| `frontalZero` | `boolean` | no | Displays `02` instead of `2` for values below 10. |
| `optionalUnits` | `Array<'hour' \| 'minute' \| 'second'>` | no | Units shown as optional/muted. |
| `showPersianNumber` | `boolean` | no | Displays Persian digits in the SVG text. |
| `textWidth` | `number \| null` | no | SVG text width used for alignment. |
| `focusedTimeUnit` | `'hour' \| 'minute' \| 'second' \| null` | no | Currently focused unit. Prefer `setTimeUnitFocus()` for updates. |

### Methods

| name | returns | description |
| --- | --- | --- |
| `setTimeUnitFocus(timeUnit)` | `void` | Focuses `hour`, `minute`, or `second` so its text and indicator use the active color. |

### Events

| event | description |
| --- | --- |
| `load` | Dispatched from `connectedCallback` before initialization. |
| `init` | Dispatched from `connectedCallback` after initialization. |
| `change` | Dispatched when the user changes a time unit. Programmatic `.value` updates do not dispatch `change`. |

## Value

Set and read the time through the `.value` property.

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

```js
const timePicker = document.querySelector('jb-time-picker');

timePicker.setTimeUnitFocus('hour');
timePicker.setTimeUnitFocus('minute');
timePicker.setTimeUnitFocus('second');
```

## Disable seconds

Use this when the picker should only collect hour and minute.

```html
<jb-time-picker second-enabled="false"></jb-time-picker>
```

```js
document.querySelector('jb-time-picker').secondEnabled = false;
```

## Display options

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

## CSS parts and variables

| part | description |
| --- | --- |
| `wrapper` | Root wrapper inside the shadow DOM. |
| `clock` | SVG clock element. |
| `outer-circle` | Outer SVG circle. |
| `inner-circle` | Inner SVG circle. |
| `time-indicators` | Wrapper around hour, minute, and second indicators. |

| CSS variable name | description |
| --- | --- |
| `--jb-time-picker-hour-color` | Focused hour text and indicator color. |
| `--jb-time-picker-minute-color` | Focused minute text and indicator color. |
| `--jb-time-picker-second-color` | Focused second text and indicator color. |
| `--jb-time-picker-outer-circle-color` | Outer clock circle color. |
| `--jb-time-picker-inner-circle-color` | Inner clock circle color. |
| `--jb-time-picker-separator-text-color` | Separator text color. |
| `--jb-time-picker-indicator-color` | Default indicator color. |
| `--jb-time-picker-prev-text-color` | Previous value text color. |
| `--jb-time-picker-current-text-color` | Current value text color. |
| `--jb-time-picker-next-text-color` | Next value text color. |

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

- The component is an SVG interaction surface, not a native form control.
- It does not currently attach `ElementInternals` or submit a form value automatically.
- Add surrounding labels and summary text in your app when screen-reader users need an accessible time editing flow.

## Related Docs

- See [`jb-time-input`](https://github.com/javadbat/jb-time-input) for typed time input.
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
