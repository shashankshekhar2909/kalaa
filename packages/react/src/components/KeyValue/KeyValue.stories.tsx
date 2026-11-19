import { KeyValue } from "./KeyValue";

export default { title: "Components/KeyValue", component: KeyValue };
export const Rows = {
  args: {
    items: [
      { label: "Status", value: "Draft" },
      { label: "Products", value: 24 },
    ],
  },
};
export const Grid = {
  args: {
    layout: "grid",
    items: [
      { label: "Status", value: "Imported" },
      { label: "Products", value: 24 },
    ],
  },
};
export const States = {
  args: {
    items: [
      { label: "Description", value: "" },
      { label: "Collection", value: "A long collection name requiring review" },
    ],
  },
};
