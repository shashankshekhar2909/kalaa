import { describe, expect, it } from "vitest";
import portfolioSchemaFile from "../../schemas/portfolio.schema.json";
import resumeSchemaFile from "../../schemas/resume.schema.json";
import sampleResumeFile from "../../schemas/sample-resume.json";
import { samplePortfolioData, sampleResumeData } from "./sampleData";
import {
  portfolioDataSchema,
  resumeDataSchema,
  validatePortfolioData,
  validateResumeData,
  type JsonSchemaNode,
} from "./types";

describe("AI schemas and sample data", () => {
  it("keeps exported TypeScript schema objects in sync with JSON Schema files", () => {
    expect(resumeDataSchema).toEqual(resumeSchemaFile);
    expect(portfolioDataSchema).toEqual(portfolioSchemaFile);
  });

  it("validates sample-resume.json against resume.schema.json", () => {
    const result = validateResumeData(sampleResumeFile, resumeSchemaFile as JsonSchemaNode);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(sampleResumeData).toEqual(sampleResumeFile);
  });

  it("uses fictional sample data with no real personal domains or phone numbers", () => {
    expect(sampleResumeData.basics.name).toBe("Aarav Deshmukh");
    expect(sampleResumeData.basics.email).toContain("@example.invalid");
    expect(sampleResumeData.basics.website).toContain(".example.invalid");
    for (const link of sampleResumeData.basics.links ?? []) {
      expect(link.href).toContain(".example.invalid");
    }
  });

  it("rejects invalid resume payloads with descriptive error paths", () => {
    const invalid = {
      basics: { name: "", title: "Architect", unexpectedField: true },
      summary: { text: "Short bio" },
      experience: [],
      education: [],
      skills: [],
    };
    const result = validateResumeData(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("$.basics.name: expected non-empty string (minLength 1)");
    expect(result.errors).toContain("$.basics.unexpectedField: unexpected additional property");
    expect(result.errors).toContain("$.experience: expected at least 1 item(s)");
  });

  it("validates samplePortfolioData against portfolio.schema.json", () => {
    const result = validatePortfolioData(samplePortfolioData, portfolioSchemaFile as JsonSchemaNode);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });
});
