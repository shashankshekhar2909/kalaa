import { writeFileSync } from "node:fs";
// Anchors are retained verbatim; intermediate colours are interpolated in OKLCH.
const anchors = {
  neel: { 50: "#E6E8F5", 300: "#B9C1F6", 400: "#9EA9F2", 700: "#2E3A8C", 800: "#232D6E", 950: "#1F2546" },
  geru: { 50: "#F4E2D9", 300: "#F3AE95", 400: "#EE9473", 700: "#9A3E21", 800: "#7D3119", 950: "#3A2219" },
  mayur: { 50: "#DCEEEE", 300: "#86D3D4", 400: "#62C3C4", 700: "#0E676D", 800: "#0A5055", 950: "#133437" },
  // Neutral anchors are ordered light -> dark (step number = darkness), so interpolation never doubles back.
  "neel-neutral": {
    0: "#FFFFFF",
    50: "#F4F4F0",
    100: "#E6E7EF",
    150: "#E1E1DA",
    400: "#A2A6BC",
    500: "#7E8298",
    550: "#686C82",
    600: "#5B6075",
    800: "#2A2E44",
    900: "#1B1F33",
    925: "#171A28",
    950: "#10121C",
  },
  "geru-neutral": {
    0: "#FFFDFA",
    50: "#F6F1EB",
    100: "#F0E7E1",
    150: "#E7DDD2",
    400: "#B6A69C",
    500: "#908178",
    550: "#786961",
    600: "#6C5D55",
    800: "#3A2D27",
    900: "#2A1E19",
    925: "#1F1815",
    950: "#16110F",
  },
  "mayur-neutral": {
    0: "#FFFFFF",
    50: "#F1F5F3",
    100: "#E2EDEC",
    150: "#DBE4E1",
    400: "#9DB3B3",
    500: "#778E90",
    550: "#5A7175",
    600: "#536A6E",
    800: "#24363A",
    900: "#13262A",
    925: "#121E21",
    950: "#0C1517",
  },
  green: { 50: "#E4F3EA", 400: "#64C793", 700: "#1F7A4D", 950: "#14301F" },
  amber: { 50: "#FBF0DC", 400: "#E6B450", 700: "#94600A", 950: "#33270F" },
  red: { 50: "#FBE7E4", 400: "#F0857B", 700: "#B42318", 950: "#3A1715" },
  crimson: { 50: "#F8E1EA", 400: "#F27DA6", 700: "#A3184A", 950: "#3A1424" },
  "chart-indigo": { 50: "#E8EFFC", 400: "#6CA0FF", 700: "#2456B3", 950: "#122347" },
  "chart-ochre": { 50: "#FCECE4", 400: "#F28B54", 700: "#B84A14", 950: "#3D1B0A" },
  "chart-teal": { 50: "#E0F5F2", 400: "#3CC7B4", 700: "#0C7468", 950: "#0A2E2A" },
  "chart-plum": { 50: "#F4E8F8", 400: "#C888E8", 700: "#7A338C", 950: "#2E1336" },
  "chart-gold": { 50: "#FBF3DC", 400: "#E6B84A", 700: "#8F6800", 950: "#332604" },
  "chart-cyan": { 50: "#E2F4FA", 400: "#5AC8F5", 700: "#0A769E", 950: "#082B3B" },
  "chart-rose": { 50: "#FCE6EE", 400: "#F576A3", 700: "#B52259", 950: "#3B0D1F" },
  "chart-moss": { 50: "#EEF5E4", 400: "#98C850", 700: "#4E6818", 950: "#1D260A" },
  "chart-sequential": {
    50: "#E6F0FA",
    200: "#C2DCFF",
    300: "#96BFF5",
    400: "#72A1E0",
    500: "#5984C2",
    600: "#46689E",
    650: "#477CB3",
    700: "#2F68A3",
    800: "#1D518A",
    900: "#123B6E",
    950: "#0A274E",
  },
  "chart-diverging": {
    50: "#FCEAE3",
    200: "#F58264",
    300: "#C9684F",
    400: "#C45A38",
    450: "#9E3316",
    500: "#858C9E",
    550: "#687082",
    600: "#3D9E9B",
    700: "#2A7D7B",
    800: "#0B5C5A",
    900: "#6CE0DC",
    950: "#073B3A",
  },
};
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const neutralSteps = [0, 50, 100, 150, 200, 300, 400, 500, 550, 600, 700, 800, 850, 900, 925, 950];
function toLab(hex) {
  let [r, g, b] = hex
    .match(/\w\w/g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  let l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b),
    m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b),
    s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  let L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(a, bb), Math.atan2(bb, a)];
}
function toHex([L, C, h]) {
  let a = C * Math.cos(h),
    b = C * Math.sin(h),
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return (
    "#" +
    [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]
      .map((x) =>
        Math.round(
          Math.max(0, Math.min(1, x <= 0.0031308 ? 12.92 * x : 1.055 * Math.max(0, x) ** (1 / 2.4) - 0.055)) *
            255,
        )
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
      .toUpperCase()
  );
}
const out = { palette: {} };
for (const [name, points] of Object.entries(anchors)) {
  out.palette[name] = {};
  const keys = Object.keys(points)
    .map(Number)
    .sort((a, b) => a - b);
  const neutral = name.endsWith("-neutral");
  for (const step of [...new Set([...(neutral ? neutralSteps : steps), ...keys])].sort((a, b) => a - b)) {
    let value = points[step];
    if (!value) {
      const lo = keys.filter((k) => k < step).at(-1) ?? keys[0],
        hi = keys.find((k) => k > step) ?? keys.at(-1),
        t = lo === hi ? 0 : (step - lo) / (hi - lo),
        a = toLab(points[lo]),
        b = toLab(points[hi]);
      let dh = b[2] - a[2];
      if (dh > Math.PI) dh -= 2 * Math.PI;
      if (dh < -Math.PI) dh += 2 * Math.PI;
      if (neutral) {
        const ca = [a[1] * Math.cos(a[2]), a[1] * Math.sin(a[2])],
          cb = [b[1] * Math.cos(b[2]), b[1] * Math.sin(b[2])],
          x = ca[0] + t * (cb[0] - ca[0]),
          y = ca[1] + t * (cb[1] - ca[1]);
        value = toHex([a[0] + t * (b[0] - a[0]), Math.hypot(x, y), Math.atan2(y, x)]);
      } else value = toHex([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]), a[2] + t * dh]);
    }
    out.palette[name][step] = { $type: "color", $value: value };
  }
}
writeFileSync(new URL("../src/palette.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
