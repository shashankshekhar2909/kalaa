import { Dialog } from "./Dialog";

const meta = { title: "Components/Dialog", component: Dialog };
export default meta;
export const Default = {
  render: () => (
    <Dialog
      trigger={<button>Review import</button>}
      title="Review import"
      description="Check the products before importing."
    >
      Ready to import.
    </Dialog>
  ),
};
export const States = {
  render: () => (
    <Dialog
      trigger={<button>Review import</button>}
      title="Review import"
      description="Check the products before importing."
    >
      Ready to import.
    </Dialog>
  ),
};
