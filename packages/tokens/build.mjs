import StyleDictionary from 'style-dictionary';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const read = file => JSON.parse(readFileSync(new URL(file, import.meta.url)));
const palette = read('./src/palette.json').palette, foundation = read('./src/foundation.json'), mappings = read('./src/roles.json');
const accents=['neel','geru','mayur'], modes=['light','dark'], themes={};
for(const accent of accents){themes[accent]={};for(const mode of modes){const roleTokens={};for(const [role,ref] of Object.entries(mappings[mode])){const path=ref.$value.replace('ACCENT',accent).replace('NEUTRAL',`${accent}-neutral`).replace('DANGER',accent==='geru'?'crimson':'red');roleTokens[role]={$type:'color',$value:path};}
// Style Dictionary resolves DTCG aliases for each theme.
const sd=new StyleDictionary({tokens:{palette,role:roleTokens}, platforms:{raw:{transforms:[]}}});const dictionary=await sd.getPlatformTokens("raw");themes[accent][mode]=Object.fromEntries(dictionary.allTokens.filter(t=>t.path[0]==='role').map(t=>[t.path[1],t.$value]));}}
const flat=(obj,prefix=[])=>Object.entries(obj).flatMap(([k,v])=>v.$value!==undefined?[[[...prefix,k].join('-'),v.$value]]:flat(v,[...prefix,k]));
const primitives=flat({palette,...foundation});
const vars=entries=>entries.map(([k,v])=>`  --kalaa-${k}: ${v};`).join('\n');
const roleVars=(a,m)=>vars(Object.entries(themes[a][m]));
let css=`/* Generated from DTCG tokens. */\n:root {\n${vars(primitives)}\n${roleVars('neel','light')}\n  color-scheme: light;\n}\n`;
for(const a of accents.slice(1))css+=`:root[data-accent="${a}"] {\n${roleVars(a,'light')}\n}\n`;
css+='@media (prefers-color-scheme: dark) {\n';for(const a of accents){const selector=a==='neel'?':root:not([data-theme="light"])':`:root[data-accent="${a}"]:not([data-theme="light"])`;css+=`  ${selector} {\n${roleVars(a,'dark')}\n    color-scheme: dark;\n  }\n`;}css+='}\n';
for(const a of accents){const sel=a==='neel'?':root[data-theme="dark"]':`:root[data-accent="${a}"][data-theme="dark"]`;css+=`${sel} {\n${roleVars(a,'dark')}\n  color-scheme: dark;\n}\n`;}
css+='@media (prefers-reduced-motion: reduce) {\n  :root { --kalaa-duration-fast: 0ms; --kalaa-duration-base: 0ms; }\n}\n';
mkdirSync(new URL('./dist',import.meta.url),{recursive:true});const write=(name,s)=>writeFileSync(new URL(`./dist/${name}`,import.meta.url),s);
write('tokens.css',css);write('tokens.json',JSON.stringify(themes,null,2)+'\n');write('fonts.css',`/* Google Fonts for now; self-hosting comes later. */\n@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Devanagari:wght@400;600&family=IBM+Plex+Serif:wght@400;500&display=swap');\n`);
write('index.js',`export const accents = ${JSON.stringify(accents)};\nexport const modes = ${JSON.stringify(modes)};\nexport const tokens = ${JSON.stringify(themes,null,2)};\n`);
write('index.d.ts',`export declare const accents: readonly ["neel", "geru", "mayur"];\nexport declare const modes: readonly ["light", "dark"];\nexport type Accent = typeof accents[number];\nexport type Mode = typeof modes[number];\nexport type Role = ${Object.keys(themes.neel.light).map(x=>JSON.stringify(x)).join(' | ')};\nexport declare const tokens: Record<Accent, Record<Mode, Record<Role, string>>>;\n`);
