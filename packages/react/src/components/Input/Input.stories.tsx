import { Input } from "./Input";
const meta = { title: "Components/Input", component: Input };
export default meta;
export const Default = { render: () => <Input aria-label="Product name" /> };
export const Small = { render: () => <Input aria-label="Product name" size="sm" /> };
export const Placeholder = {
  render: () => <Input aria-label="Product name" placeholder="Enter product name" />,
};
export const Disabled = {
  render: () => <Input aria-label="Product name" disabled defaultValue="Archived product" />,
};
export const Invalid = { render: () => <Input aria-label="Product name" invalid /> };
export const LongValue = {
  render: () => (
    <Input
      aria-label="Product name"
      defaultValue="Handwoven cotton cushion cover in natural indigo with a geometric pattern"
    />
  ),
};
