import { Button } from "./Button";

export default { title: "Components/Button", component: Button };
export const Primary = { args: { variant: "primary", children: "Add product" } };
export const Secondary = { args: { children: "Review import" } };
export const Ghost = { args: { variant: "ghost", children: "Edit" } };
export const Danger = { args: { variant: "danger", children: "Delete product" } };
export const Small = { args: { size: "sm", children: "Save changes" } };
export const States = {
  render: () => (
    <>
      <Button disabled>Save changes</Button> <Button loading>Import products</Button>{" "}
      <Button>A long product action for review</Button>
    </>
  ),
};
