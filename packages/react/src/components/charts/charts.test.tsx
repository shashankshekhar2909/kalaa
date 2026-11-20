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

    // Explicit bounds never produce ticks outside the domain
    const bounded = linearScale([73, 100], [200, 0]);
    const boundedTicks = bounded.ticks(5);
    expect(boundedTicks.length).toBeGreaterThanOrEqual(4);
    for (const tick of boundedTicks) {
      expect(tick).toBeGreaterThanOrEqual(73);
      expect(tick).toBeLessThanOrEqual(100);
    }
  });

  it("falls back to window resize when ResizeObserver is unavailable and ignores zero-width measurements", () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    // @ts-expect-error simulating environment without ResizeObserver
    delete globalThis.ResizeObserver;
    try {
      let currentWidth = 420;
      const clientWidthSpy = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get: () => currentWidth,
      });

      render(
        <BarChart
          label="Resize fallback chart"
          categories={["W1", "W2"]}
          series={[{ label: "A", data: [10, 20] }]}
        />,
      );
      const svg = screen.getByRole("img", { name: /Resize fallback chart/i });
      expect(svg).toHaveAttribute("width", "420");

      // Zero-width observation while hidden is ignored
      currentWidth = 0;
      fireEvent(window, new Event("resize"));
      expect(svg).toHaveAttribute("width", "420");

      // Subsequent valid width is applied
      currentWidth = 640;
      fireEvent(window, new Event("resize"));
      expect(svg).toHaveAttribute("width", "640");

      if (clientWidthSpy) {
        Object.defineProperty(HTMLElement.prototype, "clientWidth", clientWidthSpy);
      }
    } finally {
      globalThis.ResizeObserver = originalResizeObserver;
    }
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
    const secondBar = screen.getByRole("button", { name: "W1, Needs review: 20" });

    // Roving tabIndex: only one entry point in normal Tab order
    expect(firstBar).toHaveAttribute("tabindex", "0");
    expect(secondBar).toHaveAttribute("tabindex", "-1");

    fireEvent.focus(firstBar);
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("W1");
    expect(tooltip).toHaveTextContent("120");
    expect(firstBar.getAttribute("aria-describedby")).toContain(tooltip.id);

    // Meaningful activation: clicking / Enter / Space pins and unpins the tooltip
    expect(firstBar).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(firstBar);
    expect(firstBar).toHaveAttribute("aria-pressed", "true");
    fireEvent.blur(firstBar);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.click(firstBar);
    expect(firstBar).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByRole("tooltip")).toBeNull();

    fireEvent.focus(firstBar);
    fireEvent.keyDown(firstBar, { key: "ArrowRight" });
    expect(secondBar).toHaveFocus();
    expect(secondBar).toHaveAttribute("tabindex", "0");
    expect(firstBar).toHaveAttribute("tabindex", "-1");

    fireEvent.keyDown(secondBar, {
      key: "Escape",
    });
    expect(screen.queryByRole("tooltip")).toBeNull();

    const toggle = screen.getByRole("button", { name: "Show data" });
    const controlledId = toggle.getAttribute("aria-controls")!;
    expect(controlledId).toBeTruthy();
    expect(document.getElementById(controlledId)).toHaveAttribute("hidden");

    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Hide data" })).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById(controlledId)).not.toHaveAttribute("hidden");
    expect(screen.getByRole("table", { name: "Weekly imports data" })).toBeInTheDocument();
  });

  it("supports horizontal and stacked modes and negative values on both sides of the baseline", () => {
    const { container } = render(
      <BarChart
        label="Net inventory delta"
        categories={["W1", "W2"]}
        series={[
          { id: "add", label: "Added", data: [30, -10] },
          { id: "adj", label: "Adjusted", data: [-15, -20] },
        ]}
        stacked
      />,
    );
    expect(
      screen.getByRole("img", { name: /Net inventory delta \(stacked vertical bar chart/i }),
    ).toBeInTheDocument();

    // Negative bars are drawn with non-zero height and distinct y below the zero baseline
    const rects = Array.from(container.querySelectorAll("svg > g > rect:first-child"));
    expect(rects).toHaveLength(4);
    const heights = rects.map((r) => Number(r.getAttribute("height")));
    for (const h of heights) {
      expect(h).toBeGreaterThan(10);
    }
    // W1 has positive (+30) and negative (-15) stack totals; W2 has combined negative (-30) stack total
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("-15")).toBeInTheDocument();
    expect(screen.getByText("-30")).toBeInTheDocument();
  });
});

