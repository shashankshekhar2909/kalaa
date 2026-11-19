import { Field } from "./Field";
import { Input } from "../Input/Input";
import { Textarea } from "../Textarea/Textarea";
import { Select } from "../Select/Select";

const meta = { title: "Components/Field", component: Field };
export default meta;
const options = [
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
];
export const WithHint = {
  render: () => (
    <Field label="Product name" hint="Shown in the catalog.">
      <Input />
    </Field>
  ),
};
export const WithError = {
  render: () => (
    <Field label="Product name" error="Enter a product name.">
      <Input />
    </Field>
  ),
};
export const Required = {
  render: () => (
    <Field label="Product name" required>
      <Input />
    </Field>
  ),
};
export const TextareaControl = {
  render: () => (
    <Field label="Product description" hint="Describe the product.">
      <Textarea />
    </Field>
  ),
};
export const SelectControl = {
  render: () => (
    <Field label="Review status" hint="Choose a status.">
      <Select options={options} />
    </Field>
  ),
};
