'use client'
import React, { useImperativeHandle, useRef } from "react";
import "jb-time-picker";
// eslint-disable-next-line no-duplicate-imports
import type { JBTimePickerValueObject, JBTimePickerWebComponent, TimeUnits } from "jb-time-picker";
import type { JBElementStandardProps } from "jb-core/react";
import { useJBTimePickerAttribute, type JBTimePickerAttributes } from "./attributes-hook.js";
import { type EventProps, useEvents, type JBTimePickerEventType } from "./events-hook.js";
import "./module-declaration.js";

export type { JBTimePickerValueObject, JBTimePickerWebComponent, TimeUnits, JBTimePickerEventType };
export { useEvents, useJBTimePickerAttribute, type EventProps, type JBTimePickerAttributes };

// eslint-disable-next-line react/display-name
const JBTimePicker = React.forwardRef((props: Props, ref) => {
  const element = useRef<JBTimePickerWebComponent>(null);
  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );

  const { onChange, onInit, onLoad, frontalZero, optionalUnits, secondEnabled, showPersianNumber, textWidth, value, children, ...otherProps } = props;
  useEvents(element, { onChange, onInit, onLoad });
  useJBTimePickerAttribute(element, { frontalZero, optionalUnits, secondEnabled, showPersianNumber, textWidth, value });

  return (
    <jb-time-picker ref={element} {...otherProps}>
      {children}
    </jb-time-picker>
  );
});

JBTimePicker.displayName = "JBTimePicker";

export type Props = EventProps & JBTimePickerAttributes & JBElementStandardProps<JBTimePickerWebComponent, keyof (EventProps & JBTimePickerAttributes)>;
export { JBTimePicker };
