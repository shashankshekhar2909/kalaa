import { useEffect, useRef } from "react";
import { Button } from "../Button/Button";
import { ToastProvider, useToast, type ToastTone } from "./Toast";
function ToastDemo({ title, description, tone }: { title: string; description?: string; tone: ToastTone }) {
  const { toast } = useToast();
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    toast({ title, description, tone, timeout: 0 });
  }, [toast, title, description, tone]);
  return (
    <div style={{ minHeight: 140 }}>
      <Button
        onClick={() =>
          toast({
            title,
            description,
            tone,
          })
        }
      >
        Show toast
      </Button>
    </div>
  );
}
export default {
  title: "Components/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Transient status notification stack built on Base UI Toast (`ToastProvider` + `useToast()`). Mount `ToastProvider` once near the root of your app and trigger notifications with `const { toast } = useToast()`.\n\n**Do:** use it for background confirmations such as "Batch #1042 imported". **Don\'t:** put critical blocking errors only in a toast; render an inline `Banner` or `Field error`.\n\n**Usage**\n\n```tsx\nimport { ToastProvider, useToast, Button } from "@kalaa/react";\n\nfunction SaveButton() {\n  const { toast } = useToast();\n  return (\n    <Button onClick={() => toast({ title: "Catalog saved", tone: "success" })}>\n      Save\n    </Button>\n  );\n}\n\n<ToastProvider>\n  <SaveButton />\n</ToastProvider>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    timeout: 5000,
    limit: 3,
  },
  argTypes: {
    timeout: { control: "number" },
    limit: { control: "number" },
    children: { control: false },
  },
};
export const Default = {
  render: () => (
    <ToastProvider timeout={0}>
      <ToastDemo
        title="Batch #1042 imported"
        description="124 products added to the review queue."
        tone="success"
      />
    </ToastProvider>
  ),
};
