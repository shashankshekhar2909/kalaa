import { useEffect, useRef, useState, type ReactNode } from "react";
import { Banner } from "../Banner/Banner";
import { Button } from "../Button/Button";
import { Table, TableSortHeader } from "../Table/Table";

export type DataTableColumn<Row> = {
  id: string;
  label: string;
  render: (row: Row) => ReactNode;
  compare?: (left: Row, right: Row) => number;
  edit?: (row: Row, update: (row: Row) => void, disabled: boolean) => ReactNode;
};

export type DataTableProps<Row> = {
  caption: string;
  rows: readonly Row[];
  columns: readonly DataTableColumn<Row>[];
  getRowId: (row: Row) => string;
  getRowLabel?: (row: Row) => string;
  newRow: () => Row;
  onCreate: (row: Row) => void | Promise<void>;
  onUpdate: (id: string, row: Row) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  emptyMessage?: string;
};

type Edit<Row> =
  | { kind: "create"; draft: Row }
  | { kind: "update"; id: string; draft: Row }
  | { kind: "delete"; id: string };

export function DataTable<Row>({
  caption,
  rows,
  columns,
  getRowId,
  getRowLabel = getRowId,
  newRow,
  onCreate,
  onUpdate,
  onDelete,
  emptyMessage = "No records",
}: DataTableProps<Row>) {
  const [sort, setSort] = useState<{ id: string; direction: "ascending" | "descending" }>();
  const [edit, setEdit] = useState<Edit<Row>>();
  const editRow = useRef<HTMLTableRowElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const submitting = useRef(false);
  const editKind = edit?.kind;
  useEffect(() => {
    if (editKind) {
      editRow.current?.querySelector<HTMLElement>("input, select, textarea, button")?.focus();
      returnFocus.current = true;
    } else if (returnFocus.current) {
      addButton.current?.focus();
      returnFocus.current = false;
    }
  }, [editKind]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const sortColumn = columns.find(({ id }) => id === sort?.id);
  const compare = sortColumn?.compare;
  const ordered =
    sort && compare
      ? [...rows].sort((left, right) =>
          sort.direction === "ascending" ? compare(left, right) : compare(right, left),
        )
      : rows;

  function changeEdit(next?: Edit<Row>) {
    setError("");
    setEdit(next);
  }

  async function submit() {
    if (!edit || submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError("");
    try {
      if (edit.kind === "create") await onCreate(edit.draft);
      if (edit.kind === "update") await onUpdate(edit.id, edit.draft);
      if (edit.kind === "delete") await onDelete(edit.id);
      changeEdit();
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : "Couldn’t save the change.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  function editor(current: Extract<Edit<Row>, { draft: Row }>) {
    return (
      <tr ref={editRow} key={current.kind === "update" ? current.id : undefined}>
        {columns.map((column) => (
          <td key={column.id}>
            {column.edit
              ? column.edit(current.draft, (draft) => setEdit({ ...current, draft }), pending)
              : column.render(current.draft)}
          </td>
        ))}
        <td>
          <div className="kl-data-table__actions">
            <Button size="sm" variant="primary" loading={pending} onClick={() => void submit()}>
              Save
            </Button>
            <Button size="sm" disabled={pending} onClick={() => changeEdit()}>
              Cancel
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="kl-data-table">
      <div>
        <Button
          ref={addButton}
          disabled={!!edit}
          onClick={() => changeEdit({ kind: "create", draft: newRow() })}
        >
          Add record
        </Button>
      </div>
      {error && <Banner tone="danger">{error}</Banner>}
      <Table caption={caption} scrollLabel={caption} aria-busy={pending || undefined}>
        <thead>
          <tr>
            {columns.map((column) =>
              column.compare ? (
                <TableSortHeader
                  key={column.id}
                  direction={sort?.id === column.id ? sort.direction : undefined}
                  onSort={() =>
                    setSort({
                      id: column.id,
                      direction:
                        sort?.id === column.id && sort.direction === "ascending" ? "descending" : "ascending",
                    })
                  }
                >
                  {column.label}
                </TableSortHeader>
              ) : (
                <th key={column.id} scope="col">
                  {column.label}
                </th>
              ),
            )}
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {edit?.kind === "create" && editor(edit)}
          {ordered.length === 0 && edit?.kind !== "create" && (
            <tr>
              <td colSpan={columns.length + 1}>{emptyMessage}</td>
            </tr>
          )}
          {ordered.map((row) => {
            const id = getRowId(row);
            const label = getRowLabel(row);
            const current = edit?.kind !== "create" && edit?.id === id ? edit : undefined;
            if (current?.kind === "update") return editor(current);
            return (
              <tr key={id} ref={current?.kind === "delete" ? editRow : undefined}>
                {columns.map((column) => (
                  <td key={column.id}>{column.render(row)}</td>
                ))}
                <td>
                  {current?.kind === "delete" ? (
                    <>
                      <p className="kl-data-table__confirmation">Delete {label}?</p>
                      <div className="kl-data-table__actions">
                        <Button
                          aria-label={`Confirm delete ${label}`}
                          size="sm"
                          variant="danger"
                          loading={pending}
                          onClick={() => void submit()}
                        >
                          Delete
                        </Button>
                        <Button size="sm" disabled={pending} onClick={() => changeEdit()}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="kl-data-table__actions">
                      <Button
                        aria-label={`Edit ${label}`}
                        size="sm"
                        disabled={!!edit}
                        onClick={() => changeEdit({ kind: "update", id, draft: row })}
                      >
                        Edit
                      </Button>
                      <Button
                        aria-label={`Delete ${label}`}
                        size="sm"
                        disabled={!!edit}
                        onClick={() => changeEdit({ kind: "delete", id })}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
