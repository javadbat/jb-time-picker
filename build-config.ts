import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-time-picker",
    path: "./lib/jb-time-picker.ts",
    outputPath: "./dist/jb-time-picker.js",
    external: ["jb-core", "jb-core/i18n", "jb-core/theme"],
    umdName: "JBTimePicker",
    globals: {
      "jb-core": "JBCore",
      "jb-core/i18n": "JBCoreI18N",
      "jb-core/theme": "JBCoreTheme",
    },
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [];