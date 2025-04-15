import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-time-picker",
    path: "./lib/jb-time-picker.ts",
    outputPath: "./dist/jb-time-picker.js",
    external: ["jb-core"],
    umdName: "JBTimePicker",
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [];