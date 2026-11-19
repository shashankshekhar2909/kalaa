import { Home } from "./pages/Home";
import { GettingStarted } from "./pages/GettingStarted";
import { Brand } from "./pages/Brand";
import { NotFound } from "./pages/NotFound";
import type { PageName } from "./Layout";

export const pages: Record<
  PageName,
  { component: () => React.JSX.Element; title: string; description: string; file: string }
> = {
  home: {
    component: Home,
    file: "index.html",
    title: "Kalaa: a square, calm design system for operational software",
    description:
      "Kalaa is a design system for operational software: accessible React components and design tokens with sharp corners, Indian-pigment accents and IBM Plex type.",
  },
  "getting-started": {
    component: GettingStarted,
    file: "getting-started.html",
    title: "Get started | Kalaa",
    description:
      "Install Kalaa, load the styles once, use components and switch accent, theme and shape with attributes.",
  },
  brand: {
    component: Brand,
    file: "brand.html",
    title: "Brand | Kalaa",
    description: "The Kalaa logo and downloads, the three accents, shape rules and voice.",
  },
  "not-found": {
    component: NotFound,
    file: "404.html",
    title: "Page not found | Kalaa",
    description: "This page does not exist.",
  },
};
export function App({ name }: { name: PageName }) {
  const Page = pages[name].component;
  return <Page />;
}
