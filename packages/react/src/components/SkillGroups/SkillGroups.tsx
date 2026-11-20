import type { ComponentPropsWithRef } from "react";
import type { ResumeSkillGroup } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { cx } from "../../util";

export type SkillGroupsProps = ComponentPropsWithRef<"section"> & {
  /** Section heading (default "Skills"). */
  heading?: string;
  /** Categorised skill groups. */
  groups: ResumeSkillGroup[];
  /** Visual arrangement: "grid" (default) or "stacked" for narrow sidebars. */
  layout?: "grid" | "stacked";
  /** Section heading level (default 2). */
  headingLevel?: 2 | 3;
};

/** Grouped technical and domain skills rendered as a definition list with Kalaa `Badge` items. */
export function SkillGroups({
  heading = "Skills",
  groups,
  layout = "grid",
  headingLevel = 2,
  className,
  ...props
}: SkillGroupsProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <section {...props} className={cx("kl-skill-groups", `kl-skill-groups--${layout}`, className)}>
      <Heading className="kl-skill-groups__heading">{heading}</Heading>
      <dl className="kl-skill-groups__list">
        {groups.map((group) => (
          <div key={group.category} className="kl-skill-groups__group">
            <dt className="kl-skill-groups__category">{group.category}</dt>
            <dd className="kl-skill-groups__skills">
              {group.skills.map((skill) => (
                <Badge key={skill} tone="neutral">
                  {skill}
                </Badge>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
