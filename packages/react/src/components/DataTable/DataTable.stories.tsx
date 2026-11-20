import { useRef, useState } from "react";
import { Input } from "../Input/Input";
import { DataTable, type DataTableColumn } from "./DataTable";

type Contact = { id: string; name: string; email: string };

const columns: DataTableColumn<Contact>[] = [
  {
    id: "name",
    label: "Name",
    compare: (left, right) => left.name.localeCompare(right.name),
    render: ({ name }) => name,
    edit: (row, update, disabled) => (
      <Input
        aria-label="Name"
        value={row.name}
        disabled={disabled}
        onChange={(event) => update({ ...row, name: event.target.value })}
      />
    ),
  },
  {
    id: "email",
    label: "Email",
    compare: (left, right) => left.email.localeCompare(right.email),
    render: ({ email }) => email,
    edit: (row, update, disabled) => (
      <Input
        aria-label="Email"
        type="email"
        value={row.email}
        disabled={disabled}
        onChange={(event) => update({ ...row, email: event.target.value })}
      />
    ),
  },
];

function Contacts() {
  const nextId = useRef(3);
  const [rows, setRows] = useState<Contact[]>([
    { id: "1", name: "Mina Sen", email: "mina@example.com" },
    { id: "2", name: "Arun Rao", email: "arun@example.com" },
  ]);

  function validate(row: Contact) {
    if (!row.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim())) {
      throw new Error("Enter a name and a valid email address.");
    }
    return { ...row, name: row.name.trim(), email: row.email.trim() };
  }

  return (
    <main style={{ maxInlineSize: "48rem", padding: "1rem" }}>
      <DataTable
        caption="Contacts"
        columns={columns}
        rows={rows}
        getRowId={({ id }) => id}
        getRowLabel={({ name }) => name}
        newRow={() => ({ id: "", name: "", email: "" })}
        onCreate={(row) => {
          const contact = validate(row);
          const id = String(nextId.current++);
          setRows((current) => [...current, { ...contact, id }]);
        }}
        onUpdate={(id, row) => {
          const contact = validate(row);
          setRows((current) => current.map((item) => (item.id === id ? contact : item)));
        }}
        onDelete={(id) => setRows((current) => current.filter((row) => row.id !== id))}
      />
    </main>
  );
}

export default {
  title: "Components/DataTable",
  tags: ["autodocs"],
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component:
          "A sortable table for small record sets. The caller owns the rows, editor fields, validation, and persistence. Supply stable row IDs and give each editor control an accessible label.",
      },
    },
  },
};

export const InlineCrud = { render: () => <Contacts /> };
