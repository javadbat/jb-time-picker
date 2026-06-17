# JBTimePicker React notes

The React wrapper is not available yet. If you need it, please open an issue in [`jb-time-picker`](https://github.com/javadbat/jb-time-picker/issues).

For current usage, import and render the web component directly:

```jsx
import 'jb-time-picker';

export function TimePickerSample() {
  return <jb-time-picker value="03:10:20"></jb-time-picker>;
}
```

To set object properties such as `.value`, use a ref:

```jsx
import { useEffect, useRef } from 'react';
import 'jb-time-picker';

export function TimePickerSample() {
  const timePickerRef = useRef(null);

  useEffect(() => {
    timePickerRef.current.value = { hour: 3, minute: 10, second: 20 };
  }, []);

  return <jb-time-picker ref={timePickerRef}></jb-time-picker>;
}
```

## Demo

- [Storybook](https://javadbat.github.io/design-system/?path=/docs/components-jbtimepicker)

## Shared Documentation

For web-component behavior, events, and CSS variables, see [`jb-time-picker`](https://github.com/javadbat/jb-time-picker).
