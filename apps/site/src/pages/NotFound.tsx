import { ButtonLink, EmptyState } from "@kalaa/react";
import { Layout } from "../Layout";
import { base, page } from "../config";

/** The four moon phases as squares: frame, L, half, full. The 404 motif. */
function Phases() {
  const cell = "M0 0H6V6H0Z";
  return (
    <svg
      className="site-phases"
      viewBox="0 0 30 6"
      width="150"
      height="30"
      aria-hidden="true"
      focusable="false"
    >
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${i * 8} 0)`}>
          <path fill="var(--kalaa-text)" fillRule="evenodd" d={`${cell} M1 1V5H5V1Z`} />
          {i === 1 && <path fill="var(--kalaa-accent)" d="M1 1H3V3H5V5H1Z" />}
          {i === 2 && <path fill="var(--kalaa-accent)" d="M1 1H3V5H1Z" />}
          {i === 3 && <path fill="var(--kalaa-accent)" d="M1 1H5V5H1Z" />}
        </g>
      ))}
    </svg>
  );
}
export function NotFound() {
  return (
    <Layout current="not-found">
      <div className="site-container site-notfound">
        <Phases />
        <EmptyState
          title="Page not found"
          description="This page does not exist or has moved. Start from the home page or the guide."
          action={
            <div className="site-row site-row--center">
              <ButtonLink variant="primary" href={base}>
                Go to home
              </ButtonLink>
              <ButtonLink href={page("getting-started.html")}>Get started</ButtonLink>
            </div>
          }
        />
      </div>
    </Layout>
  );
}
