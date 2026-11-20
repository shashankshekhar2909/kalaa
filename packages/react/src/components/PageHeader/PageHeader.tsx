import { useRender } from "@base-ui/react/use-render";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type PageHeaderProps = Omit<ComponentPropsWithRef<"header">, "title"> & {
  /** The page `h1`. */
  title: ReactNode;
  /** Muted line under the title. */
  description?: ReactNode;
  /** Link above the title to the parent page. */
  back?: {
    href: string;
    label: string;
    /** Replaces the `<a>`, for client-side routing: `render: <NextLink href="/products" />` with `next/link`. */
    render?: useRender.RenderProp;
  };
  /** Buttons on the right of the title row; at most one primary. */
  actions?: ReactNode;
  /** "brand" sets the title in serif for marketing pages. */
  variant?: "default" | "brand";
};
function BackLink({ back }: { back: NonNullable<PageHeaderProps["back"]> }) {
  return useRender({
    defaultTagName: "a",
    render: back.render,
    props: { className: "kl-page-header__back", href: back.href, children: back.label },
  });
}
export function PageHeader({
  title,
  description,
  back,
  actions,
  variant = "default",
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header {...props} className={cx("kl-page-header", className)}>
      {back && <BackLink back={back} />}
      <div className="kl-page-header__row">
        <div>
          <h1 className={cx("kl-page-header__title", variant === "brand" && "kl-page-header__title--brand")}>
            {title}
          </h1>
          {description && <p className="kl-page-header__description">{description}</p>}
        </div>
        {actions && <div className="kl-page-header__actions">{actions}</div>}
      </div>
    </header>
  );
}
