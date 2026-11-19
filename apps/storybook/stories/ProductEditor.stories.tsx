import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AppShell,
  Banner,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Field,
  Input,
  KeyValue,
  PageHeader,
  ProgressBar,
  Select,
  StatusBadge,
  Switch,
  Tabs,
  Textarea,
} from "@kalaa/react";

// One realistic screen built only from Kalaa components: the visual check that the parts work together.
const meta: Meta = { title: "Examples/Product editor", parameters: { layout: "fullscreen" } };
export default meta;

const nav = (
  <>
    <AppShell.NavItem href="#overview">Overview</AppShell.NavItem>
    <AppShell.NavItem href="#products" active>
      Products
    </AppShell.NavItem>
    <AppShell.NavItem href="#imports">Imports</AppShell.NavItem>
    <AppShell.NavItem href="#review">Review queue</AppShell.NavItem>
    <AppShell.NavItem href="#settings">Settings</AppShell.NavItem>
  </>
);

const details = (
  <div style={{ display: "grid", gap: "var(--kalaa-space-4)" }}>
    <Field label="Product title" hint="Shown on the storefront. Keep it under 80 characters.">
      <Input defaultValue="Cold-pressed mustard oil 1 L" />
    </Field>
    <div
      style={{
        display: "grid",
        gap: "var(--kalaa-space-4)",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      }}
    >
      <Field label="Category" required>
        <Select
          defaultValue="oils"
          options={[
            { value: "oils", label: "Cooking oils" },
            { value: "grains", label: "Rice and grains" },
            { value: "sweeteners", label: "Sweeteners" },
          ]}
        />
      </Field>
      <Field label="Price (₹)" error="Price must be greater than zero.">
        <Input defaultValue="0" inputMode="decimal" />
      </Field>
    </div>
    <Field label="Description">
      <Textarea defaultValue="Kachi ghani oil pressed from black mustard seeds. Strong aroma, high smoke point." />
    </Field>
    <Checkbox
      label="Show on storefront"
      description="Hidden products stay in the catalog but are not listed."
      defaultChecked
    />
    <Switch label="Track stock" description="Warn when fewer than 20 units are left." defaultChecked />
  </div>
);

export const Default: StoryObj = {
  render: () => (
    <AppShell nav={nav}>
      <div style={{ display: "grid", gap: "var(--kalaa-space-4)" }}>
        <PageHeader
          back={{ href: "#products", label: "All products" }}
          title="Cold-pressed mustard oil 1 L"
          description="SKU MO-1000 · last imported 19 Nov 2026"
          actions={
            <>
              <Button>Preview</Button>
              <Button variant="primary">Save changes</Button>
            </>
          }
        />
        <Banner tone="warning" title="1 field needs attention">
          Fix the price before this product can be approved.
        </Banner>
        <div
          style={{
            display: "grid",
            gap: "var(--kalaa-space-4)",
            gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)",
          }}
        >
          <Card title="Product details">
            <Tabs
              variant="underline"
              defaultValue="details"
              items={[
                { value: "details", label: "Details", content: details },
                {
                  value: "media",
                  label: "Media",
                  content: (
                    <EmptyState
                      title="No images yet"
                      description="Add at least one product photo before publishing."
                      action={<Button>Upload images</Button>}
                    />
                  ),
                },
                { value: "history", label: "History", content: <p>3 earlier versions.</p> },
              ]}
            />
          </Card>
          <div style={{ display: "grid", gap: "var(--kalaa-space-4)", alignContent: "start" }}>
            <Card title="Status" actions={<StatusBadge status="needs review" />}>
              <KeyValue
                items={[
                  { label: "Source", value: "CSV import #42" },
                  { label: "Mapped by", value: "AI, reviewed" },
                  { label: "Stock", value: "88 units" },
                  { label: "Barcode", value: "" },
                ]}
              />
            </Card>
            <Card title="Data quality">
              <ProgressBar label="Fields complete" value={82} />
              <ProgressBar label="Attribute confidence" value={94} tone="success" />
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  ),
};
