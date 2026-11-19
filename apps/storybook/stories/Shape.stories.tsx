import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Banner, Button, Card, Checkbox, Field, Input, Select, Switch, Tabs } from "@kalaa/react";

function Sample({ shape }: { shape: "square" | "soft" }) {
  const id = shape;
  return (
    <Card
      title={shape === "square" ? "Square (default)" : "Soft"}
      description={shape === "square" ? "No attribute needed." : 'data-shape="soft"'}
      titleLevel={3}
    >
      <div className="stack">
        <Field label="Product title">
          <Input defaultValue="Cold-pressed mustard oil 1 L" id={`${id}-title`} />
        </Field>
        <Field label="Category">
          <Select
            id={`${id}-category`}
            defaultValue="oils"
            options={[
              { value: "oils", label: "Cooking oils" },
              { value: "grains", label: "Rice and grains" },
            ]}
          />
        </Field>
        <Checkbox label="Show on storefront" defaultChecked />
        <Switch label="Track stock" defaultChecked />
        <Tabs
          variant="segmented"
          defaultValue="a"
          items={[
            { value: "a", label: "Details", content: "Product details." },
            { value: "b", label: "History", content: "3 earlier versions." },
          ]}
        />
        <Banner tone="warning" title="1 field needs attention">
          Fix the price before approving.
        </Banner>
        <div className="row">
          <Button variant="primary">Save changes</Button>
          <Button>Preview</Button>
          <Badge tone="success">Approved</Badge>
        </div>
      </div>
    </Card>
  );
}
function Shape() {
  return (
    <main className="foundation">
      <h1>Shape</h1>
      <p>
        Kalaa is square by default: the radius tokens are all 0, and the 1px border, the Banner start border
        and the selected Tab carry the identity. Soft is a supported mode for products that want rounded
        corners. The same components are shown twice below, with one attribute different.
      </p>
      <div className="shape-pair">
        <div data-shape="square">
          <Sample shape="square" />
        </div>
        <div data-shape="soft">
          <Sample shape="soft" />
        </div>
      </div>
      <h2>Rules</h2>
      <ul>
        <li>
          Set <code>data-shape=&quot;soft&quot;</code> on <code>html</code> or any wrapper. Omit it, or set{" "}
          <code>data-shape=&quot;square&quot;</code> inside a soft wrapper, for square.
        </li>
        <li>
          Components use <code>radius-sm</code>, <code>radius-md</code>, <code>radius-lg</code> and{" "}
          <code>radius-pill</code>: 0 when square; 6, 8, 12 and 999px when soft.
        </li>
        <li>
          <code>radius-full</code> is always 999px and is for true circles only, such as the Button spinner.
        </li>
        <li>Never hard-code a radius and never use a radius token as a size.</li>
        <li>The logo does not change with shape.</li>
      </ul>
    </main>
  );
}
const meta: Meta = { title: "Foundations/Shape", component: Shape };
export default meta;
export const SquareAndSoft: StoryObj = {};
