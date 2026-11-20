import { useId, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { cx } from "../../util";
import { Banner } from "../Banner/Banner";
import { EmptyState } from "../EmptyState/EmptyState";
import { Table } from "../Table/Table";
import { ChartLegend, type ChartLegendItem } from "./ChartLegend";

export type ChartDataTable = {
  /** Accessible table caption. */
  caption: ReactNode;
  /** Column headers. */
  headers: ReadonlyArray<ReactNode>;
  /** Table body rows. */
  rows: ReadonlyArray<ReadonlyArray<ReactNode>>;
};

export type ChartFrameProps = Omit<ComponentPropsWithRef<"section">, "title"> & {
  /** Chart title. */
  title: ReactNode;
  /** Optional subtitle/context (units, time window, source). */
  description?: ReactNode;
  /** Heading level for the title (default 3). */
  titleLevel?: 2 | 3 | 4;
  /** Legend element or array of legend items. */
  legend?: ReactNode | ReadonlyArray<ChartLegendItem>;
  /** Extra controls in the header row. */
  actions?: ReactNode;
  /** Visual state: default, loading, empty or error. */
  state?: "default" | "loading" | "empty" | "error";
  /** Shorthand for `state="loading"`. */
  loading?: boolean;
  /** Shorthand for `state="empty"`. */
  empty?: boolean;
  /** Error message; sets state to error when truthy. */
  error?: ReactNode;
  /** Accessible text shown while loading. */
  loadingLabel?: string;
  /** Heading for the empty state. */
  emptyTitle?: ReactNode;
  /** Description for the empty state. */
  emptyDescription?: ReactNode;
  /** Optional action button for the empty state. */
  emptyAction?: ReactNode;
  /** Heading for the error banner. */
  errorTitle?: ReactNode;
  /** Structured data for the "Show data" Kalaa Table toggle. */
  dataTable?: ChartDataTable;
  /** Controlled open state for the data table. */
  showData?: boolean;
  /** Uncontrolled initial open state for the data table. */
  defaultShowData?: boolean;
  /** Callback when the user toggles "Show data". */
  onShowDataChange?: (show: boolean) => void;
};

export function ChartFrame({
  title,
  description,
  titleLevel = 3,
  legend,
  actions,
  state = "default",
  loading = false,
  empty = false,
  error,
  loadingLabel = "Loading chart data…",
  emptyTitle = "No data available",
  emptyDescription = "Adjust the filters or import records to populate this chart.",
  emptyAction,
  errorTitle = "Could not load chart data",
  dataTable,
  showData: controlledShowData,
  defaultShowData = false,
  onShowDataChange,
  children,
  className,
  ...props
}: ChartFrameProps) {
  const [uncontrolledShowData, setUncontrolledShowData] = useState(defaultShowData);
  const isDataVisible = controlledShowData ?? uncontrolledShowData;
  const tableId = useId();
  const Heading = `h${titleLevel}` as "h2" | "h3" | "h4";

  const resolvedState =
    state !== "default" ? state : error ? "error" : loading ? "loading" : empty ? "empty" : "default";

  function handleToggleData() {
    const next = !isDataVisible;
    if (controlledShowData === undefined) {
      setUncontrolledShowData(next);
    }
    onShowDataChange?.(next);
  }

  return (
    <section {...props} className={cx("kl-chart-frame", className)}>
      <div className="kl-chart-frame__header">
        <div className="kl-chart-frame__titles">
          <Heading className="kl-chart-frame__title">{title}</Heading>
          {description && <p className="kl-chart-frame__description">{description}</p>}
        </div>
        {(actions || dataTable) && (
          <div className="kl-chart-frame__actions">
            {actions}
            {dataTable && resolvedState === "default" && (
              <button
                type="button"
                className="kl-chart__toggle"
                aria-expanded={isDataVisible}
                aria-controls={tableId}
                onClick={handleToggleData}
              >
                {isDataVisible ? "Hide data" : "Show data"}
              </button>
            )}
          </div>
        )}
      </div>

      {resolvedState === "default" &&
        legend &&
        (Array.isArray(legend) ? (
          <ChartLegend items={legend as ReadonlyArray<ChartLegendItem>} />
        ) : (
          (legend as ReactNode)
        ))}

      {resolvedState === "loading" && (
        <div className="kl-chart-frame__loading" role="status" aria-busy="true">
          {loadingLabel}
        </div>
      )}

      {resolvedState === "error" && (
        <Banner tone="danger" title={errorTitle}>
          {error ?? "Check the data connection and try again."}
        </Banner>
      )}

      {resolvedState === "empty" && (
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
      )}

      {resolvedState === "default" && children}

      {resolvedState === "default" && dataTable && isDataVisible && (
        <div id={tableId}>
          <Table caption={dataTable.caption}>
            <thead>
              <tr>
                {dataTable.headers.map((header, idx) => (
                  <th key={idx} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataTable.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) =>
                    cIdx === 0 ? (
                      <th key={cIdx} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={cIdx}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </section>
  );
}
