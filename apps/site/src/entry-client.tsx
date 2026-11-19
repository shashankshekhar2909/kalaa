import { hydrateRoot } from "react-dom/client";
import "@kalaa/tokens/fonts.css";
import "@kalaa/tokens/tokens.css";
import "@kalaa/react/styles.css";
import "./site.css";
import { App } from "./App";
import type { PageName } from "./Layout";

const root = document.getElementById("root");
if (root) hydrateRoot(root, <App name={(root.dataset.page ?? "home") as PageName} />);
