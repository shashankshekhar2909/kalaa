import { useRender } from "@base-ui/react/use-render";
import type { ComponentPropsWithRef } from "react";
import { cx } from "../../util";
export type LinkProps = ComponentPropsWithRef<"a"> & {
  /**
   * Replaces the `<a>` element, for client-side routing. Pass your router's link, for example
   * `render={<NextLink href="/products" />}` with `next/link`. Kalaa props and classes are merged onto it.
   */
  render?: useRender.RenderProp;
};
/** Inline text link in the accent colour; underlined so it is not identified by colour alone. */
export function Link({ render, className, ref, ...props }: LinkProps) {
  return useRender({
    defaultTagName: "a",
    render,
    ref,
    props: { ...props, className: cx("kl-link", className) },
  });
}
