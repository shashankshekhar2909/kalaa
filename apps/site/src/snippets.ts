// Code samples shown on the Home and Get started pages. Kept in one place so both pages say the same thing.
import { releaseTag, repo, tarballs } from "./config";

const dl = `${repo}/releases/download/${releaseTag}`;

export const install = `# Download the tarballs from the GitHub Release and verify them
mkdir -p vendor
curl -fL --output-dir vendor -O ${dl}/${tarballs.tokens}
curl -fL --output-dir vendor -O ${dl}/${tarballs.react}
curl -fL --output-dir vendor -O ${dl}/SHA256SUMS
(cd vendor && sha256sum -c --ignore-missing SHA256SUMS)

# Install them into your app (npm or pnpm)
npm install ./vendor/${tarballs.tokens} ./vendor/${tarballs.react}
# pnpm add ./vendor/${tarballs.tokens} ./vendor/${tarballs.react}

# Note: "npm install @kalaa/react @kalaa/tokens" does not work yet.
# The packages are not published to npm, so the registry returns 404 Not Found.`;

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
