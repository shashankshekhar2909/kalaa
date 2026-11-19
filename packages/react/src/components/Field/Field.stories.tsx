import { Field } from "./Field";
import { Input } from "../Input/Input";
const meta = { title: "Components/Field", component: Field };
export default meta;
export const Default = {
  render: () => (
    <Field label="Product name" hint="Shown in the catalog">
      <Input />
    </Field>
  ),
};
export const States = {
  render: () => (
    <Field label="Product name" hint="Shown in the catalog">
      <Input />
    </Field>
  ),
};
