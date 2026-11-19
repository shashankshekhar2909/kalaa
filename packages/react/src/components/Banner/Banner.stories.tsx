import { Banner } from "./Banner";

export default { title: "Components/Banner", component: Banner };
export const Info = {
  args: { tone: "info", title: "Import started", children: "Products are being imported." },
};
export const Success = { args: { tone: "success", children: "Products imported." } };
export const Warning = { args: { tone: "warning", children: "Some products need review." } };
export const Danger = { args: { tone: "danger", children: "The import failed." } };
export const States = {
  args: {
    tone: "warning",
    title: "Review required",
    children:
      "Some products have a long description that requires your attention before they can be published.",
  },
};
