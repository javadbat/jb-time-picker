import type { JBTimePickerValueObject, JBTimePickerWebComponent, TimeUnits } from "jb-time-picker";
import { type RefObject, useEffect } from "react";

export type JBTimePickerAttributes = {
  value?: JBTimePickerValueObject | string | null,
  secondEnabled?: boolean,
  frontalZero?: boolean,
  optionalUnits?: TimeUnits[] | null,
  showPersianNumber?: boolean,
  textWidth?: number | null,
}

export function useJBTimePickerAttribute(element: RefObject<JBTimePickerWebComponent | null>, props: JBTimePickerAttributes) {
  useEffect(() => {
    if (!element.current || props.value === undefined || props.value === null) {
      return;
    }
    if (typeof props.value === "string") {
      element.current.setAttribute("value", props.value);
    } else {
      element.current.value = props.value;
    }
  }, [props.value, element]);

  useEffect(() => {
    if (element.current && props.secondEnabled !== null && props.secondEnabled !== undefined) {
      element.current.secondEnabled = props.secondEnabled;
    }
  }, [props.secondEnabled, element]);

  useEffect(() => {
    if (element.current && typeof props.frontalZero == "boolean") {
      element.current.frontalZero = props.frontalZero;
    }
  }, [props.frontalZero, element]);

  useEffect(() => {
    if (element.current && Array.isArray(props.optionalUnits)) {
      element.current.optionalUnits = props.optionalUnits;
    }
  }, [props.optionalUnits, element]);

  useEffect(() => {
    if (element.current && props.showPersianNumber !== null && props.showPersianNumber !== undefined) {
      element.current.showPersianNumber = props.showPersianNumber;
    }
  }, [props.showPersianNumber, element]);

  useEffect(() => {
    if (element.current && props.textWidth !== undefined) {
      element.current.textWidth = props.textWidth ?? null;
    }
  }, [props.textWidth, element]);
}
