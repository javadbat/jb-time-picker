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
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-time-picker-react",
    path: "./react/lib/JBTimePicker.tsx",
    outputPath: "./react/dist/JBTimePicker.js",
    external: ["react", "jb-time-picker", "jb-core", "jb-core/react"],
    globals: {
      react: "React",
      "jb-time-picker": "JBTimePicker",
      "jb-core": "JBCore",
      "jb-core/react": "JBCoreReact",
    },
    umdName: "JBTimePickerReact",
    dir: "./react"
  },
];
