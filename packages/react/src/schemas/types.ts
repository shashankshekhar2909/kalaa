/** Contact or social link item. */
export interface ResumeContactLink {
  /** Visible link label (for example "GitHub" or "LinkedIn"). */
  label: string;
  /** Target URL or mailto/tel URI. */
  href: string;
}

/** Single role or position in a resume experience section. */
export interface ResumeExperienceItem {
  /** Job title or role name. */
  role: string;
  /** Company or organisation name. */
  org: string;
  /** City, region or remote status. */
  location?: string;
  /** ISO or human-readable start date (rendered inside `<time>`). */
  startDate: string;
  /** ISO or human-readable end date, or "Present" if current. */
  endDate?: string;
  /** Optional one-line role overview. */
  summary?: string;
  /** Impact bullets in sentence case. */
  bullets: string[];
  /** Technology or domain tags shown as badges. */
  tags?: string[];
}

/** Single degree or qualification in a resume education section. */
export interface ResumeEducationItem {
  /** Degree or programme title. */
  degree: string;
  /** University, college or institution name. */
  institution: string;
  /** City or country. */
  location?: string;
  /** Start year or date. */
  startDate?: string;
  /** Graduation year or date. */
  endDate: string;
  /** Thesis, GPA or coursework summary. */
  details?: string;
  /** Honours, distinctions or scholarships. */
  honors?: string[];
}

/** Named group of skills for a resume or portfolio. */
export interface ResumeSkillGroup {
  /** Group heading (for example "Distributed systems" or "Frontend"). */
  category: string;
  /** Individual skill names in this group. */
  skills: string[];
}

/** Measurable impact metric on a project or case study. */
export interface ResumeProjectImpact {
  /** Metric label (for example "Latency p99"). */
  label: string;
  /** Metric value (for example "38 ms (-62%)"). */
  value: string;
}

/** Project entry with measurable outcomes, links and tech tags. */
export interface ResumeProjectItem {
  /** Project name. */
  name: string;
  /** Concise explanation of what was built and why. */
  description: string;
  /** Optional role on the project. */
  role?: string;
  /** Start date or year. */
  startDate?: string;
  /** End date or year. */
  endDate?: string;
  /** Quantified outcomes and impact metrics. */
  impact?: ResumeProjectImpact[];
  /** Technology tags. */
  tags?: string[];
  /** External links (repository, live demo, paper). */
  links?: ResumeContactLink[];
}

/** Professional certification entry. */
export interface ResumeCertificationItem {
  /** Certification title. */
  name: string;
  /** Issuing body. */
  issuer: string;
  /** Issue date or year. */
  date: string;
  /** Optional expiry date or year. */
  expiryDate?: string;
  /** Optional credential identifier. */
  credentialId?: string;
  /** Optional verification link. */
  href?: string;
}

/** Spoken or written language proficiency level. */
export type LanguageProficiencyLevel = "native" | "fluent" | "professional" | "elementary";

/** Language entry for a resume. */
export interface ResumeLanguageItem {
  /** Language name (for example "English", "Hindi", "Marathi"). */
  language: string;
  /** Human-readable proficiency label (for example "Native or bilingual"). */
  proficiency: string;
  /** Normalized proficiency tier for badge styling. */
  level?: LanguageProficiencyLevel;
}

/** Award, honour or publication entry. */
export interface ResumeAwardItem {
  /** Title of the award or publication. */
  title: string;
  /** Conferring organisation, journal or conference. */
  issuer: string;
  /** Date or year received/published. */
  date: string;
  /** Distinguishes awards from publications. */
  kind?: "award" | "publication";
  /** Short description or citation note. */
  summary?: string;
  /** Optional link to the publication or announcement. */
  href?: string;
}

