import { useEvent } from "jb-core/react";
import type { EventTypeWithTarget } from "jb-core";
import type { RefObject } from "react";
import type { JBTimePickerWebComponent } from "jb-time-picker";

export type JBTimePickerEventType<TEvent> = EventTypeWithTarget<TEvent, JBTimePickerWebComponent>;

export type EventProps = {
  /**
   * when component loaded, in most cases component is already loaded before react mount so you dont need this but if you load web-component dynamically with lazy load it will be called after react mount
   */
  onLoad?: (e: JBTimePickerEventType<CustomEvent>) => void,
  /**
   * when all property set and ready to use, in most cases component is already loaded before react mount so you dont need this but if you load web-component dynamically with lazy load it will be called after react mount
   */
  onInit?: (e: JBTimePickerEventType<CustomEvent>) => void,
  onChange?: (e: JBTimePickerEventType<Event>) => void,
}

export function useEvents(element: RefObject<JBTimePickerWebComponent | null>, props: EventProps) {
  useEvent(element, "load", props.onLoad, true);
  useEvent(element, "init", props.onInit, true);
  useEvent(element, "change", props.onChange);
}
