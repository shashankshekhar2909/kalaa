// Code samples shown on the Home and Get started pages. Kept in one place so both pages say the same thing.
export const install = `# v0.1 preview: Kalaa is private and not on npm.
# Put the release tarballs in vendor/ and install them.
pnpm add ./vendor/kalaa-tokens-0.1.0.tgz ./vendor/kalaa-react-0.1.0.tgz`;

export const styles = `import "@kalaa/tokens/fonts.css"; // IBM Plex, self-hosted
import "@kalaa/tokens/tokens.css"; // colour, type, space, shape, motion
import "@kalaa/react/styles.css"; // component styles`;

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

export const switches = `<!-- Omit an attribute for its default: neel, system theme, square. -->
<html data-accent="geru" data-theme="dark" data-shape="soft">

<!-- The same attributes work on any wrapper. -->
<div data-shape="soft">...</div>`;