/** Complete JSON-serialisable data model for `ResumePage`. */
export interface ResumeData {
  /** Candidate identity and contact details. */
  basics: {
    name: string;
    title: string;
    location?: string;
    email?: string;
    phone?: string;
    website?: string;
    links?: ResumeContactLink[];
  };
  /** Executive summary block. */
  summary: {
    heading?: string;
    text: string;
    highlights?: string[];
  };
  /** Work history in reverse chronological order. */
  experience: ResumeExperienceItem[];
  /** Academic credentials. */
  education: ResumeEducationItem[];
  /** Grouped technical and domain skills. */
  skills: ResumeSkillGroup[];
  /** Selected projects with impact numbers. */
  projects?: ResumeProjectItem[];
  /** Professional certifications. */
  certifications?: ResumeCertificationItem[];
  /** Language proficiencies. */
  languages?: ResumeLanguageItem[];
  /** Awards and publications. */
  awards?: ResumeAwardItem[];
}

/** Key-value stat item used across portfolio and marketing blocks. */
export interface PortfolioStat {
  /** Short metric label. */
  label: string;
  /** Formatted metric figure. */
  value: string;
  /** Optional context line below the figure. */
  detail?: string;
}

/** Call-to-action link descriptor. */
export interface PortfolioAction {
  /** Button or link label. */
  label: string;
  /** Target URL or anchor. */
  href: string;
}

/** Profile summary for `ProfileCard` and `PortfolioPage`. */
export interface PortfolioProfile {
  /** Person's full name. */
  name: string;
  /** Primary role or headline. */
  role: string;
  /** Location or timezone. */
  location?: string;
  /** Short biography paragraph. */
  bio: string;
  /** Availability status (for example "Available for architecture reviews"). */
  availability?: string;
  /** Avatar monogram initials (for example "AD"). */
  initials?: string;
  /** Top skill tags. */
  skills?: string[];
  /** Career highlight numbers. */
  stats?: PortfolioStat[];
  /** Primary action link. */
  primaryAction?: PortfolioAction;
  /** Secondary action link. */
  secondaryAction?: PortfolioAction;
}

/** Case study item for `CaseStudyCard` and `PortfolioPage`. */
export interface PortfolioCaseStudy {
  /** Case study title. */
  title: string;
  /** Client or organisation name. */
  client?: string;
  /** Year or date completed. */
  year: string;
  /** Overview of the engagement. */
  summary: string;
  /** Key problem addressed. */
  challenge?: string;
  /** Result delivered. */
  outcome?: string;
  /** Quantified impact metrics. */
  metrics?: ResumeProjectImpact[];
  /** Domain or technology tags. */
  tags?: string[];
  /** Link to full write-up. */
  href?: string;
  /** Link button label. */
  ctaLabel?: string;
}

/** Milestone entry for `Timeline`. */
export interface PortfolioTimelineItem {
  /** Optional stable identifier. */
  id?: string;
  /** Start date or year. */
  date: string;
  /** Optional end date. */
  endDate?: string;
  /** Milestone title. */
  title: string;
  /** Organisation or context subtitle. */
  subtitle?: string;
  /** Details about the milestone. */
  description?: string;
  /** Optional status or category badge text. */
  badge?: string;
}

/** Quote entry for `TestimonialCard`. */
export interface PortfolioTestimonial {
  /** Verbatim testimonial text. */
  quote: string;
  /** Full name of the person quoted. */
  author: string;
  /** Author's job title. */
  role: string;
  /** Author's company or organisation. */
  org?: string;
  /** Date or year of the endorsement. */
  date?: string;
  /** Relationship or project context. */
  context?: string;
}

/** Contact block data for `ContactCard`. */
export interface PortfolioContact {
  /** Heading for the contact card. */
  title?: string;
  /** Invitation copy below the heading. */
  description?: string;
  /** Contact email address. */
  email: string;
  /** Optional phone number. */
  phone?: string;
  /** City, country or timezone. */
  location?: string;
  /** Current availability window. */
  availability?: string;
  /** Typical response time. */
  responseTime?: string;
  /** Primary email button label. */
  ctaLabel?: string;
  /** Additional profile links. */
  links?: ResumeContactLink[];
}

/** Annotated link item for `LinkList`. */
export interface PortfolioLinkItem {
  /** Link title. */
  label: string;
  /** Destination URL. */
  href: string;
  /** Optional description below the link. */
  description?: string;
  /** Optional badge or metadata tag (for example "PDF" or "GitHub"). */
  meta?: string;
}

