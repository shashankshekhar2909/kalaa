import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  BarChart,
  ChartFrame,
  ChartLegend,
  ChartTooltip,
  DonutChart,
  Heatmap,
  LineChart,
  ProgressRing,
  Sparkline,
  StatTrend,
  bandScale,
  chartColor,
  linearScale,
  niceDomain,
} from "./index";

describe("Chart scales", () => {
  it("computes linearScale, ticks, niceDomain, bandScale and chartColor", () => {
    const scale = linearScale([0, 100], [200, 0]);
    expect(scale(0)).toBe(200);
    expect(scale(50)).toBe(100);
    expect(scale(100)).toBe(0);
    expect(scale.ticks(5)).toEqual([0, 25, 50, 75, 100]);

    const [lo, hi] = niceDomain(0, 187, 5);
    expect(lo).toBe(0);
    expect(hi).toBeGreaterThanOrEqual(187);

    const bands = bandScale(["W1", "W2", "W3"], [0, 300], 0.2);
    expect(bands("W1")).toBeLessThan(bands("W2"));
    expect(bands.bandwidth).toBeCloseTo(80);

    expect(chartColor(0)).toBe("var(--kalaa-chart-1)");
    expect(chartColor(8)).toBe("var(--kalaa-chart-1)");
  });
});

describe("Sparkline", () => {
  it("renders role=img with a generated summary and supports area fill", () => {
    render(<Sparkline label="Catalog imports" data={[110, 130, 125, 160]} area className="custom-spark" />);
    const img = screen.getByRole("img", { name: /Catalog imports: 4 points, trending up/i });
    expect(img).toHaveClass("kl-sparkline", "custom-spark");
    expect(img.querySelector("path")).not.toBeNull();
  });
});

describe("StatTrend", () => {
  it("renders value, directional delta arrow and inline sparkline", () => {
    render(
      <StatTrend
        label="Catalog imports"
        value="1,482"
        delta="+14.2%"
        trend="up"
        period="vs last week"
        data={[120, 140, 165, 180]}
      />,
    );
    expect(screen.getByText("Catalog imports")).toBeInTheDocument();
    expect(screen.getByText("1,482")).toBeInTheDocument();
    expect(screen.getByText("↑")).toBeInTheDocument();
    expect(screen.getByText("+14.2%")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Catalog imports trend/i })).toBeInTheDocument();
  });
});

describe("ProgressRing", () => {
  it("renders role=img summary and centred percentage", () => {
    render(<ProgressRing label="Catalog verified" value={85} max={100} />);
    expect(screen.getByRole("img", { name: /Catalog verified: 85% \(85 of 100\)/i })).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });
});

describe("BarChart", () => {
  const categories = ["W1", "W2", "W3"];
  const series = [
    { id: "approved", label: "Approved", data: [120, 150, 180] },
    { id: "review", label: "Needs review", data: [20, 30, 25] },
  ];

  it("renders role=img summary, keyboard-focusable bars with tooltip, and Show data Kalaa Table", () => {
    render(<BarChart label="Weekly imports" categories={categories} series={series} />);
    expect(
      screen.getByRole("img", { name: /Weekly imports \(grouped vertical bar chart/i }),
    ).toBeInTheDocument();

    const firstBar = screen.getByRole("button", { name: "W1, Approved: 120" });
    fireEvent.focus(firstBar);
    expect(screen.getByRole("tooltip")).toHaveTextContent("W1");
    expect(screen.getByRole("tooltip")).toHaveTextContent("120");

    fireEvent.keyDown(firstBar, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "W1, Needs review: 20" })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("button", { name: "W1, Needs review: 20" }), {
      key: "Escape",
    });
    expect(screen.queryByRole("tooltip")).toBeNull();

    const toggle = screen.getByRole("button", { name: "Show data" });
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Hide data" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("table", { name: "Weekly imports data" })).toBeInTheDocument();
  });

  it("supports horizontal and stacked modes", () => {
    render(
      <BarChart
        label="Stacked applications"
        categories={categories}
        series={series}
        orientation="horizontal"
        stacked
      />,
    );
    expect(
      screen.getByRole("img", { name: /Stacked applications \(stacked horizontal bar chart/i }),
    ).toBeInTheDocument();
  });
});

