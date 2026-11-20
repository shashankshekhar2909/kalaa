import { ValueComparison } from "./ValueComparison";

export default {
  title: "Components/ValueComparison",
  component: ValueComparison,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compare an original value with a proposed value. Panels stack when their container is narrow. Set a contextual accessible name when showing multiple comparisons and use a separate control for accepting a proposal.",
      },
    },
  },
};

export const CatalogQuantity = {
  args: {
    "aria-label": "Package quantity",
    original: "4 × 100 g",
    proposed: "400 g · 4 pack",
  },
};

export const ClaimInNarrowColumn = {
  render: () => (
    <div style={{ inlineSize: "min(100%, 18rem)" }}>
      <ValueComparison
        aria-label="CV claim review"
        originalLabel="Draft claim"
        proposedLabel="Suggested revision"
        original="Led end-to-end delivery of every product integration across the platform."
        proposed="Implemented the catalog integration and documented the handoff for the platform team."
      />
    </div>
  ),
};

export const MissingValue = {
  args: {
    "aria-label": "Stock count",
    original: null,
    proposed: 0,
    emptyLabel: "Missing from source",
  },
};
