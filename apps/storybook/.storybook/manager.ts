import { addons } from "storybook/manager-api";
import { kalaaTheme } from "./kalaa-theme";

// The manager theme follows the system colour scheme at load. The Theme toolbar item switches the preview only.
addons.setConfig({ theme: kalaaTheme(), sidebar: { showRoots: true } });
