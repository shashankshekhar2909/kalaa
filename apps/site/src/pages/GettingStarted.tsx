import { Banner, ButtonLink, Card, CodeBlock, PageHeader } from "@kalaa/react";
import { Layout } from "../Layout";
import { page, sb } from "../config";
import { install, styles, switches, use } from "../snippets";

const attributes: Array<[string, string, string]> = [
  ["data-accent", "neel (default), geru, mayur", "Accent colour and the neutral ramp tinted towards it."],
  ["data-theme", "light, dark (omit to follow the system)", "Colour scheme."],
  ["data-shape", "soft (omit for square)", "Corner radius: 0 by default, 6, 8, 12 and 999px when soft."],
];
export function GettingStarted() {
  return (
    <Layout current="getting-started">
      <div className="site-container site-doc">
        <PageHeader
          title="Get started"
          description="Install the packages, load the styles once, then use components and switch accent, theme and shape with attributes."
          actions={<ButtonLink href={sb("docs", "introduction--docs")}>Open Storybook</ButtonLink>}
        />
        <Banner tone="info" title="v0.1 preview">
          Kalaa is private for now. Packages are vendored as tarballs and are not on npm yet. The tarball flow
          is a decision, not a script, so the file names below are the intended ones.
        </Banner>
        <section aria-labelledby="install-title" className="site-doc__step">
          <h2 id="install-title">1. Install</h2>
          <p>
            Put the two release tarballs in your app&apos;s vendor folder and install them. Kalaa needs React
            19.
          </p>
          <CodeBlock label="Install command" language="bash" code={install} />
        </section>
        <section aria-labelledby="styles-title" className="site-doc__step">
          <h2 id="styles-title">2. Load the styles once</h2>
          <p>
            At your app root, import the fonts, the tokens and the component styles. The fonts are self-hosted
            (IBM Plex Sans, Serif, Mono and Sans Devanagari, SIL Open Font License), so there is no network
            request to a font service.
          </p>
          <CodeBlock label="Style imports" language="tsx" code={styles} />
        </section>
        <section aria-labelledby="use-title" className="site-doc__step">
          <h2 id="use-title">3. Use components</h2>
          <p>
            Components are plain React with <code>kl-</code> prefixed CSS. Native props,{" "}
            <code>className</code> and <code>ref</code> pass through. Every component page in Storybook has
            live controls, props, usage and do and don&apos;t notes.
          </p>
          <CodeBlock label="Component example" language="tsx" code={use} />
        </section>
        <section aria-labelledby="switch-title" className="site-doc__step">
          <h2 id="switch-title">4. Switch accent, theme and shape</h2>
          <p>
            Three plain attributes, on <code>html</code> or on any wrapper. A wrapper that sets{" "}
            <code>data-theme</code> should also set <code>data-accent</code> unless it is Neel.
          </p>
          <CodeBlock label="Accent, theme and shape attributes" language="html" code={switches} />
          <div className="site-cards site-cards--tight">
            {attributes.map(([name, values, text]) => (
              <Card key={name} title={<code>{name}</code>} titleLevel={3}>
                <p className="site-card__text">
                  <strong>{values}</strong>
                </p>
                <p className="site-card__text">{text}</p>
              </Card>
            ))}
          </div>
        </section>
        <section aria-labelledby="next-title" className="site-doc__step">
          <h2 id="next-title">Next</h2>
          <div className="site-row">
            <ButtonLink variant="primary" href={sb("docs", "components-button--docs")}>
              Browse components
            </ButtonLink>
            <ButtonLink href={sb("story", "foundations-colour--roles")}>Foundations</ButtonLink>
            <ButtonLink href={page("brand.html")}>Brand</ButtonLink>
          </div>
        </section>
      </div>
    </Layout>
  );
}
