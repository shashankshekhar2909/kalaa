import type { Meta, StoryObj } from "@storybook/react-vite";
import { accents } from "@kalaa/tokens";
import { Logo } from "@kalaa/react";

const files = [
  ["logo-mark.svg", "Mark, for light backgrounds"],
  ["logo-mark-dark.svg", "Mark, for dark backgrounds"],
  ["logo-mono.svg", "Mark, single colour (currentColor)"],
  ["logo-wordmark.svg", "Wordmark, for light backgrounds"],
  ["logo-wordmark-dark.svg", "Wordmark, for dark backgrounds"],
  ["favicon.svg", "Favicon (follows the system colour scheme)"],
  ["favicon.ico", "Favicon, 16 and 32px"],
  ["apple-touch-icon.png", "Apple touch icon, 180px"],
];
function LogoPage() {
  return (
    <main className="foundation">
      <h1>Logo</h1>
      <p>
        The Kalaa square: a square is the moon disc, the frame is the unlit part and the lit part is an
        L-shaped crescent. It reads as a moon phase and as a corner bracket, has no curves and stays legible
        at 16px. The brand colour is Geru, so the logo and favicon files use it; the live component follows
        whichever accent is active.
      </p>
      <h2>Mark and lockup</h2>
      <div className="logo-stage">
        <Logo size={128} />
        <Logo variant="lockup" size={64} />
        <Logo variant="lockup" size={28} />
      </div>
      <p>
        The lockup sets &quot;Kalaa&quot; in IBM Plex Serif 500, sentence case, at three quarters of the mark
        height with a quarter-height gap. The baseline sits on the bottom edge of the L. In Devanagari the
        name is कला.
      </p>
      <h2>Accents</h2>
      <div className="logo-stage">
        {accents.map((accent) => (
          <div key={accent} data-accent={accent} className="stack">
            <Logo size={64} title={`Kalaa logo in ${accent}`} />
            <small>{accent}</small>
          </div>
        ))}
      </div>
      <h2>Sizes</h2>
      <div className="logo-stage">
        {[16, 24, 32, 48].map((size) => (
          <Logo key={size} size={size} title={`Kalaa logo at ${size} pixels`} />
        ))}
      </div>
      <p>
        Minimum size: 16px for the mark, 96px wide for the lockup. At 16px the frame is 1px and the arms 4px.
      </p>
      <h2>Clear space</h2>
      <p>Keep 8 units (one quarter of the mark height) free on every side.</p>
      <div className="logo-stage">
        <span className="clear-space">
          <Logo size={96} title="Kalaa logo with clear space" />
        </span>
      </div>
      <h2>Single colour</h2>
      <div className="logo-stage">
        <Logo size={64} mono title="Kalaa logo, single colour" />
        <Logo variant="lockup" size={48} mono />
      </div>
      <h2>Files</h2>
      <ul>
        {files.map(([file, label]) => (
          <li key={file}>
            <a href={`./brand/${file}`} download>
              {file}
            </a>{" "}
            {label}
          </li>
        ))}
      </ul>
      <h2>Do not</h2>
      <ul>
        <li>Rotate, skew or stretch the mark.</li>
        <li>Add gradients, shadows or outlines.</li>
        <li>Round the corners, or place the mark inside a circle.</li>
        <li>Recolour it outside the accents or the single-colour version.</li>
        <li>Set the name in capitals.</li>
      </ul>
    </main>
  );
}
const meta: Meta = { title: "Foundations/Logo", component: LogoPage };
export default meta;
export const Overview: StoryObj = {};
