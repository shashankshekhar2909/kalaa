import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { accentSwatches, appearanceOptions } from "@kalaa/tokens";
import "@kalaa/tokens/theme.js";
import "@kalaa/tokens/theme-picker.js";
import { AppearanceMenu, Badge, Card, CodeBlock, KeyValue, useAppearance } from "@kalaa/react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "kalaa-theme-picker": DetailedHTMLProps<HTMLAttributes<HTMLElement> & { label?: string }, HTMLElement>;
    }
  }
}

type AppearancePageProps = {
  /** Accessible label for both the React menu and the web component trigger. */
  label?: string;
};

const reactSnippet = `import { AppearanceMenu } from "@kalaa/react";
import { appearanceScript } from "@kalaa/tokens/appearance-script";

// 1. In your root server layout <head>:
<script dangerouslySetInnerHTML={{ __html: appearanceScript }} />

// 2. Anywhere in your app header or sidebar:
<AppearanceMenu />`;

const htmlSnippet = `<head>
  <link rel="stylesheet" href="/vendor/kalaa/tokens.css">
  <link rel="stylesheet" href="/vendor/kalaa/fonts.css">
  <script src="/vendor/kalaa/theme.js"></script>
  <script src="/vendor/kalaa/theme-picker.js" defer></script>
</head>
<body>
  <kalaa-theme-picker label="Appearance"></kalaa-theme-picker>
</body>`;

function AppearanceOverview({ label = "Appearance" }: AppearancePageProps) {
  const { appearance } = useAppearance();

  return (
    <main className="foundation">
      <h1>Appearance</h1>
      <p>
        Every Kalaa app shares three appearance options: colour mode (<code>auto</code>, <code>light</code>,{" "}
        <code>dark</code>), accent palette (<code>neel</code>, <code>geru</code>, <code>mayur</code>) and
        corner shape (<code>square</code>, <code>soft</code>). Choices persist in <code>localStorage</code>{" "}
        under <code>&quot;kalaa.theme&quot;</code> and apply via <code>data-theme</code>,{" "}
        <code>data-accent</code> and <code>data-shape</code> on <code>&lt;html&gt;</code>.
      </p>

      <div className="shape-pair">
        <Card
          title="React component"
          description="@kalaa/react — AppearanceMenu + useAppearance()"
          titleLevel={2}
        >
          <div className="stack">
            <p>
              Built from Kalaa <code>Popover</code> and <code>RadioGroup</code> with palette swatch dots and
              keyboard roving focus.
            </p>
            <div className="row">
              <AppearanceMenu label={label} />
              <Badge tone="info">{`Active: ${appearance.theme} · ${appearance.accent} · ${appearance.shape}`}</Badge>
            </div>
            <CodeBlock language="tsx" code={reactSnippet} />
          </div>
        </Card>

        <Card
          title="Web component"
          description="@kalaa/tokens/theme.js + @kalaa/tokens/theme-picker.js"
          titleLevel={2}
        >
          <div className="stack">
            <p>
              Framework-free custom element (<code>&lt;kalaa-theme-picker&gt;</code>) styled with Shadow DOM
              and Kalaa tokens for plain-HTML pages.
            </p>
            <div className="row">
              <kalaa-theme-picker label={label} />
              <Badge tone="neutral">Shadow DOM · keyboard ready</Badge>
            </div>
            <CodeBlock language="html" code={htmlSnippet} />
          </div>
        </Card>
      </div>

      <h2>Shared contract</h2>
      <KeyValue
        items={[
          {
            label: "Storage key",
            value: <code>localStorage.getItem(&quot;kalaa.theme&quot;)</code>,
          },
          {
            label: "Theme options",
            value: appearanceOptions.theme.join(" · "),
          },
          {
            label: "Accent swatches",
            value: appearanceOptions.accent.map((a) => `${a} (${accentSwatches[a]})`).join(" · "),
          },
          {
            label: "Corner shapes",
            value: appearanceOptions.shape.join(" · "),
          },
        ]}
      />
    </main>
  );
}

const meta: Meta<typeof AppearanceOverview> = {
  title: "Foundations/Appearance",
  component: AppearanceOverview,
  args: {
    label: "Appearance",
  },
  argTypes: {
    label: { control: "text" },
  },
};

export default meta;
export const Overview: StoryObj<typeof AppearanceOverview> = {};
