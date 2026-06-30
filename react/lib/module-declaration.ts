import type { JBTimePickerWebComponent } from "jb-time-picker";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "jb-time-picker": JBTimePickerType;
    }
    interface JBTimePickerType extends React.DetailedHTMLProps<React.HTMLAttributes<JBTimePickerWebComponent>, JBTimePickerWebComponent> {
      "value"?: string,
      "second-enabled"?: string,
      "frontal-zero"?: string,
      "optional-units"?: string,
      "show-persian-number"?: string,
      "text-width"?: string,
    }
  }
}
