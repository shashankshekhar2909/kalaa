export const DEFAULT_GTM_ID = "GTM-N9RD3WLM";

/** Resolves the GTM container ID from config/env. An empty string disables GTM injection. */
export function resolveGtmId(value: string | undefined = DEFAULT_GTM_ID): string {
  const id = (value ?? "").trim();
  if (!id) return "";
  if (!/^GTM-[A-Z0-9]+$/i.test(id)) {
    throw new Error(`Invalid SITE_GTM_ID: ${JSON.stringify(id)}`);
  }
  return id;
}

/** Google Consent Mode v2 defaults + gtag stub + standard Google Tag Manager head loader. */
export function gtmHeadScript(id: string): string {
  return [
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}",
    "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted',wait_for_update:500});",
    "gtag('js',new Date());",
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`,
  ].join("\n");
}

/** Google Tag Manager <noscript> fallback iframe markup placed right after <body>. */
export function gtmNoscriptIframeHtml(id: string): string {
  return `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
}
