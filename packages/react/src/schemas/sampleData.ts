import type { LandingPageData, PortfolioData, ResumeData } from "./types";
import sampleResumeJson from "../../schemas/sample-resume.json";

/**
 * Complete sample resume data for a fictional person (Aarav Deshmukh).
 * Loaded directly from `packages/react/schemas/sample-resume.json`.
 */
export const sampleResumeData: ResumeData = sampleResumeJson as ResumeData;

/**
 * Complete sample portfolio data for a fictional systems architect (Aarav Deshmukh).
 */
export const samplePortfolioData: PortfolioData = {
  navigation: [
    { label: "Case studies", href: "#case-studies" },
    { label: "Projects", href: "#projects" },
    { label: "Timeline", href: "#timeline" },
    { label: "Contact", href: "#contact" },
  ],
  profile: {
    name: "Aarav Deshmukh",
    role: "Principal Systems Architect",
    location: "Pune, India · IST (UTC+5:30)",
    bio: "I design high-throughput telemetry engines and calm, keyboard-first operator consoles for critical infrastructure teams.",
    availability: "Available for Q1 architecture reviews",
    initials: "AD",
    skills: ["Rust", "Go", "TypeScript", "React 19", "Design Systems", "OpenTelemetry"],
    stats: [
      { label: "Events ingested", value: "1.4M/s", detail: "Sustained p99 under 18 ms" },
      { label: "Operator views unified", value: "42", detail: "0 WCAG 2.2 AA violations" },
      { label: "Failover recovery", value: "22 s", detail: "Down from 14 minutes" },
    ],
    primaryAction: { label: "Book architecture review", href: "#contact" },
    secondaryAction: { label: "View case studies", href: "#case-studies" },
  },
  caseStudies: [
    {
      title: "Substation telemetry pipeline overhaul",
      client: "Vayu Grid Systems",
      year: "2025",
      summary:
        "Replaced a brittle polling collector with a bounded-memory Rust stream compactor across 180 regional substations.",
      challenge:
        "Monsoon fault storms caused 14-minute failover stalls and unbounded heap growth on regional concentrators.",
      outcome:
        "Sustained 1.4M events/s with deterministic 22-second regional failover and 54% lower write amplification.",
      metrics: [
        { label: "Recovery time", value: "22 s" },
        { label: "p99 ingest latency", value: "18 ms" },
      ],
      tags: ["Rust", "Time-series", "Resilience"],
      href: "https://aarav-systems.example.invalid/case-studies/substation-telemetry",
      ctaLabel: "Read telemetry case study",
    },
    {
      title: "Drishti unified operator workbench",
      client: "Vayu Grid Systems",
      year: "2026",
      summary:
        "Consolidated 19 legacy dispatch tools into a single accessible React and token-driven console.",
      challenge:
        "Dispatch operators juggled inconsistent colour codes and mouse-only modals during high-pressure grid alerts.",
      outcome:
        "Cut incident triage time by 58% while passing automated WCAG 2.2 AA and keyboard audits across 140 screens.",
      metrics: [
        { label: "Triage speed", value: "2.4x faster" },
        { label: "Accessibility defects", value: "0" },
      ],
      tags: ["React 19", "Design Tokens", "Accessibility"],
      href: "https://aarav-systems.example.invalid/case-studies/drishti-workbench",
      ctaLabel: "Read workbench case study",
    },
  ],
  projects: sampleResumeData.projects,
  timeline: [
    {
      id: "vayu-2023",
      date: "2023-04",
      endDate: "Present",
      title: "Principal Systems Architect",
      subtitle: "Vayu Grid Systems · Pune",
      description: "Leading telemetry storage architecture and the Drishti operator design system.",
      badge: "Current",
    },
    {
      id: "narmada-2019",
      date: "2019-07",
      endDate: "2023-03",
      title: "Staff Platform Engineer",
      subtitle: "Narmada Cloud Labs · Bengaluru",
      description: "Built schema validation gateways and zero-copy control-plane batching.",
      badge: "Platform",
    },
    {
      id: "deccan-2016",
      date: "2016-06",
      endDate: "2019-06",
      title: "Senior Software Engineer",
      subtitle: "Deccan Telemetry · Hyderabad",
      description: "Shipped store-and-forward sensor collectors for rail freight networks.",
      badge: "Edge",
    },
  ],
  skills: sampleResumeData.skills,
  testimonials: [
    {
      quote:
        "Aarav turned our most fragile telemetry service into the calmest part of our stack, and the new operator console cut dispatch training time in half.",
      author: "Meera Kulkarni",
      role: "VP of Engineering",
      org: "Vayu Grid Systems",
      date: "2026-02",
      context: "Grid telemetry & Drishti console migration",
    },
    {
      quote:
        "His schema gateway caught every breaking change before staging while keeping build checks under four seconds.",
      author: "RohanVerma",
      role: "Director of Platform Reliability",
      org: "Narmada Cloud Labs",
      date: "2023-01",
      context: "Control-plane reliability programme",
    },
  ],
  links: [
    {
      label: "Deterministic rollup compaction paper",
      href: "https://papers.example.invalid/sits-2025-rollup",
      description: "Symposium on Industrial Telemetry Systems (2025)",
      meta: "Paper",
    },
    {
      label: "Pravah stream compactor repository",
      href: "https://github.example.invalid/vayu-grid/pravah",
      description: "Bounded-memory time-series compactor in Rust",
      meta: "GitHub",
    },
  ],
  contact: {
    title: "Start a technical conversation",
    description:
      "Available for systems architecture advisories, telemetry audits and design-system foundations.",
    email: "aarav.deshmukh@example.invalid",
    phone: "+91 20 5550 0194",
    location: "Pune, India",
    availability: "2 advisory days per month",
    responseTime: "Within 1 business day",
    ctaLabel: "Email Aarav Deshmukh",
    links: [
      { label: "GitHub", href: "https://github.example.invalid/aarav-deshmukh" },
      { label: "Publications", href: "https://papers.example.invalid/aarav-deshmukh" },
    ],
  },
  footer: {
    brandName: "Aarav Deshmukh",
    tagline: "Calm infrastructure and accessible operator tools.",
    columns: [
      {
        heading: "Work",
        links: [
          { label: "Case studies", href: "#case-studies" },
          { label: "Open source", href: "#projects" },
          { label: "Resume", href: "#timeline" },
        ],
      },
      {
        heading: "Writing",
        links: [
          { label: "Telemetry compaction", href: "https://papers.example.invalid/sits-2025-rollup" },
          { label: "Operator console patterns", href: "https://aarav-systems.example.invalid/notes" },
        ],
      },
    ],
    links: [
      { label: "Email", href: "mailto:aarav.deshmukh@example.invalid" },
      { label: "GitHub", href: "https://github.example.invalid/aarav-deshmukh" },
    ],
    copyright: "© 2026 Aarav Deshmukh (fictional sample portfolio).",
    showLogo: true,
  },
};

