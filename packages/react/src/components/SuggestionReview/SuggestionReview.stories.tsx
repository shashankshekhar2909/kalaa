import { Button } from "../Button/Button";
import { SuggestionReview } from "./SuggestionReview";

export default {
  title: "Components/SuggestionReview",
  component: SuggestionReview,
  tags: ["autodocs"],
};

export const CategoryReview = {
  render: () => (
    <div style={{ maxInlineSize: "22rem" }}>
      <SuggestionReview
        proposal="Suggested category: Oat cereals"
        source="Source: Product title and ingredient list"
        score={{ label: "Category match score", value: 82 }}
        alternatives={[
          { id: "granola", label: "Granola" },
          { id: "muesli", label: "Muesli" },
        ]}
        actions={<Button>Accept suggestion</Button>}
      />
    </div>
  ),
};
