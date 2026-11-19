import { Textarea } from "./Textarea";
const meta = { title: "Components/Textarea", component: Textarea };
export default meta;
export const Default = { render: () => <Textarea aria-label="Product description" /> };
export const Small = { render: () => <Textarea aria-label="Product description" size="sm" /> };
export const Placeholder = {
  render: () => <Textarea aria-label="Product description" placeholder="Enter product description" />,
};
export const Disabled = {
  render: () => <Textarea aria-label="Product description" disabled defaultValue="Archived product" />,
};
export const Invalid = { render: () => <Textarea aria-label="Product description" invalid /> };
export const LongValue = {
  render: () => (
    <Textarea
      aria-label="Product description"
      defaultValue="Handwoven cotton cushion cover in natural indigo. Each piece is finished by hand and may vary slightly."
    />
  ),
};
export const AutoResize = {
  render: () => (
    <Textarea aria-label="Product description" autoResize defaultValue="A handwoven cushion cover." />
  ),
};