describe("LineChart", () => {
  const categories = ["Oct W1", "Oct W2", "Oct W3"];
  const series = [
    { id: "title", label: "Title accuracy", data: [91, 94, 96] },
    { id: "price", label: "Price accuracy", data: [88, 90, 93] },
  ];

  it("renders multi-series lines, keyboard-focusable points with tooltip, and Show data table", () => {
    render(<LineChart label="Field accuracy" categories={categories} series={series} area />);
    expect(screen.getByRole("img", { name: /Field accuracy \(area chart, 2 series/i })).toBeInTheDocument();

    const point = screen.getByRole("button", { name: "Oct W1, Title accuracy: 91" });
    fireEvent.focus(point);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Oct W1");

    fireEvent.keyDown(point, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "Oct W2, Title accuracy: 94" })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Show data" }));
    expect(screen.getByRole("table", { name: "Field accuracy data" })).toBeInTheDocument();
  });
});

describe("DonutChart", () => {
  it("caps slices at 6 by grouping excess into Other, shows centre total, tooltip and data table", () => {
    const slices = [
      { label: "Approved", value: 400 },
      { label: "Imported", value: 200 },
      { label: "Needs review", value: 100 },
      { label: "Unverified", value: 80 },
      { label: "Rejected", value: 60 },
      { label: "Pending", value: 40 },
      { label: "Archived", value: 20 },
    ];
    render(<DonutChart label="Record states" data={slices} />);
    const img = screen.getByRole("img", { name: /Record states \(total 900, 6 slices\)/i });
    expect(img).toBeInTheDocument();

    const otherBtn = screen.getByRole("button", { name: /Other: 60/i });
    fireEvent.focus(otherBtn);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Other");

    fireEvent.click(screen.getByRole("button", { name: "Show data" }));
    expect(screen.getByRole("table", { name: "Record states data" })).toBeInTheDocument();
  });
});

describe("Heatmap", () => {
  it("supports 2D arrow-key cell navigation, tooltip and Show data table", () => {
    render(
      <Heatmap
        label="Import activity"
        rows={["Mon", "Tue"]}
        columns={["W1", "W2"]}
        values={[
          [10, 20],
          [30, 40],
        ]}
      />,
    );
    expect(
      screen.getByRole("img", { name: /Import activity \(2 rows by 2 columns, total 100/i }),
    ).toBeInTheDocument();

    const firstCell = screen.getByRole("button", { name: /Mon, W1: 10/i });
    fireEvent.focus(firstCell);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Mon · W1");

    fireEvent.keyDown(firstCell, { key: "ArrowDown" });
    expect(screen.getByRole("button", { name: /Tue, W1: 30/i })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Show data" }));
    expect(screen.getByRole("table", { name: "Import activity data" })).toBeInTheDocument();
  });
});

describe("ChartLegend, ChartTooltip and ChartFrame", () => {
  it("renders ChartLegend items and ChartTooltip rows", () => {
    render(
      <>
        <ChartLegend items={[{ label: "Approved", value: "840" }]} />
        <ChartTooltip label="W1" items={[{ label: "Approved", value: "142" }]} />
      </>,
    );
    expect(screen.getByRole("list", { name: "Chart legend" })).toHaveTextContent("Approved");
    expect(screen.getByRole("tooltip")).toHaveTextContent("142");
  });

  it("renders ChartFrame default, table toggle, loading, empty and error states", () => {
    const { rerender } = render(
      <ChartFrame
        title="Weekly imports"
        description="Processed records"
        dataTable={{
          caption: "Weekly imports table",
          headers: ["Week", "Count"],
          rows: [["W1", 142]],
        }}
      >
        <div>Chart body</div>
      </ChartFrame>,
    );
    expect(screen.getByText("Chart body")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show data" }));
    expect(screen.getByRole("table", { name: "Weekly imports table" })).toBeInTheDocument();

    rerender(<ChartFrame title="Weekly imports" state="loading" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");

    rerender(<ChartFrame title="Weekly imports" state="empty" emptyTitle="No records yet" />);
    expect(screen.getByText("No records yet")).toBeInTheDocument();

    rerender(<ChartFrame title="Weekly imports" state="error" error="Query timed out" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Query timed out");
  });
});
