import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../Button/Button";
import { ToastProvider, useToast } from "./Toast";
function Trigger() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: "Import complete",
          description: "124 products processed",
          tone: "success",
          timeout: 0,
        })
      }
    >
      Notify
    </Button>
  );
}
describe("Toast", () => {
  it("adds and dismisses a toast via ToastProvider and useToast", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByText("Import complete")).toBeInTheDocument();
    expect(screen.getByText("124 products processed")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("Import complete")).not.toBeInTheDocument();
  });
});
