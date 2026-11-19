import type { ReactNode } from "react";
import {
  Banner,
  Badge,
  Button,
  ButtonLink,
  Card,
  Checkbox,
  CodeBlock,
  Field,
  Input,
  KeyValue,
  Logo,
  Select,
  StatusBadge,
  Switch,
  Tabs,
} from "@kalaa/react";
import { accents, type Accent, type Mode } from "@kalaa/tokens";
import { facts, page, sb } from "./config";
import { ratio } from "./contrast";
import { install, styles, switches, use } from "./snippets";

export function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="site-section" aria-labelledby={`${id}-title`}>
      <div className="site-container">
        <h2 id={`${id}-title`} className="site-section__title">
          {title}
        </h2>
        {intro && <p className="site-section__intro">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/** The product fragment from the hero: built only from Kalaa components. */
export function ProductFragment({ idPrefix }: { idPrefix: string }) {
  return (
    <Card
      title="Cold-pressed mustard oil 1 L"
      titleLevel={2}
      actions={<StatusBadge status="needs review" />}
      className="site-fragment"
    >
      <Field label="Price (₹)" error="Price must be greater than zero.">
        <Input id={`${idPrefix}-price`} defaultValue="0" inputMode="decimal" />
      </Field>
      <Banner tone="warning" title="1 field needs attention">
        Fix the price before this product can be approved.
      </Banner>
      <div className="site-row">
        <Button variant="primary">Save changes</Button>
        <Button>Preview</Button>
      </div>
    </Card>
  );
}

export function Hero() {
  const quality = facts.quality
    ? facts.quality.failed === 0
      ? `${facts.quality.scans} scans, 0 violations (${facts.quality.at})`
      : `${facts.quality.failed} of ${facts.quality.scans} scans failing (${facts.quality.at})`
    : "Not run for this build";
  return (
    <section className="site-hero" aria-labelledby="hero-title">
      <div className="site-container site-hero__inner">
        <div className="site-hero__copy">
          <p className="site-hero__kicker">Kalaa · design system v{facts.version}, private preview</p>
          <h1 id="hero-title" className="site-hero__title">
            Square, calm, and built for work.
          </h1>
          <p className="site-hero__lede">
            Kalaa is a design system for operational software. Accessible React components and design tokens
            with sharp corners, Indian-pigment accents and IBM Plex type.
          </p>
          <div className="site-row">
            <ButtonLink variant="primary" href={page("getting-started.html")}>
              Get started
            </ButtonLink>
            <ButtonLink href={sb("docs", "introduction--docs")}>Open Storybook</ButtonLink>
          </div>
          <KeyValue
            layout="grid"
            className="site-facts"
            aria-label="Facts about this build"
            items={[
              { label: "Components", value: `${facts.components}` },
              { label: "Accents and themes", value: `${facts.accents} accents, light and dark` },
              { label: "Contrast checks", value: `${facts.contrastChecks} at WCAG AA` },
              { label: "Axe scans (stories)", value: quality },
            ]}
          />
        </div>
        <div className="site-hero__demo" aria-label="Example product editor built with Kalaa">
          <ProductFragment idPrefix="hero" />
        </div>
      </div>
    </section>
  );
}

const different: Array<[string, string, string, string]> = [
  [
    "Square by default",
    "Corners are sharp: radius tokens are 0. The 1px border, the Banner start border and the selected tab carry the identity. Soft is a supported mode.",
    "Shape",
    sb("story", "foundations-shape--square-and-soft"),
  ],
  [
    "Three pigment accents",
    "Neel, Geru and Mayur. Each has a neutral ramp tinted towards its hue, so whole surfaces shift, not only buttons.",
    "Accents",
    sb("story", "foundations-colour--accents-side-by-side"),
  ],
  [
    "Contrast is a build gate",
    `${facts.contrastChecks} role pairs are checked against WCAG AA on every build. Below AA the build fails; anchor colours are never quietly adjusted.`,
    "Colour roles",
    sb("story", "foundations-colour--roles"),
  ],
  [
    "Devanagari and numbers",
    "IBM Plex Sans with IBM Plex Sans Devanagari behind it, self-hosted. Figures are tabular so columns line up.",
    "Typography",
    sb("story", "foundations-typography--scale"),
  ],
  [
    "Tokens first",
    "DTCG JSON resolved into CSS custom properties, JSON and TypeScript. Components use only var(--kalaa-*); a script enforces it.",
    "Introduction",
    sb("docs", "introduction--docs"),
  ],
  [
    "Tested in both themes",
    "Every story is scanned with axe and compared with a screenshot in light and dark. Reduced motion drops durations to zero.",
    "Components",
    sb("docs", "components-button--docs"),
  ],
];
export function Different() {
  return (
    <Section id="different" title="What makes Kalaa different">
      <div className="site-cards">
        {different.map(([title, text, link, href]) => (
          <Card key={title} title={title} titleLevel={3}>
            <p className="site-card__text">{text}</p>
            <div>
              <ButtonLink variant="ghost" size="sm" href={href}>
                {link}
              </ButtonLink>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function SmallForm({ idPrefix }: { idPrefix: string }) {
  return (
    <div className="site-form">
      <Field label="Product title">
        <Input id={`${idPrefix}-title`} defaultValue="Cold-pressed mustard oil 1 L" />
      </Field>
      <Field label="Category">
        <Select
          id={`${idPrefix}-category`}
          defaultValue="oils"
          options={[
            { value: "oils", label: "Cooking oils" },
            { value: "grains", label: "Rice and grains" },
          ]}
        />
      </Field>
      <Checkbox label="Show on storefront" defaultChecked />
      <Switch label="Track stock" defaultChecked />
      <div className="site-row">
        <Button variant="primary">Save changes</Button>
        <Button>Cancel</Button>
      </div>
    </div>
  );
}
export function Sharp() {
  return (
    <Section id="sharp" title="Sharp by design" intro="Same components, one attribute.">
      <div className="site-pair">
        <Card title="Square (default)" titleLevel={3} description="No attribute needed.">
          <SmallForm idPrefix="sq" />
        </Card>
        <div data-shape="soft">
          <Card title="Soft" titleLevel={3} description={<code>data-shape=&quot;soft&quot;</code>}>
            <SmallForm idPrefix="soft" />
          </Card>
        </div>
      </div>
    </Section>
  );
}

const pigments: Record<Accent, [string, string]> = {
  neel: ["Neel · indigo", "The default for apps."],
  geru: ["Geru · red ochre", "The brand colour."],
  mayur: ["Mayur · peacock teal", "A calm alternative."],
};
function Pair({
  accent,
  a,
  b,
}: {
  accent: Accent;
  a: Parameters<typeof ratio>[2];
  b: Parameters<typeof ratio>[3];
}) {
  const modes: Mode[] = ["light", "dark"];
  return <>{modes.map((m) => `${m} ${ratio(accent, m, a, b)}:1`).join(" · ")}</>;
}
export function Pigments() {
  return (
    <Section
      id="pigments"
      title="Three pigments"
      intro="Switch the accent in the header, or scope it to any wrapper with data-accent."
    >
      <div className="site-cards">
        {accents.map((accent) => (
          <div key={accent} data-accent={accent}>
            <Card title={pigments[accent][0]} titleLevel={3} description={pigments[accent][1]}>
              <div className="site-swatches" aria-hidden="true">
                {["accent", "accent-hover", "accent-soft", "bg", "surface-alt", "text"].map((role) => (
                  <span key={role} className="site-swatch" style={{ background: `var(--kalaa-${role})` }} />
                ))}
              </div>
              <KeyValue
                items={[
                  { label: "Accent on page", value: <Pair accent={accent} a="accent" b="bg" /> },
                  { label: "Text on accent", value: <Pair accent={accent} a="on-accent" b="accent" /> },
                  {
                    label: "Muted text on surface",
                    value: <Pair accent={accent} a="text-muted" b="surface" />,
                  },
                ]}
              />
              <div className="site-row">
                <Button variant="primary">Save changes</Button>
                <Badge tone="info">Imported</Badge>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Catalog() {
  return (
    <Section
      id="catalog"
      title="Made for catalog and ops work"
      intro="Latin and Devanagari text, rupee amounts and counts, with tabular figures."
    >
      <Card title="Product record" titleLevel={3} actions={<StatusBadge status="approved" />}>
        <KeyValue
          items={[
            { label: "Name", value: <span lang="hi">सरसों का तेल 1 लीटर</span> },
            { label: "English name", value: "Cold-pressed mustard oil 1 L" },
            { label: "Price", value: "₹ 245" },
            { label: "Stock", value: "1,234 units" },
            { label: "Category", value: <span lang="hi">खाद्य तेल</span> },
          ]}
        />
      </Card>
    </Section>
  );
}

export function GetStarted() {
  return (
    <Section id="start" title="Get started">
      <Banner tone="info" title="v0.1 preview">
        Kalaa is private for now. Packages are vendored as tarballs and are not on npm yet.
      </Banner>
      <Tabs
        variant="underline"
        aria-label="Get started steps"
        items={[
          {
            value: "install",
            label: "Install",
            content: <CodeBlock label="Install command" language="bash" code={install} />,
          },
          {
            value: "use",
            label: "Use",
            content: (
              <div className="site-stack">
                <CodeBlock label="Style imports" language="tsx" code={styles} />
                <CodeBlock label="Component example" language="tsx" code={use} />
              </div>
            ),
          },
          {
            value: "switch",
            label: "Switch",
            content: <CodeBlock label="Accent, theme and shape attributes" language="html" code={switches} />,
          },
        ]}
      />
      <div className="site-row">
        <ButtonLink variant="primary" href={page("getting-started.html")}>
          Read the full guide
        </ButtonLink>
      </div>
    </Section>
  );
}

export { Logo };
