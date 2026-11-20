import { DropZone } from "./DropZone";
export default {
  title: "Components/DropZone",
  component: DropZone,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Drag-and-drop and click-to-browse file target with `accept` filtering and a built-in `maxSizeBytes` size-limit notice and validation message.\n\n**Do:** always state the accepted format and size limit up front via `accept` and `maxSizeBytes`. **Don\'t:** rely on drag-and-drop alone; the entire zone is a keyboard-focusable button that opens the system file picker.\n\n**Usage**\n\n```tsx\nimport { DropZone } from "@kalaa/react";\n\n<DropZone\n  label="Drop a product CSV here, or click to browse"\n  description="UTF-8 comma-separated values with a header row."\n  accept=".csv,text/csv"\n  maxSizeBytes={5 * 1024 * 1024}\n  onFiles={(files) => console.log(files)}\n/>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    label: "Drop a product CSV here, or click to browse",
    description: "UTF-8 comma-separated values with a header row.",
    accept: ".csv,text/csv",
    maxSizeBytes: 5 * 1024 * 1024,
    multiple: false,
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    accept: { control: "text" },
    maxSizeBytes: { control: "number" },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    onFiles: { action: "files accepted" },
    onReject: { action: "file rejected" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const Disabled = { args: { disabled: true } };