describe("LineChart", () => {
  const categories = ["Oct W1", "Oct W2", "Oct W3"];
  const series = [
    { id: "title", label: "Title accuracy", data: [91, 94, 96] },
    { id: "price", label: "Price accuracy", data: [88, 90, 93] },
  ];

  it("renders multi-series lines, roving tabIndex points, leader-separated end labels, and Show data table", () => {
    const { container } = render(
      <LineChart label="Field accuracy" categories={categories} series={series} area yMin={73} yMax={100} />,
    );
    expect(screen.getByRole("img", { name: /Field accuracy \(area chart, 2 series/i })).toBeInTheDocument();

    // All rendered y-axis ticks lie strictly inside the plot vertical bounds [20, 224]
    const gridLines = Array.from(container.querySelectorAll(".kl-chart__gridline, .kl-chart__baseline"));
    expect(gridLines.length).toBeGreaterThan(0);
    for (const line of gridLines) {
      const y1 = Number(line.getAttribute("y1"));
      expect(y1).toBeGreaterThanOrEqual(20);
      expect(y1).toBeLessThanOrEqual(224);
    }

    // End labels are connected with leader lines and separated vertically
    expect(container.querySelectorAll(".kl-chart__leader").length).toBe(2);

    const point = screen.getByRole("button", { name: "Oct W1, Title accuracy: 91" });
    const nextPoint = screen.getByRole("button", { name: "Oct W2, Title accuracy: 94" });
    expect(point).toHaveAttribute("tabindex", "0");
    expect(nextPoint).toHaveAttribute("tabindex", "-1");

    fireEvent.focus(point);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Oct W1");

    fireEvent.keyDown(point, { key: "ArrowRight" });
    expect(nextPoint).toHaveFocus();
    expect(nextPoint).toHaveAttribute("tabindex", "0");

    const toggle = screen.getByRole("button", { name: "Show data" });
    const controlledId = toggle.getAttribute("aria-controls")!;
    expect(document.getElementById(controlledId)).toHaveAttribute("hidden");
    fireEvent.click(toggle);
    expect(screen.getByRole("table", { name: "Field accuracy data" })).toBeInTheDocument();
  });

  it("breaks lines at missing values and reports No data instead of zero", () => {
    const { container } = render(
      <LineChart
        label="Sparse metric"
        categories={["W1", "W2", "W3", "W4"]}
        series={[
          { id: "s1", label: "Observed", data: [80, null, 85, 90] },
          { id: "s2", label: "Short series", data: [70, 75] },
        ]}
        defaultShowData
      />,
    );
    const img = screen.getByRole("img", { name: /Observed from 80 to 90 \(min 80, max 90, 1 missing\)/i });
    expect(img.getAttribute("aria-label")).toMatch(
      /Short series from 70 to 75 \(min 70, max 75, 2 missing\)/i,
    );

    // No hit target is created for missing observations
    expect(screen.queryByRole("button", { name: /W2, Observed/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /W3, Short series/i })).toBeNull();

    // Only one contiguous 2-point segment [W3..W4] is drawn for Observed (since W1 is isolated by W2=null)
    const polylines = container.querySelectorAll("polyline");
    expect(polylines.length).toBe(2);

    // Tooltip and data table show "No data" instead of 0
    const w3Point = screen.getByRole("button", { name: "W3, Observed: 85" });
    fireEvent.focus(w3Point);
    expect(screen.getByRole("tooltip")).toHaveTextContent("No data");
    expect(screen.getAllByText("No data").length).toBeGreaterThanOrEqual(3);
  });
});

describe("DonutChart", () => {
  it("caps graphic slices at 6 into Other while preserving all original rows in the Show data table", () => {
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
    expect(otherBtn).toHaveAttribute("tabindex", "-1");
    fireEvent.focus(otherBtn);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Other");

    const toggle = screen.getByRole("button", { name: "Show data" });
    const controlledId = toggle.getAttribute("aria-controls")!;
    expect(document.getElementById(controlledId)).toHaveAttribute("hidden");

    fireEvent.click(toggle);
    const table = screen.getByRole("table", { name: "Record states data" });
    expect(table).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Pending (grouped in Other)" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Archived (grouped in Other)" })).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});

describe("Heatmap", () => {
  it("supports 2D arrow-key cell navigation, roving tabIndex, tooltip and Show data table", () => {
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
    const secondCell = screen.getByRole("button", { name: /Tue, W1: 30/i });
    expect(firstCell).toHaveAttribute("tabindex", "0");
    expect(secondCell).toHaveAttribute("tabindex", "-1");

    fireEvent.focus(firstCell);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Mon · W1");

    fireEvent.keyDown(firstCell, { key: "ArrowDown" });
    expect(secondCell).toHaveFocus();
    expect(secondCell).toHaveAttribute("tabindex", "0");

    fireEvent.click(screen.getByRole("button", { name: "Show data" }));
    expect(screen.getByRole("table", { name: "Import activity data" })).toBeInTheDocument();
  });

  it("maps diverging center (0) to level 3 neutral and expands SVG width for wide column counts", () => {
    const manyCols = Array.from({ length: 30 }, (_, i) => `C${i + 1}`);
    const rowValues = manyCols.map((_, i) => (i === 0 ? -1 : i === 1 ? 0 : 100));
    const { container } = render(
      <Heatmap
        label="Diverging wide matrix"
        ramp="diverging"
        rows={["R1"]}
        columns={manyCols}
        values={[rowValues]}
      />,
    );

    // 0 receives level 3 (Neutral), -1 receives level 1, 100 receives level 5
    expect(screen.getByRole("button", { name: "R1, C1: -1 (level 1 of 5)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "R1, C2: 0 (level 3 of 5)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "R1, C3: 100 (level 5 of 5)" })).toBeInTheDocument();
    expect(screen.getByText("Neutral (0)")).toBeInTheDocument();

    // SVG expands to fit all 30 columns of >=18px width without overflowing
    const svg = container.querySelector("svg.kl-chart__svg")!;
    const svgWidth = Number(svg.getAttribute("width"));
    expect(svgWidth).toBeGreaterThan(600);
    const lastHit = screen.getByRole("button", { name: "R1, C30: 100 (level 5 of 5)" });
    const leftPct = parseFloat(lastHit.style.left);
    const widthPct = parseFloat(lastHit.style.width);
    expect(leftPct + widthPct).toBeLessThanOrEqual(100);
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
