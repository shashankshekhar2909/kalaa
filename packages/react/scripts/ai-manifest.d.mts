export interface ComponentPropManifest {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string;
}

export interface ComponentEntryManifest {
  name: string;
  category: string;
  purpose: string;
  props: ComponentPropManifest[];
  example: string;
}

export interface ComponentManifest {
  package: string;
  version: string;
  schemas: Record<string, string>;
  components: ComponentEntryManifest[];
}

export function buildManifest(): ComponentManifest;
export function formatLlmsTxt(manifest: ComponentManifest): string;
export function readCommittedManifest(): {
  json: ComponentManifest;
  llmsTxt: string;
};
export function parseComponentSource(input: {
  componentName: string;
  tsxSource: string;
  storiesSource?: string;
  sharedRegistry?: Map<string, unknown>;
}): ComponentEntryManifest;
