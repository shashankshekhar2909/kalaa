import { PREFS } from "./prefs";

// Inline script placed first in <head>: applies stored preferences before paint (no flash) and switches the "no-js"
// class to "js", which reveals the switches and the mobile menu. It must stay dependency-free and swallow every error.
export const headScript = `(function(){var d=document.documentElement;d.classList.remove("no-js");d.classList.add("js");try{var P=${JSON.stringify(
  Object.fromEntries(Object.entries(PREFS).map(([k, v]) => [k, { a: v.attr, f: v.fallback, v: v.values }])),
)};for(var k in P){var s=localStorage.getItem("kalaa-site-"+k);if(s&&s!==P[k].f&&P[k].v.indexOf(s)>-1)d.setAttribute(P[k].a,s)}}catch(e){}})();`;
