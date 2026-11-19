import { useEffect, useId, useState, type ReactNode } from "react";
import { Button, ButtonLink, Logo, Select } from "@kalaa/react";
import { asset, base, facts, page, sb } from "./config";
import { currentPrefs, defaultPrefs, savePref, type PrefKey, type Prefs, PREFS } from "./prefs";

export type PageName = "home" | "getting-started" | "brand" | "not-found";

const labels: Record<PrefKey, Record<string, string>> = {
  accent: { neel: "Neel", geru: "Geru", mayur: "Mayur" },
  theme: { system: "System", light: "Light", dark: "Dark" },
  shape: { square: "Square", soft: "Soft" },
};
const titles: Record<PrefKey, string> = { accent: "Accent", theme: "Theme", shape: "Shape" };

/** The three display switches. Rendered with the default values on the server; the stored values are read after mount. */
function PrefSelects() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  useEffect(() => setPrefs(currentPrefs()), []);
  return (
    <div className="site-prefs" role="group" aria-label="Display settings">
      {(Object.keys(PREFS) as PrefKey[]).map((key) => (
        <Select
          key={key}
          size="sm"
          aria-label={titles[key]}
          value={prefs[key]}
          options={PREFS[key].values.map((value) => ({
            value,
            label: labels[key][value],
          }))}
          onValueChange={(value) => {
            if (!value) return;
            savePref(key, value as Prefs[PrefKey]);
            setPrefs((current) => ({ ...current, [key]: value }));
          }}
        />
      ))}
    </div>
  );
}

function Header({ current }: { current: PageName }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  const links: Array<[string, string, boolean]> = [
    ["Get started", page("getting-started.html"), current === "getting-started"],
    ["Components", sb("docs", "components-button--docs"), false],
    ["Foundations", sb("story", "foundations-colour--roles"), false],
    ["Brand", page("brand.html"), current === "brand"],
  ];
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__logo" href={base} aria-label="Kalaa home">
          <Logo variant="lockup" size={28} />
        </a>
        <Button
          className="site-header__menu"
          size="md"
          aria-expanded={open}
          aria-controls={panel}
          onClick={() => setOpen(!open)}
        >
          Menu
        </Button>
        <div id={panel} className="site-header__panel" data-open={open}>
          <nav aria-label="Main" className="site-nav">
            {links.map(([label, href, active]) => (
              <ButtonLink
                key={label}
                variant="ghost"
                size="sm"
                href={href}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </ButtonLink>
            ))}
          </nav>
          <PrefSelects />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__inner">
        <div className="site-footer__brand">
          <Logo variant="lockup" size={28} />
          <p>
            <span lang="hi">कला</span> (Kalā): art and craft in Hindi, a phase of the moon in Sanskrit.
          </p>
        </div>
        <nav aria-label="Footer" className="site-footer__links">
          <a href={page("getting-started.html")}>Get started</a>
          <a href={sb("docs", "introduction--docs")}>Storybook</a>
          <a href={page("brand.html")}>Brand</a>
          <a href={asset("logo-mark.svg")} download>
            Logo
          </a>
        </nav>
        <p className="site-footer__meta">
          Kalaa v{facts.version} (private preview) · built {facts.built}
        </p>
      </div>
    </footer>
  );
}

export function Layout({ current, children }: { current: PageName; children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header current={current} />
      <main id="main" tabIndex={-1} className="site-main">
        {children}
      </main>
      <Footer />
    </>
  );
}
