import { JBDictionary } from "jb-core/i18n";

export type JBTimePickerDictionary = {
  timePicker: string;
};

export const dictionary = new JBDictionary<JBTimePickerDictionary>({
  fa: { timePicker: "انتخاب زمان" },
  en: { timePicker: "Time picker" },
});
