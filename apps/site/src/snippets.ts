// Code samples shown on the Home and Get started pages. Kept in one place so both pages say the same thing.
export const install = `# Today: release tarballs from scripts/release-pack.sh, vendored into your app
pnpm add ./vendor/kalaa-tokens-0.3.1.tgz ./vendor/kalaa-react-0.3.2.tgz

# Or post-publish from npm:
# npm install @kalaa/react @kalaa/tokens`;

export const styles = `import "@kalaa/tokens/tokens.css"; // colour, type, space, shape, motion
import "@kalaa/tokens/fonts.css";  // IBM Plex, self-hosted
import "@kalaa/react/styles.css";   // component styles`;

export const use = `import { Button, Card, Field, Input } from "@kalaa/react";

export function ProductForm() {
  return (
    <Card title="Product details">
      <Field label="Product title" hint="Shown on the storefront.">
        <Input defaultValue="Cold-pressed mustard oil 1 L" />
      </Field>
      <Button variant="primary">Save changes</Button>
    </Card>
  );
}`;

export const appearance = `import { AppearanceMenu } from "@kalaa/react";

<header>
  ...
  <AppearanceMenu />
</header>`;

export const switches = `<!-- Omit an attribute for its default: neel, system theme, square. -->
<html data-accent="geru" data-theme="dark" data-shape="soft">

<!-- The same attributes work on any wrapper. -->
<div data-shape="soft">...</div>`;
