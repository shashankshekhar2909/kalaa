import type { Meta, StoryObj } from "@storybook/react-vite";
import { accents } from "@kalaa/tokens";
import { Badge, Button } from "@kalaa/react";
import { RoleGrid } from "./contrast";

const names: Record<string, string> = {
  neel: "Neel · indigo",
  geru: "Geru · red ochre",
  mayur: "Mayur · peacock teal",
};
const notes: Record<string, string> = {
  neel: "The default for apps.",
  geru: "The brand colour outside apps (logo, favicon).",
  mayur: "A calm alternative.",
};
function Colour() {
  return (
    <main className="foundation">
      <h1>Colour</h1>
      <p>
        Semantic roles and their contrast against paired colours in the active theme. Components use roles,
        never the palette. The same pairs are checked at build time: text pairs need 4.5:1, UI pairs 3:1.
      </p>
      <RoleGrid />
    </main>
  );
}
function Accents() {
  return (
    <main className="foundation">
      <h1>Accents</h1>
      <p>
        Each accent has a neutral ramp biased towards its hue, so the whole surface family shifts, not just
        the buttons. Set <code>data-accent</code> on <code>html</code> or on any wrapper.
      </p>
      {accents.map((accent) => (
        <section key={accent} data-accent={accent} className="accent-panel">
          <h2>{names[accent]}</h2>
          <p>{notes[accent]}</p>
          <div className="row">
            <Button variant="primary">Save changes</Button>
            <Button>Preview</Button>
            <Badge tone="info">Imported</Badge>
          </div>
          <RoleGrid />
        </section>
      ))}
    </main>
  );
}
const meta: Meta = { title: "Foundations/Colour", component: Colour };
export default meta;
export const Roles: StoryObj = {};
export const AccentsSideBySide: StoryObj = { name: "Accents", render: () => <Accents /> };
