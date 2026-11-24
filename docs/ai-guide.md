# Kalaa for AI agents: data-first blocks and templates

Kalaa ships ready-made **Blocks** and full-page **Templates** designed so AI assistants and developers can generate complete, WCAG 2.2 AA accessible pages—such as web resumes, engineering portfolios and product landing pages—from plain JSON data without writing custom CSS.

## Installation and Setup

### 1. Installation

> **Not on npm yet.** `npm install @kalaa/react @kalaa/tokens` currently fails with `npm ERR! 404 Not Found`, because the packages have not been published to the npm registry. Install the tarballs from the [v0.3.2 GitHub Release](https://github.com/shashankshekhar2909/kalaa/releases/tag/v0.3.2) instead. Once Kalaa is on npm, a plain `npm install` will work and this note will go away.

#### Install from the GitHub Release

```bash
dl=https://github.com/shashankshekhar2909/kalaa/releases/download/v0.3.2
mkdir -p vendor
for f in kalaa-tokens-0.3.1.tgz kalaa-react-0.3.2.tgz SHA256SUMS; do curl -fL --output-dir vendor -O "$dl/$f"; done
(cd vendor && sha256sum -c --ignore-missing SHA256SUMS)
npm install ./vendor/kalaa-tokens-0.3.1.tgz ./vendor/kalaa-react-0.3.2.tgz   # or: pnpm add ./vendor/kalaa-tokens-0.3.1.tgz ./vendor/kalaa-react-0.3.2.tgz
```

Maintainers build the tarballs with `scripts/release-pack.sh` (output in `release/`).

### 2. Stylesheet import order

Always import stylesheets in this exact order at your application root:

```tsx
import "@kalaa/tokens/tokens.css"; // 1. DTCG tokens and CSS custom properties
import "@kalaa/tokens/fonts.css"; // 2. Self-hosted IBM Plex font definitions
import "@kalaa/react/styles.css"; // 3. Component classes and layouts
```

### 3. SSR & First-Paint Theme Guidance

To eliminate first-paint flash (FOUC) during SSR, set theme attributes directly on `<html>` at render time:

```html
<html data-theme="dark" data-accent="neel" data-shape="square"></html>
```

Or inject a blocking inline script inside `<head>` to read preferences from `localStorage` before page body render.

## Why blocks and templates are exported from `@kalaa/react`

All blocks, templates, TypeScript data types (`ResumeData`, `PortfolioData`, `LandingPageData`), JSON Schema objects (`resumeDataSchema`, `portfolioDataSchema`), schema validators (`validateResumeData`, `validatePortfolioData`) and fictional sample payloads (`sampleResumeData`, `samplePortfolioData`, `sampleLandingPageData`) are exported directly from the main `@kalaa/react` entry point (and JSON Schema / manifest files are also exposed as package subpath exports):

1. **Single import path for AI code generation**: Models do not have to guess whether a component lives in `@kalaa/react` or a secondary subpath; `import { ResumePage, Card, Badge, type ResumeData } from "@kalaa/react"` always works.
2. **Zero bundler or workspace configuration**: Existing Vite, Next.js, Storybook and Vitest setups resolve `@kalaa/react` out of the box while keeping full ESM tree-shaking.
3. **Direct machine-readable file exports**: Tools that read static files can resolve `@kalaa/react/resume.schema.json`, `@kalaa/react/portfolio.schema.json`, `@kalaa/react/sample-resume.json`, `@kalaa/react/components.json` and `@kalaa/react/llms.txt`.

## 1. Data-first workflow (recommended for AI)

Instead of assembling ad-hoc JSX trees and custom stylesheets, populate a typed JSON payload and pass it to a template:

### Web & print resume (`ResumeData` -> `ResumePage`)

```tsx
import "@kalaa/tokens/tokens.css";
import "@kalaa/tokens/fonts.css";
import "@kalaa/react/styles.css";
import { ResumePage, validateResumeData, type ResumeData } from "@kalaa/react";

const resume: ResumeData = {
  basics: {
    name: "Aarav Deshmukh",
    title: "Principal Systems Architect",
    location: "Pune, India",
    email: "aarav.deshmukh@example.invalid",
    links: [{ label: "GitHub", href: "https://github.example.invalid/aarav-deshmukh" }],
  },
  summary: {
    text: "Systems architect with 11 years designing deterministic telemetry pipelines and accessible operator consoles.",
    highlights: ["Cut regional failover recovery from 14 minutes to 22 seconds"],
  },
  experience: [
    {
      role: "Principal Systems Architect",
      org: "Vayu Grid Systems",
      location: "Pune, India",
      startDate: "2023-04",
      endDate: "Present",
      bullets: [
        "Re-architected the substation event ingestion pipeline in Rust and Go, sustaining 1.4M events/s.",
      ],
      tags: ["Rust", "Go", "TypeScript"],
    },
  ],
  education: [
    {
      degree: "M.Tech in Computer Science and Engineering",
      institution: "Visvesvaraya Institute of Technology",
      startDate: "2014",
      endDate: "2016",
    },
  ],
  skills: [{ category: "Systems & backend", skills: ["Rust", "Go", "TypeScript", "PostgreSQL"] }],
};

// Optional runtime validation against resume.schema.json
const check = validateResumeData(resume);
if (!check.valid) throw new Error(check.errors.join("\n"));

export function CandidateResume() {
  return <ResumePage data={resume} layout="sidebar" paperSize="a4" />;
}
```

### Personal portfolio (`PortfolioData` -> `PortfolioPage`)

```tsx
import { PortfolioPage, samplePortfolioData, validatePortfolioData } from "@kalaa/react";

const check = validatePortfolioData(samplePortfolioData);
if (!check.valid) throw new Error(check.errors.join("\n"));

export function ArchitectPortfolio() {
  return <PortfolioPage data={samplePortfolioData} />;
}
```

### Product landing page (`LandingPageData` -> `LandingPage`)

```tsx
import { LandingPage, sampleLandingPageData } from "@kalaa/react";

export function ProductHome() {
  return <LandingPage data={sampleLandingPageData} />;
}
```

## 2. Component and block catalogue

When you need a custom page layout, compose from Kalaa's four higher-level categories alongside core `Components/*`:

| Category                     | Components                                                                                                                                                                           | Purpose                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Templates`                  | `ResumePage`, `PortfolioPage`, `LandingPage`                                                                                                                                         | Full pages rendered from one JSON-serialisable `data` prop with landmarks (`header`, `nav`, `main`, `aside`, `footer`) and print stylesheets |
| `Blocks/Resume`              | `ResumeHeader`, `Summary`, `ExperienceList`, `ExperienceItem`, `EducationList`, `SkillGroups`, `ProjectList`, `ProjectCard`, `Certifications`, `Languages`, `Awards`, `Publications` | Modular resume sections with `<time>` dates, tech `Badge` tags and `break-inside: avoid` print rules                                         |
| `Blocks/Profile & portfolio` | `ProfileCard`, `CaseStudyCard`, `Timeline`, `TestimonialCard`, `ContactCard`, `LinkList`                                                                                             | Personal branding, case study challenge/outcome cards, ordered milestone timelines and contact blocks                                        |
| `Blocks/Marketing`           | `Hero`, `FeatureGrid`, `StatsBand`, `CTA`, `FAQ`, `PageFooter`, `SectionHeader`                                                                                                      | Product launches, benchmark bands, native `<details>` FAQ disclosures and multi-column footers                                               |

## 3. Accessibility, semantics and print guarantees

- **Ordered headings**: Templates start with a single `<h1>` (`ResumeHeader` in `ResumePage`, brand header in `PortfolioPage`, `Hero` in `LandingPage`), use `<h2>` for every top-level section, and pass `headingLevel={3}` (`<h3>`) to nested cards and items. Never skip heading levels.
- **Landmarks**: Templates provide `<header>`, uniquely labelled `<nav aria-label="...">` regions, `<main>`, `<aside>` (when `layout="sidebar"` in `ResumePage`) and `<footer>`.
- **Semantic dates**: Every date or year is wrapped in `<time dateTime="...">` (except the literal string `"Present"`).
- **Works without JavaScript**: All blocks and templates render complete semantic HTML via `react-dom/server` (`FAQ` uses native `<details>` and `<summary>`).
- **Print-ready (black-on-white even in dark mode)**: `ResumePage` includes `@media print` and `@page` rules for A4 (`210mm`) and US Letter (`8.5in`), keeps DOM reading order linear for ATS parsers (`header` -> `main` experience/projects -> `aside` education/skills), and remaps semantic colour roles (`--kalaa-bg`, `--kalaa-surface`, `--kalaa-text`, etc.) to light palette tokens so printing from a dark-themed browser always outputs crisp black text on white paper.

## 4. Machine-readable manifest (`components.json` and `llms.txt`)

`packages/react/scripts/ai-manifest.mjs` parses component TypeScript definitions, default parameter values, JSDoc comments and Storybook `Usage` blocks to generate:

- `packages/react/components.json`: structured JSON catalogue with `name`, `category`, `purpose`, `props` (`name`, `type`, `required`, `default`, `description`) and `example`.
- `packages/react/llms.txt`: compact markdown reference for LLM context windows.

Regenerate after editing any component prop or JSDoc:

```bash
node packages/react/scripts/ai-manifest.mjs
node packages/react/scripts/ai-manifest.mjs --check
```

A Vitest suite (`packages/react/src/schemas/ai-manifest.test.tsx`) fails if `components.json` or `llms.txt` drifts from source.

## 5. Block-local elements to swap with Lane A primitives

To keep parallel lane work conflict-free, the following block-local elements are styled with `kl-` classes and `--kalaa-*` tokens and can be swapped for Lane A's primitives in a follow-up cleanup:

1. **Monogram avatar circle** in `ProfileCard` (`.kl-profile-card__avatar`) -> swap with `<Avatar />`.
2. **Tabular KPI figures** in `StatsBand` (`.kl-stats-band__item`) and `ProfileCard` (`.kl-profile-card__stat`) -> swap with `<Stat />`.
3. **Inline text anchors** in `ResumeHeader`, `ProjectCard`, `Certifications`, `Awards`, `ContactCard`, `LinkList`, `FeatureGrid`, `PageFooter` -> swap with `<Link />`.
4. **Section border rules** in `ResumeHeader`, `ProfileCard`, `PageFooter` -> swap with `<Divider />`.
