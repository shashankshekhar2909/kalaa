import { Dialog } from "./Dialog";
import { Button } from "../Button/Button";
const meta = { title: "Components/Dialog", component: Dialog };
export default meta;
function ReviewDialog({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <Dialog
      defaultOpen
      size={size}
      trigger={<Button>Review import</Button>}
      title="Review import"
      description="Check the products before importing."
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </>
      }
    >
      Twelve products are ready to import into the catalog.
    </Dialog>
  );
}
export const Default = { render: () => <ReviewDialog /> };
export const Small = { render: () => <ReviewDialog size="sm" /> };
export const Large = { render: () => <ReviewDialog size="lg" /> };