/** Column of navigation links in `PageFooter`. */
export interface PortfolioFooterColumn {
  /** Column heading. */
  heading: string;
  /** Links under this column. */
  links: ResumeContactLink[];
}

/** Footer data for `PageFooter`, `PortfolioPage` and `LandingPage`. */
export interface PortfolioFooter {
  /** Brand or owner name. */
  brandName: string;
  /** Short tagline below the brand. */
  tagline?: string;
  /** Structured link columns. */
  columns?: PortfolioFooterColumn[];
  /** Flat utility links. */
  links?: ResumeContactLink[];
  /** Copyright or licence line. */
  copyright?: string;
  /** Whether to render the Kalaa mark next to the brand name. */
  showLogo?: boolean;
}

/** Complete JSON-serialisable data model for `PortfolioPage`. */
export interface PortfolioData {
  /** Top navigation links. */
  navigation?: ResumeContactLink[];
  /** Profile hero and summary data. */
  profile: PortfolioProfile;
  /** Deep-dive case studies. */
  caseStudies: PortfolioCaseStudy[];
  /** Open-source or product projects. */
  projects?: ResumeProjectItem[];
  /** Career or delivery timeline. */
  timeline?: PortfolioTimelineItem[];
  /** Grouped skills. */
  skills?: ResumeSkillGroup[];
  /** Colleague or client testimonials. */
  testimonials?: PortfolioTestimonial[];
  /** Writing, talks or social links. */
  links?: PortfolioLinkItem[];
  /** Direct contact details. */
  contact: PortfolioContact;
  /** Page footer configuration. */
  footer: PortfolioFooter;
}

/** Feature item for `FeatureGrid`. */
export interface LandingFeatureItem {
  /** Feature title. */
  title: string;
  /** Explanation of the feature. */
  description: string;
  /** Optional category or status badge. */
  badge?: string;
  /** Optional documentation link. */
  href?: string;
  /** Link label when `href` is set. */
  linkLabel?: string;
}

/** Question and answer pair for `FAQ`. */
export interface LandingFaqItem {
  /** Question text shown in the `<summary>`. */
  question: string;
  /** Answer text shown inside `<details>`. */
  answer: string;
}

/** Hero block configuration for `Hero` and `LandingPage`. */
export interface LandingHeroData {
  /** Optional badge label above the title. */
  eyebrow?: string;
  /** Primary headline. */
  title: string;
  /** Supporting value proposition paragraph. */
  description: string;
  /** Main call-to-action button. */
  primaryAction?: PortfolioAction;
  /** Secondary link button. */
  secondaryAction?: PortfolioAction;
  /** Short factual highlights below the actions. */
  highlights?: string[];
}

/** Call-to-action banner configuration for `CTA` and `LandingPage`. */
export interface LandingCtaData {
  /** Action heading. */
  title: string;
  /** Supporting explanation. */
  description?: string;
  /** Primary action link. */
  primaryAction: PortfolioAction;
  /** Optional secondary action link. */
  secondaryAction?: PortfolioAction;
  /** Optional note below the buttons. */
  note?: string;
}

/** Complete JSON-serialisable data model for `LandingPage`. */
export interface LandingPageData {
  /** Brand name in the top bar. */
  brandName: string;
  /** Navigation links in the top bar. */
  navigation?: ResumeContactLink[];
  /** Top bar action button. */
  headerAction?: PortfolioAction;
  /** Hero section data. */
  hero: LandingHeroData;
  /** Key metrics band. */
  stats?: {
    heading?: string;
    description?: string;
    items: PortfolioStat[];
  };
  /** Feature grid section. */
  features: {
    heading: string;
    description?: string;
    items: LandingFeatureItem[];
  };
  /** Customer testimonials section. */
  testimonials?: {
    heading: string;
    description?: string;
    items: PortfolioTestimonial[];
  };
  /** Frequently asked questions section. */
  faq?: {
    heading?: string;
    description?: string;
    items: LandingFaqItem[];
  };
  /** Closing call-to-action section. */
  cta: LandingCtaData;
  /** Page footer configuration. */
  footer: PortfolioFooter;
}

