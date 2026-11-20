// Generates packages/react/components.json and packages/react/llms.txt (plus dist/ copies when dist exists)
// directly from component TypeScript source, JSDoc and Storybook stories so the AI manifest never drifts.
//   node packages/react/scripts/ai-manifest.mjs           generate files
//   node packages/react/scripts/ai-manifest.mjs --check   fail if on-disk files are stale
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(scriptDir, "..");
const srcRoot = join(pkgRoot, "src");

function cleanJsDoc(raw) {
  if (!raw) return "";
  return raw
    .replace(/^\/\*\*?/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .filter((line) => line && !line.startsWith("@"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function findMatchingBrace(text, openIndex) {
  let depth = 0;
  let inString = null;
  for (let i = openIndex; i < text.length; i++) {
    const ch = text[i];
    const prev = i > 0 ? text[i - 1] : "";
    if (inString) {
      if (ch === inString && prev !== "\\") inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

export function parsePropertiesBlock(blockText) {
  const props = [];
  let i = 0;
  const len = blockText.length;
  let lastDoc = "";

  while (i < len) {
    while (i < len && /[\s;,]/.test(blockText[i])) i++;
    if (i >= len) break;

    if (blockText.startsWith("/**", i)) {
      const end = blockText.indexOf("*/", i + 3);
      if (end === -1) break;
      lastDoc = cleanJsDoc(blockText.slice(i, end + 2));
      i = end + 2;
      continue;
    }
    if (blockText.startsWith("//", i)) {
      const nl = blockText.indexOf("\n", i + 2);
      i = nl === -1 ? len : nl + 1;
      continue;
    }

    // Read one top-level property declaration up to `;` or newline at depth 0
    let start = i;
    let brace = 0;
    let bracket = 0;
    let paren = 0;
    let angle = 0;
    let inString = null;
    while (i < len) {
      const ch = blockText[i];
      const prev = i > 0 ? blockText[i - 1] : "";
      if (inString) {
        if (ch === inString && prev !== "\\") inString = null;
        i++;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        i++;
        continue;
      }
      if (ch === "{") brace++;
      else if (ch === "}") brace = Math.max(0, brace - 1);
      else if (ch === "[") bracket++;
      else if (ch === "]") bracket = Math.max(0, bracket - 1);
      else if (ch === "(") paren++;
      else if (ch === ")") paren = Math.max(0, paren - 1);
      else if (ch === "<") angle++;
      else if (ch === ">" && prev !== "=") angle = Math.max(0, angle - 1);
      else if (brace === 0 && bracket === 0 && paren === 0 && angle === 0 && (ch === ";" || ch === "\n")) {
        i++;
        break;
      }
      i++;
    }

    const statement = blockText.slice(start, i).trim().replace(/[;,]$/, "").trim();
    if (!statement) continue;

    const match = statement.match(/^(?:readonly\s+)?(["']?[\w-]+["']?)(\??)\s*:\s*([\s\S]+)$/);
    if (match) {
      const rawName = match[1].replace(/^["']|["']$/g, "");
      const optional = match[2] === "?";
      const typeStr = match[3].replace(/\s+/g, " ").trim();
      props.push({
        name: rawName,
        type: typeStr,
        required: !optional,
        default: null,
        description: lastDoc,
      });
    }
    lastDoc = "";
  }

  return props;
}

export function extractTypeDefinitions(source, registry = new Map()) {
  const declRegex =
    /(?:export\s+)?(interface|type)\s+([A-Za-z0-9_]+)(?:<[^{=;]+>)?\s*(?:extends\s+([^{=]+)|=\s*([^;{]+))?/g;
  for (const match of source.matchAll(declRegex)) {
    const kind = match[1];
    const name = match[2];
    const afterDecl = match.index + match[0].length;

    const refs = [];
    const headerSlice = source.slice(match.index, afterDecl + 120);
    for (const refMatch of headerSlice.matchAll(/(?:extends|&|=)\s*([A-Z][A-Za-z0-9_]*)/g)) {
      const refName = refMatch[1];
      if (
        refName !== name &&
        !["Omit", "Pick", "Partial", "ComponentPropsWithRef", "ComponentProps"].includes(refName)
      ) {
        refs.push(refName);
      }
    }

    let props = [];
    let scanIndex = match.index;
    const nextStmtLimit = source.indexOf("\nexport ", afterDecl);
    const limit = nextStmtLimit === -1 ? source.length : nextStmtLimit;

    while (scanIndex < limit) {
      const braceOpen = source.indexOf("{", scanIndex);
      if (braceOpen === -1 || braceOpen >= limit) break;
      const beforeBrace = source.slice(match.index, braceOpen);
      if (kind === "type" && beforeBrace.includes(";") && !beforeBrace.includes("{")) break;
      const braceClose = findMatchingBrace(source, braceOpen);
      if (braceClose === -1) break;
      props.push(...parsePropertiesBlock(source.slice(braceOpen + 1, braceClose)));
      scanIndex = braceClose + 1;
      const rest = source.slice(scanIndex, limit).trimStart();
      if (!rest.startsWith("&")) break;
    }

    if (props.length > 0 || refs.length > 0) {
      registry.set(name, { refs, props });
    }
  }
  return registry;
}

function resolvePropsForType(typeName, registry, visited = new Set()) {
  if (visited.has(typeName)) return [];
  visited.add(typeName);
  const entry = registry.get(typeName);
  if (!entry) return [];
  const byName = new Map();
  for (const ref of entry.refs) {
    for (const p of resolvePropsForType(ref, registry, visited)) {
      byName.set(p.name, { ...p });
    }
  }
  for (const p of entry.props) {
    byName.set(p.name, { ...p });
  }
  return Array.from(byName.values());
}

export function extractFunctionDefaults(source, componentName) {
  const defaults = new Map();
  const fnRegex = new RegExp(`export\\s+function\\s+${componentName}(?:<[^>]+>)?\\s*\\(`);
  const match = fnRegex.exec(source);
  if (!match) return defaults;
  const openParen = match.index + match[0].length - 1;
  const firstBrace = source.indexOf("{", openParen);
  if (firstBrace === -1 || firstBrace - openParen > 40) return defaults;
  const closeBrace = findMatchingBrace(source, firstBrace);
  if (closeBrace === -1) return defaults;
  const paramBlock = source.slice(firstBrace + 1, closeBrace);

  // Split by top-level commas
  let depth = 0;
  let tokenStart = 0;
  const parts = [];
  for (let i = 0; i <= paramBlock.length; i++) {
    const ch = paramBlock[i];
    if (ch === "{" || ch === "[" || ch === "(") depth++;
    else if (ch === "}" || ch === "]" || ch === ")") depth = Math.max(0, depth - 1);
    else if ((ch === "," || i === paramBlock.length) && depth === 0) {
      parts.push(paramBlock.slice(tokenStart, i).trim());
      tokenStart = i + 1;
    }
  }

  for (const part of parts) {
    if (!part || part.startsWith("...")) continue;
    const eqIndex = part.indexOf("=");
    if (eqIndex === -1) continue;
    const left = part.slice(0, eqIndex).trim();
    const right = part.slice(eqIndex + 1).trim();
    const propName = left.includes(":") ? left.split(":")[0].trim() : left;
    const cleanName = propName.replace(/^["']|["']$/g, "");
    defaults.set(cleanName, right);
  }
  return defaults;
}

function unescapeJsString(raw) {
  return raw.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
}

export function extractStoryDetails(storiesSource, componentName) {
  let category = "Components";
  let purpose = "";
  let example = "";

  if (storiesSource) {
    const titleMatch = storiesSource.match(/title\s*:\s*["']([^"']+)["']/);
    if (titleMatch) {
      const fullTitle = titleMatch[1];
      const lastSlash = fullTitle.lastIndexOf("/");
      if (lastSlash !== -1) {
        category = fullTitle.slice(0, lastSlash);
      }
    }

    const descMatch = storiesSource.match(/component\s*:\s*(?:["']((?:\\.|[^"'\\])*)["']|`([\s\S]*?)`)/);
    if (descMatch) {
      const rawDesc = descMatch[1] !== undefined ? unescapeJsString(descMatch[1]) : descMatch[2];
      const paragraphs = rawDesc.split(/\n\s*\n/);
      purpose = (paragraphs[0] ?? "").replace(/\s+/g, " ").trim();
      const usageMatch = rawDesc.match(/```tsx\n([\s\S]*?)```/);
      if (usageMatch) {
        example = usageMatch[1].trim();
      }
    }
  }

  if (!example) {
    example = `import { ${componentName} } from "@kalaa/react";\n\n<${componentName} />`;
  }

  return { category, purpose, example };
}

function extractLeadingComponentJsDoc(tsxSource, componentName) {
  const fnRegex = new RegExp(`(\\/\\*\\*[\\s\\S]*?\\*\\/)\\s*export\\s+function\\s+${componentName}\\b`);
  const match = fnRegex.exec(tsxSource);
  return match ? cleanJsDoc(match[1]) : "";
}

export function parseComponentSource({
  componentName,
  tsxSource,
  storiesSource = "",
  sharedRegistry = new Map(),
}) {
  const localRegistry = new Map(sharedRegistry);
  extractTypeDefinitions(tsxSource, localRegistry);

  const propsTypeName = `${componentName}Props`;
  const props = resolvePropsForType(propsTypeName, localRegistry);
  const defaults = extractFunctionDefaults(tsxSource, componentName);

  for (const prop of props) {
    if (defaults.has(prop.name)) {
      prop.default = defaults.get(prop.name);
    }
  }

  const storyInfo = extractStoryDetails(storiesSource, componentName);
  const jsDocPurpose = extractLeadingComponentJsDoc(tsxSource, componentName);
  const purpose = storyInfo.purpose || jsDocPurpose || `${componentName} component in @kalaa/react.`;

  return {
    name: componentName,
    category: storyInfo.category,
    purpose,
    props,
    example: storyInfo.example,
  };
}

// Canonical component list for the manifest: all Blocks, Templates, and core Kalaa components.
const CANONICAL_COMPONENT_TARGETS = [
  // Templates
  { name: "ResumePage", dir: "ResumePage" },
  { name: "PortfolioPage", dir: "PortfolioPage" },
  { name: "LandingPage", dir: "LandingPage" },
  // Blocks/Resume
  { name: "ResumeHeader", dir: "ResumeHeader" },
  { name: "Summary", dir: "Summary" },
  { name: "ExperienceList", dir: "ExperienceList" },
  { name: "ExperienceItem", dir: "ExperienceList", categoryOverride: "Blocks/Resume" },
  { name: "EducationList", dir: "EducationList" },
  { name: "SkillGroups", dir: "SkillGroups" },
  { name: "ProjectList", dir: "ProjectList" },
  { name: "ProjectCard", dir: "ProjectList", categoryOverride: "Blocks/Resume" },
  { name: "Certifications", dir: "Certifications" },
  { name: "Languages", dir: "Languages" },
  { name: "Awards", dir: "Awards" },
  { name: "Publications", dir: "Awards", categoryOverride: "Blocks/Resume" },
  // Blocks/Profile & portfolio
  { name: "ProfileCard", dir: "ProfileCard" },
  { name: "CaseStudyCard", dir: "CaseStudyCard" },
  { name: "Timeline", dir: "Timeline" },
  { name: "TestimonialCard", dir: "TestimonialCard" },
  { name: "ContactCard", dir: "ContactCard" },
  { name: "LinkList", dir: "LinkList" },
  // Blocks/Marketing
  { name: "Hero", dir: "Hero" },
  { name: "FeatureGrid", dir: "FeatureGrid" },
  { name: "StatsBand", dir: "StatsBand" },
  { name: "CTA", dir: "CTA" },
  { name: "FAQ", dir: "FAQ" },
  { name: "PageFooter", dir: "PageFooter" },
  { name: "SectionHeader", dir: "SectionHeader" },
  // Core Components
  { name: "AppShell", dir: "AppShell" },
  { name: "PageHeader", dir: "PageHeader" },
  { name: "Card", dir: "Card" },
  { name: "KeyValue", dir: "KeyValue" },
  { name: "ValueComparison", dir: "ValueComparison" },
  { name: "EmptyState", dir: "EmptyState" },
  { name: "Button", dir: "Button" },
  { name: "ButtonLink", dir: "Button", storyDir: "ButtonLink" },
  { name: "Field", dir: "Field" },
  { name: "Input", dir: "Input" },
  { name: "Textarea", dir: "Textarea" },
  { name: "Select", dir: "Select" },
  { name: "Checkbox", dir: "Checkbox" },
  { name: "Switch", dir: "Switch" },
  { name: "Tabs", dir: "Tabs" },
  { name: "Banner", dir: "Banner" },
  { name: "Badge", dir: "Badge" },
  { name: "StatusBadge", dir: "Badge", storyDir: "StatusBadge" },
  { name: "ProgressBar", dir: "ProgressBar" },
  { name: "Dialog", dir: "Dialog" },
  { name: "Table", dir: "Table" },
  { name: "DataTable", dir: "DataTable" },
  { name: "Pagination", dir: "Pagination" },
  { name: "Toolbar", dir: "Toolbar" },
  { name: "Meter", dir: "Meter" },
  { name: "SuggestionReview", dir: "SuggestionReview" },
  { name: "Logo", dir: "Logo" },
  { name: "CodeBlock", dir: "CodeBlock" },
  { name: "Avatar", dir: "Avatar" },
  { name: "Breadcrumbs", dir: "Breadcrumbs" },
  { name: "Combobox", dir: "Combobox" },
  { name: "Divider", dir: "Divider" },
  { name: "DropZone", dir: "DropZone" },
  { name: "Icon", dir: "Icon" },
  { name: "Link", dir: "Link" },
  { name: "Menu", dir: "Menu" },
  { name: "MultiSelect", dir: "MultiSelect" },
  { name: "Popover", dir: "Popover" },
  { name: "RadioGroup", dir: "RadioGroup" },
  { name: "Skeleton", dir: "Skeleton" },
  { name: "Slider", dir: "Slider" },
  { name: "Spinner", dir: "Spinner" },
  { name: "Stat", dir: "Stat" },
  { name: "Toast", dir: "Toast" },
  { name: "Tooltip", dir: "Tooltip" },
];

export function buildManifest() {
  const pkgJson = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));
  const sharedRegistry = new Map();
  const typesPath = join(srcRoot, "schemas", "types.ts");
  if (existsSync(typesPath)) {
    extractTypeDefinitions(readFileSync(typesPath, "utf8"), sharedRegistry);
  }

  const components = [];
  for (const target of CANONICAL_COMPONENT_TARGETS) {
    const tsxPath = join(srcRoot, "components", target.dir, `${target.dir}.tsx`);
    if (!existsSync(tsxPath)) continue;
    const tsxSource = readFileSync(tsxPath, "utf8");
    const storyDir = target.storyDir ?? target.dir;
    const storiesPath = join(srcRoot, "components", storyDir, `${storyDir}.stories.tsx`);
    const storiesSource = existsSync(storiesPath) ? readFileSync(storiesPath, "utf8") : "";

    const parsed = parseComponentSource({
      componentName: target.name,
      tsxSource,
      storiesSource,
      sharedRegistry,
    });
    if (target.categoryOverride) {
      parsed.category = target.categoryOverride;
    }
    components.push(parsed);
  }

  return {
    package: pkgJson.name,
    version: pkgJson.version,
    schemas: {
      ResumeData: "@kalaa/react/resume.schema.json",
      PortfolioData: "@kalaa/react/portfolio.schema.json",
    },
    components,
  };
}

export function formatLlmsTxt(manifest) {
  const lines = [
    `# Kalaa (${manifest.package} v${manifest.version})`,
    "",
    '> Calm, accessible React components, data-driven blocks and full-page templates styled with Kalaa design tokens (`--kalaa-*`). Square by default (`data-shape="soft"` for rounded corners), three Indian-pigment accents (`neel`, `geru`, `mayur`), light and dark themes (`data-theme="light|dark"`), and A4/Letter black-on-white print stylesheets.',
    "",
    "## Data-first AI workflow",
    "",
    "1. Validate or populate a single JSON object conforming to `ResumeData` (`@kalaa/react/resume.schema.json`) or `PortfolioData` (`@kalaa/react/portfolio.schema.json`).",
    '2. Pass the data object to `<ResumePage data={resumeData} layout="single-column" />`, `<PortfolioPage data={portfolioData} />`, or `<LandingPage data={landingPageData} />`.',
    "3. Compose custom views from individual blocks in `Blocks/Resume`, `Blocks/Profile & portfolio`, `Blocks/Marketing`, and primitives in `Components`.",
    "",
    "## Exported JSON Schemas and helpers",
    "",
    "- `ResumeData`, `resumeDataSchema`, `validateResumeData`, `sampleResumeData` (`@kalaa/react/resume.schema.json`)",
    "- `PortfolioData`, `portfolioDataSchema`, `validatePortfolioData`, `samplePortfolioData` (`@kalaa/react/portfolio.schema.json`)",
    "- `LandingPageData`, `sampleLandingPageData`",
    "",
  ];

  const categories = [
    "Templates",
    "Blocks/Resume",
    "Blocks/Profile & portfolio",
    "Blocks/Marketing",
    "Components",
  ];

  for (const category of categories) {
    const group = manifest.components.filter((c) => c.category === category);
    if (group.length === 0) continue;
    lines.push(`## ${category}`, "");
    for (const comp of group) {
      lines.push(`### ${comp.name}`, "");
      lines.push(comp.purpose, "");
      if (comp.props.length > 0) {
        lines.push("Props:");
        for (const prop of comp.props) {
          const reqLabel = prop.required && prop.default === null ? "required" : "optional";
          const defLabel = prop.default !== null ? `, default: ${prop.default}` : "";
          const descLabel = prop.description ? ` — ${prop.description}` : "";
          lines.push(`- \`${prop.name}\` (\`${prop.type}\`, ${reqLabel}${defLabel})${descLabel}`);
        }
        lines.push("");
      }
      lines.push("Example:");
      lines.push("```tsx", comp.example, "```", "");
    }
  }

  return lines.join("\n");
}

export function readCommittedManifest() {
  const jsonPath = join(pkgRoot, "components.json");
  const llmsPath = join(pkgRoot, "llms.txt");
  return {
    json: JSON.parse(readFileSync(jsonPath, "utf8")),
    llmsTxt: readFileSync(llmsPath, "utf8"),
  };
}

const isCli =
  process.argv[1] &&
  fileURLToPath(import.meta.url).endsWith(process.argv[1].replace(/^.*\/packages\/react\//, ""));

if (isCli || process.argv[1]?.endsWith("ai-manifest.mjs")) {
  const manifest = buildManifest();
  const jsonText = JSON.stringify(manifest, null, 2) + "\n";
  const llmsText = formatLlmsTxt(manifest);

  const jsonPath = join(pkgRoot, "components.json");
  const llmsPath = join(pkgRoot, "llms.txt");

  if (process.argv.includes("--check")) {
    const currentJson = existsSync(jsonPath) ? readFileSync(jsonPath, "utf8") : "";
    const currentLlms = existsSync(llmsPath) ? readFileSync(llmsPath, "utf8") : "";
    if (currentJson !== jsonText || currentLlms !== llmsText) {
      console.error(
        "ai-manifest: components.json or llms.txt is stale. Run `node packages/react/scripts/ai-manifest.mjs`.",
      );
      process.exit(1);
    }
    console.log(`ai-manifest: ${manifest.components.length} components verified up to date`);
  } else {
    writeFileSync(jsonPath, jsonText);
    writeFileSync(llmsPath, llmsText);
    const distDir = join(pkgRoot, "dist");
    if (existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
      writeFileSync(join(distDir, "components.json"), jsonText);
      writeFileSync(join(distDir, "llms.txt"), llmsText);
    }
    console.log(
      `ai-manifest: generated components.json and llms.txt for ${manifest.components.length} components`,
    );
  }
}