/**
 * Complete sample landing page data for a fictional operational product (Pravah Telemetry Cloud).
 */
export const sampleLandingPageData: LandingPageData = {
  brandName: "Pravah Telemetry",
  navigation: [
    { label: "Features", href: "#features" },
    { label: "Benchmarks", href: "#stats" },
    { label: "Customers", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ],
  headerAction: { label: "Start free trial", href: "#cta" },
  hero: {
    eyebrow: "Release 2.4 · Deterministic edge compaction",
    title: "Calm telemetry for high-voltage operations",
    description:
      "Ingest, compact and inspect millions of sensor events per second with predictable memory bounds and an accessible operator console built on Kalaa.",
    primaryAction: { label: "Deploy sample cluster", href: "#cta" },
    secondaryAction: { label: "Read architecture whitepaper", href: "#features" },
    highlights: [
      "Deterministic 18 ms p99 ingest",
      "Zero external font or runtime scripts",
      "WCAG 2.2 AA verified in light and dark",
    ],
  },
  stats: {
    heading: "Measured under real substation fault bursts",
    description: "Benchmarked across 180 regional concentrators over 90 days.",
    items: [
      { label: "Ingest throughput", value: "1.4M/s", detail: "Per 4-core regional node" },
      { label: "Write amplification", value: "1.18x", detail: "54% lower than LSM baseline" },
      { label: "Failover recovery", value: "22 s", detail: "Zero dropped frames" },
      { label: "Accessibility score", value: "100%", detail: "Automated axe + keyboard suite" },
    ],
  },
  features: {
    heading: "Engineered for predictable operations",
    description: "Every layer is inspectable, schema-validated and operable from the keyboard.",
    items: [
      {
        title: "Bounded-memory stream compactor",
        description:
          "Fixed ring buffers guarantee zero out-of-memory restarts during monsoon telemetry spikes.",
        badge: "Storage",
        href: "#cta",
        linkLabel: "Explore storage engine",
      },
      {
        title: "Schema-checked ingestion gateway",
        description:
          "Reject malformed payloads at the edge with Draft 2020-12 JSON Schema validation and audit logs.",
        badge: "Governance",
        href: "#cta",
        linkLabel: "Inspect schema rules",
      },
      {
        title: "Accessible triage workbench",
        description:
          "Built with Kalaa tokens and Base UI primitives for full keyboard navigation and instant print reports.",
        badge: "Console",
        href: "#cta",
        linkLabel: "Tour the console",
      },
    ],
  },
  testimonials: {
    heading: "Trusted by regional infrastructure teams",
    description: "Operators and platform architects on switching to Pravah.",
    items: samplePortfolioData.testimonials ?? [],
  },
  faq: {
    heading: "Frequently asked questions",
    description: "Deployment, licensing and operational guarantees.",
    items: [
      {
        question: "Does the operator console work without client-side JavaScript?",
        answer:
          "Yes. Every report, resume, runbook and disclosure renders valid semantic HTML on the server and prints cleanly in black-on-white.",
      },
      {
        question: "How are themes and accents configured?",
        answer:
          "Set data-accent (neel, geru, mayur), data-theme (light, dark) and data-shape (square, soft) on html or any nested container.",
      },
      {
        question: "Can AI agents generate views directly from JSON?",
        answer:
          "Yes. Populate a JSON payload conforming to ResumeData, PortfolioData or LandingPageData and pass it straight to the template component.",
      },
    ],
  },
  cta: {
    title: "Ready to calm your telemetry stack?",
    description: "Run the self-contained simulator locally or vendor the tarball into your cluster.",
    primaryAction: { label: "Download evaluation tarball", href: "#download" },
    secondaryAction: { label: "Talk to an architect", href: "mailto:aarav.deshmukh@example.invalid" },
    note: "Self-hosted, air-gap compatible, zero external network calls.",
  },
  footer: {
    brandName: "Pravah Telemetry",
    tagline: "Built with Kalaa design tokens and components.",
    columns: [
      {
        heading: "Product",
        links: [
          { label: "Storage engine", href: "#features" },
          { label: "Operator console", href: "#features" },
          { label: "Benchmarks", href: "#stats" },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "JSON Schemas", href: "#faq" },
          { label: "Accessibility report", href: "#stats" },
          { label: "Documentation", href: "#faq" },
        ],
      },
    ],
    links: [
      { label: "Security", href: "#faq" },
      { label: "Privacy", href: "#faq" },
    ],
    copyright: "© 2026 Pravah Telemetry Systems (fictional sample).",
    showLogo: true,
  },
};