/** JSON Schema node subset used by Kalaa's built-in schema validator. */
export interface JsonSchemaNode {
  $schema?: string;
  $id?: string;
  title?: string;
  description?: string;
  type?: "object" | "array" | "string" | "number" | "boolean";
  required?: readonly string[];
  properties?: Record<string, JsonSchemaNode>;
  additionalProperties?: boolean;
  items?: JsonSchemaNode;
  minItems?: number;
  minLength?: number;
  enum?: readonly string[];
  $defs?: Record<string, JsonSchemaNode>;
  $ref?: string;
}

const linkSchema: JsonSchemaNode = {
  type: "object",
  required: ["label", "href"],
  additionalProperties: false,
  properties: {
    label: { type: "string", minLength: 1 },
    href: { type: "string", minLength: 1 },
  },
};

const impactSchema: JsonSchemaNode = {
  type: "object",
  required: ["label", "value"],
  additionalProperties: false,
  properties: {
    label: { type: "string", minLength: 1 },
    value: { type: "string", minLength: 1 },
  },
};

const projectSchema: JsonSchemaNode = {
  type: "object",
  required: ["name", "description"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1 },
    description: { type: "string", minLength: 1 },
    role: { type: "string" },
    startDate: { type: "string" },
    endDate: { type: "string" },
    impact: { type: "array", items: impactSchema },
    tags: { type: "array", items: { type: "string", minLength: 1 } },
    links: { type: "array", items: linkSchema },
  },
};

const skillGroupSchema: JsonSchemaNode = {
  type: "object",
  required: ["category", "skills"],
  additionalProperties: false,
  properties: {
    category: { type: "string", minLength: 1 },
    skills: { type: "array", minItems: 1, items: { type: "string", minLength: 1 } },
  },
};

/** JSON Schema (Draft 2020-12) for `ResumeData`. Matches `packages/react/schemas/resume.schema.json`. */
export const resumeDataSchema: JsonSchemaNode = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://kalaa.buildwithshashank.com/schemas/resume.schema.json",
  title: "ResumeData",
  description: "Data-first resume schema for @kalaa/react ResumePage and resume blocks.",
  type: "object",
  required: ["basics", "summary", "experience", "education", "skills"],
  additionalProperties: false,
  properties: {
    basics: {
      type: "object",
      required: ["name", "title"],
      additionalProperties: false,
      properties: {
        name: { type: "string", minLength: 1 },
        title: { type: "string", minLength: 1 },
        location: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        website: { type: "string" },
        links: { type: "array", items: linkSchema },
      },
    },
    summary: {
      type: "object",
      required: ["text"],
      additionalProperties: false,
      properties: {
        heading: { type: "string" },
        text: { type: "string", minLength: 1 },
        highlights: { type: "array", items: { type: "string", minLength: 1 } },
      },
    },
    experience: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["role", "org", "startDate", "bullets"],
        additionalProperties: false,
        properties: {
          role: { type: "string", minLength: 1 },
          org: { type: "string", minLength: 1 },
          location: { type: "string" },
          startDate: { type: "string", minLength: 1 },
          endDate: { type: "string" },
          summary: { type: "string" },
          bullets: { type: "array", minItems: 1, items: { type: "string", minLength: 1 } },
          tags: { type: "array", items: { type: "string", minLength: 1 } },
        },
      },
    },
    education: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["degree", "institution", "endDate"],
        additionalProperties: false,
        properties: {
          degree: { type: "string", minLength: 1 },
          institution: { type: "string", minLength: 1 },
          location: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string", minLength: 1 },
          details: { type: "string" },
          honors: { type: "array", items: { type: "string", minLength: 1 } },
        },
      },
    },
    skills: {
      type: "array",
      minItems: 1,
      items: skillGroupSchema,
    },
    projects: {
      type: "array",
      items: projectSchema,
    },
    certifications: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "issuer", "date"],
        additionalProperties: false,
        properties: {
          name: { type: "string", minLength: 1 },
          issuer: { type: "string", minLength: 1 },
          date: { type: "string", minLength: 1 },
          expiryDate: { type: "string" },
          credentialId: { type: "string" },
          href: { type: "string" },
        },
      },
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        required: ["language", "proficiency"],
        additionalProperties: false,
        properties: {
          language: { type: "string", minLength: 1 },
          proficiency: { type: "string", minLength: 1 },
          level: {
            type: "string",
            enum: ["native", "fluent", "professional", "elementary"],
          },
        },
      },
    },
    awards: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "issuer", "date"],
        additionalProperties: false,
        properties: {
          title: { type: "string", minLength: 1 },
          issuer: { type: "string", minLength: 1 },
          date: { type: "string", minLength: 1 },
          kind: { type: "string", enum: ["award", "publication"] },
          summary: { type: "string" },
          href: { type: "string" },
        },
      },
    },
  },
};

