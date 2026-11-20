import {
  Banner,
  Button,
  Checkbox,
  EmptyState,
  Field,
  Input,
  Pagination,
  Select,
  Table,
  TableSortHeader,
  Toolbar,
} from "@kalaa/react";
import { useState } from "react";

const initialOrders = [
  { id: "ORD-1042", customer: "Maple Studio", total: 72, status: "Pending" },
  { id: "ORD-1043", customer: "Brightside Books", total: 142, status: "Pending" },
  { id: "ORD-1044", customer: "River Workshop", total: 28, status: "Shipped" },
  { id: "ORD-1045", customer: "Northwind Goods", total: 218, status: "Pending" },
  { id: "ORD-1046", customer: "Juniper Market", total: 56, status: "Shipped" },
];
const statuses = ["All statuses", "Pending", "Shipped"].map((label) => ({ label, value: label }));
const pageSize = 3;

function OrderRecords({ initialState = "ready" }: { initialState?: "ready" | "loading" | "error" }) {
  const [state, setState] = useState(initialState);
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [direction, setDirection] = useState<"ascending" | "descending">();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const search = query.trim().toLowerCase();
  const filtered = orders.filter(
    (order) =>
      (status === "All statuses" || order.status === status) &&
      `${order.id} ${order.customer}`.toLowerCase().includes(search),
  );
  if (direction) {
    filtered.sort((left, right) =>
      direction === "ascending" ? left.total - right.total : right.total - left.total,
    );
  }
  const pageCount = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectedOnPage = visible.filter((order) => selected.includes(order.id)).length;

  function changePage(next: number) {
    setPage(next);
    setSelected([]);
  }

  function markShipped() {
    setOrders((current) =>
      current.map((order) => (selected.includes(order.id) ? { ...order, status: "Shipped" } : order)),
    );
    setMessage(`Updated ${selected.length} ${selected.length === 1 ? "order" : "orders"}.`);
    changePage(currentPage);
  }

  return (
    <main
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: "1rem",
        padding: "1rem",
        maxInlineSize: "58rem",
      }}
    >
      <h1>Orders</h1>
      <Toolbar
        aria-label="Order filters and actions"
        actions={
          <Button disabled={state !== "ready" || !selected.length} onClick={markShipped}>
            {selected.length ? `Mark shipped (${selected.length})` : "Mark shipped"}
          </Button>
        }
      >
        <Field label="Search orders">
          <Input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              changePage(1);
            }}
          />
        </Field>
        <Field label="Status">
          <Select
            options={statuses}
            value={status}
            onValueChange={(value) => {
              setStatus(value ?? "All statuses");
              changePage(1);
            }}
          />
        </Field>
      </Toolbar>
      {message && <Banner tone="success">{message}</Banner>}
      {state === "loading" && <Banner tone="info">Loading orders…</Banner>}
      {state === "error" && (
        <Banner tone="danger" actions={<Button onClick={() => setState("ready")}>Retry</Button>}>
          Couldn’t load orders.
        </Banner>
      )}
      {state === "ready" &&
        (visible.length === 0 ? (
          <EmptyState title="No matching orders" description="Try a different search or status." />
        ) : (
          <>
            <Table caption="Orders" hideCaption scrollLabel="Scrollable order results">
              <thead>
                <tr>
                  <th scope="col">
                    <Checkbox
                      label="Select page"
                      checked={selectedOnPage === visible.length}
                      indeterminate={selectedOnPage > 0 && selectedOnPage < visible.length}
                      onCheckedChange={(checked) => setSelected(checked ? visible.map(({ id }) => id) : [])}
                    />
                  </th>
                  <th scope="col">Order</th>
                  <th scope="col">Customer</th>
                  <TableSortHeader
                    direction={direction}
                    onSort={() => {
                      setDirection(direction === "ascending" ? "descending" : "ascending");
                      changePage(1);
                    }}
                  >
                    Total
                  </TableSortHeader>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Checkbox
                        label={`Select ${order.id}`}
                        checked={selected.includes(order.id)}
                        onCheckedChange={(checked) =>
                          setSelected((current) =>
                            checked ? [...current, order.id] : current.filter((id) => id !== order.id),
                          )
                        }
                      />
                    </td>
                    <th scope="row">{order.id}</th>
                    <td>{order.customer}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination page={currentPage} pageCount={pageCount} onPageChange={changePage} />
          </>
        ))}
    </main>
  );
}

export default { title: "Examples/Order records", component: OrderRecords };

export const Ready = {};
export const Loading = { args: { initialState: "loading" } };
export const Error = { args: { initialState: "error" } };
