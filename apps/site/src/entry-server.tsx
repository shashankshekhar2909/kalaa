import { renderToString } from "react-dom/server";
import { App, pages } from "./App";
import type { PageName } from "./Layout";

export { pages };
export function render(name: PageName) {
  return renderToString(<App name={name} />);
}