/** JSON Schema (Draft 2020-12) for `PortfolioData`. Matches `packages/react/schemas/portfolio.schema.json`. */
export const portfolioDataSchema: JsonSchemaNode = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://kalaa.buildwithshashank.com/schemas/portfolio.schema.json",
  title: "PortfolioData",
  description: "Data-first portfolio schema for @kalaa/react PortfolioPage and profile blocks.",
  type: "object",
  required: ["profile", "caseStudies", "contact", "footer"],
  additionalProperties: false,
  properties: {
    navigation: {
      type: "array",
      items: linkSchema,
    },
    profile: {
      type: "object",
      required: ["name", "role", "bio"],
      additionalProperties: false,
      properties: {
        name: { type: "string", minLength: 1 },
        role: { type: "string", minLength: 1 },
        location: { type: "string" },
        bio: { type: "string", minLength: 1 },
        availability: { type: "string" },
        initials: { type: "string" },
        skills: { type: "array", items: { type: "string", minLength: 1 } },
        stats: {
          type: "array",
          items: {
            type: "object",
            required: ["label", "value"],
            additionalProperties: false,
            properties: {
              label: { type: "string", minLength: 1 },
              value: { type: "string", minLength: 1 },
              detail: { type: "string" },
            },
          },
        },
        primaryAction: linkSchema,
        secondaryAction: linkSchema,
      },
    },
    caseStudies: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["title", "year", "summary"],
        additionalProperties: false,
        properties: {
          title: { type: "string", minLength: 1 },
          client: { type: "string" },
          year: { type: "string", minLength: 1 },
          summary: { type: "string", minLength: 1 },
          challenge: { type: "string" },
          outcome: { type: "string" },
          metrics: { type: "array", items: impactSchema },
          tags: { type: "array", items: { type: "string", minLength: 1 } },
          href: { type: "string" },
          ctaLabel: { type: "string" },
        },
      },
    },
    projects: {
      type: "array",
      items: projectSchema,
    },
    timeline: {
      type: "array",
      items: {
        type: "object",
        required: ["date", "title"],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          date: { type: "string", minLength: 1 },
          endDate: { type: "string" },
          title: { type: "string", minLength: 1 },
          subtitle: { type: "string" },
          description: { type: "string" },
          badge: { type: "string" },
        },
      },
    },
    skills: {
      type: "array",
      items: skillGroupSchema,
    },
    testimonials: {
      type: "array",
      items: {
        type: "object",
        required: ["quote", "author", "role"],
        additionalProperties: false,
        properties: {
          quote: { type: "string", minLength: 1 },
          author: { type: "string", minLength: 1 },
          role: { type: "string", minLength: 1 },
          org: { type: "string" },
          date: { type: "string" },
          context: { type: "string" },
        },
      },
    },
    links: {
      type: "array",
      items: {
        type: "object",
        required: ["label", "href"],
        additionalProperties: false,
        properties: {
          label: { type: "string", minLength: 1 },
          href: { type: "string", minLength: 1 },
          description: { type: "string" },
          meta: { type: "string" },
        },
      },
    },
    contact: {
      type: "object",
      required: ["email"],
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        email: { type: "string", minLength: 1 },
        phone: { type: "string" },
        location: { type: "string" },
        availability: { type: "string" },
        responseTime: { type: "string" },
        ctaLabel: { type: "string" },
        links: { type: "array", items: linkSchema },
      },
    },
    footer: {
      type: "object",
      required: ["brandName"],
      additionalProperties: false,
      properties: {
        brandName: { type: "string", minLength: 1 },
        tagline: { type: "string" },
        columns: {
          type: "array",
          items: {
            type: "object",
            required: ["heading", "links"],
            additionalProperties: false,
            properties: {
              heading: { type: "string", minLength: 1 },
              links: { type: "array", items: linkSchema },
            },
          },
        },
        links: { type: "array", items: linkSchema },
        copyright: { type: "string" },
        showLogo: { type: "boolean" },
      },
    },
  },
};

