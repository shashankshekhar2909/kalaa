import { ButtonLink, Card, KeyValue, Logo, PageHeader } from "@kalaa/react";
import { accents } from "@kalaa/tokens";
import { Layout } from "../Layout";
import { asset, sb } from "../config";

const files: Array<[string, string]> = [
  ["logo-mark.svg", "Mark, for light backgrounds"],
  ["logo-mark-dark.svg", "Mark, for dark backgrounds"],
  ["logo-mono.svg", "Mark, single colour (currentColor)"],
  ["logo-wordmark.svg", "Wordmark, for light backgrounds"],
  ["logo-wordmark-dark.svg", "Wordmark, for dark backgrounds"],
  ["favicon.svg", "Favicon (follows the system colour scheme)"],
  ["favicon.ico", "Favicon, 16 and 32px"],
  ["apple-touch-icon.png", "Apple touch icon, 180px"],
];
const names: Record<string, string> = {
  neel: "Neel · indigo",
  geru: "Geru · red ochre",
  mayur: "Mayur · peacock teal",
};
const roles: Record<string, string> = {
  neel: "The default for apps.",
  geru: "The brand colour: logo, favicon and this site's identity outside apps.",
  mayur: "A calm alternative.",
};
export function Brand() {
  return (
    <Layout current="brand">
      <div className="site-container site-doc">
        <PageHeader
          variant="brand"
          title="Brand"
          description="The logo, the three accents, the shape rules and the voice."
          actions={
            <ButtonLink href={sb("story", "foundations-logo--overview")}>Logo in Storybook</ButtonLink>
          }
        />
        <section aria-labelledby="logo-title" className="site-doc__step">
          <h2 id="logo-title">Logo</h2>
          <p>
            A square is the moon disc. The frame is the unlit part and the lit part is an L-shaped crescent,
            so it reads as a moon phase and as a corner bracket. No curves, fills only, legible at 16px. The
            files use Geru, the brand colour; the live logo on this page follows the accent you pick.
          </p>
          <div className="site-stage">
            <Logo size={120} />
            <Logo variant="lockup" size={64} />
            <span lang="hi" className="site-stage__hindi">
              कला
            </span>
          </div>
          <div className="site-pair">
            <Card title="Rules" titleLevel={3}>
              <KeyValue
                items={[
                  { label: "Minimum size", value: "16px mark, 96px wide lockup" },
                  { label: "Clear space", value: "8 units, one quarter of the mark height" },
                  {
                    label: "Wordmark",
                    value: "IBM Plex Serif 500, sentence case, three quarters of the mark height",
                  },
                  { label: "Single colour", value: "Both parts use one colour (currentColor)" },
                ]}
              />
            </Card>
            <Card title="Do not" titleLevel={3}>
              <ul className="site-list">
                <li>Rotate, skew or stretch the mark.</li>
                <li>Add gradients, shadows or outlines.</li>
                <li>Round the corners or place it in a circle.</li>
                <li>Recolour it outside the accents or the single-colour version.</li>
                <li>Set the name in capitals. Soft shape does not change the logo.</li>
              </ul>
            </Card>
          </div>
          <Card
            title="Downloads"
            titleLevel={3}
            description="SVG, ICO and PNG files. Geru colours, checked for 3:1 contrast."
          >
            <ul className="site-list site-list--files">
              {files.map(([file, label]) => (
                <li key={file}>
                  <a href={asset(file)} download>
                    {file}
                  </a>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
        <section aria-labelledby="accent-title" className="site-doc__step">
          <h2 id="accent-title">Accents</h2>
          <p>
            Neel is the default accent for apps. Geru is the brand colour outside apps. Mayur is the calm
            alternative. Use one accent per screen; status colours are for status only.
          </p>
          <div className="site-cards">
            {accents.map((accent) => (
              <div key={accent} data-accent={accent}>
                <Card title={names[accent]} titleLevel={3} description={roles[accent]}>
                  <Logo size={48} title={`Kalaa logo in ${accent}`} />
                  <div className="site-swatches" aria-hidden="true">
                    {["accent", "accent-hover", "accent-soft", "bg", "surface-alt", "text"].map((role) => (
                      <span
                        key={role}
                        className="site-swatch"
                        style={{ background: `var(--kalaa-${role})` }}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>
        <section aria-labelledby="shape-title" className="site-doc__step">
          <h2 id="shape-title">Shape</h2>
          <ul className="site-list">
            <li>Square is the default: radius 0. The 1px border carries the shape; keep borders crisp.</li>
            <li>
              Soft (<code>data-shape=&quot;soft&quot;</code>) is a supported long-term mode: 6, 8, 12 and
              999px.
            </li>
            <li>Use radius tokens only. A full circle (spinner) uses radius-full, always 999px.</li>
          </ul>
        </section>
        <section aria-labelledby="voice-title" className="site-doc__step">
          <h2 id="voice-title">Voice and type</h2>
          <div className="site-pair">
            <Card title="Voice" titleLevel={3}>
              <ul className="site-list">
                <li>Sentence case for every label, heading and button.</li>
                <li>Buttons are verbs: Save changes, Approve, Add product.</li>
                <li>No trailing colons in labels and no ALL-CAPS letter-spaced text.</li>
                <li>Say what happened and what to do next.</li>
              </ul>
            </Card>
            <Card title="Type" titleLevel={3}>
              <ul className="site-list">
                <li>IBM Plex Sans for interface text, with tabular figures.</li>
                <li>IBM Plex Serif for headings and the brand.</li>
                <li>IBM Plex Mono for code.</li>
                <li>
                  IBM Plex Sans Devanagari for Hindi: <span lang="hi">सरसों का तेल 1 लीटर</span>.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