/** Validation result returned by `validateJsonSchema`, `validateResumeData` and `validatePortfolioData`. */
export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
}

/** Validates a plain JSON value against a `JsonSchemaNode` definition. */
export function validateJsonSchema(
  value: unknown,
  schema: JsonSchemaNode,
  path = "$",
): SchemaValidationResult {
  const errors: string[] = [];

  function check(node: unknown, rule: JsonSchemaNode, currentPath: string) {
    if (rule.type === "object") {
      if (typeof node !== "object" || node === null || Array.isArray(node)) {
        errors.push(`${currentPath}: expected object`);
        return;
      }
      const record = node as Record<string, unknown>;
      for (const req of rule.required ?? []) {
        if (!(req in record) || record[req] === undefined) {
          errors.push(`${currentPath}.${req}: required property is missing`);
        }
      }
      if (rule.additionalProperties === false && rule.properties) {
        for (const key of Object.keys(record)) {
          if (!(key in rule.properties)) {
            errors.push(`${currentPath}.${key}: unexpected additional property`);
          }
        }
      }
      if (rule.properties) {
        for (const [key, propSchema] of Object.entries(rule.properties)) {
          if (key in record && record[key] !== undefined) {
            check(record[key], propSchema, `${currentPath}.${key}`);
          }
        }
      }
      return;
    }

    if (rule.type === "array") {
      if (!Array.isArray(node)) {
        errors.push(`${currentPath}: expected array`);
        return;
      }
      if (typeof rule.minItems === "number" && node.length < rule.minItems) {
        errors.push(`${currentPath}: expected at least ${rule.minItems} item(s)`);
      }
      if (rule.items) {
        const itemSchema = rule.items;
        node.forEach((item, index) => check(item, itemSchema, `${currentPath}[${index}]`));
      }
      return;
    }

    if (rule.type === "string") {
      if (typeof node !== "string") {
        errors.push(`${currentPath}: expected string`);
        return;
      }
      if (typeof rule.minLength === "number" && node.trim().length < rule.minLength) {
        errors.push(`${currentPath}: expected non-empty string (minLength ${rule.minLength})`);
      }
      if (rule.enum && !rule.enum.includes(node)) {
        errors.push(`${currentPath}: value "${node}" is not in [${rule.enum.join(", ")}]`);
      }
      return;
    }

    if (rule.type === "number") {
      if (typeof node !== "number" || Number.isNaN(node)) {
        errors.push(`${currentPath}: expected number`);
      }
      return;
    }

    if (rule.type === "boolean") {
      if (typeof node !== "boolean") {
        errors.push(`${currentPath}: expected boolean`);
      }
    }
  }

  check(value, schema, path);
  return { valid: errors.length === 0, errors };
}

/** Validates an unknown JSON payload against `resumeDataSchema`. */
export function validateResumeData(
  data: unknown,
  schema: JsonSchemaNode = resumeDataSchema,
): SchemaValidationResult {
  return validateJsonSchema(data, schema);
}

/** Validates an unknown JSON payload against `portfolioDataSchema`. */
export function validatePortfolioData(
  data: unknown,
  schema: JsonSchemaNode = portfolioDataSchema,
): SchemaValidationResult {
  return validateJsonSchema(data, schema);
}
