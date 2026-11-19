import { writeFileSync } from 'node:fs';
// Anchors are retained verbatim; intermediate colours are interpolated in OKLCH.
const anchors = {
 neel:{50:'#E6E8F5',300:'#B9C1F6',400:'#9EA9F2',700:'#2E3A8C',800:'#232D6E',950:'#1F2546'},
 geru:{50:'#F4E2D9',300:'#F3AE95',400:'#EE9473',700:'#9A3E21',800:'#7D3119',950:'#3A2219'},
 mayur:{50:'#DCEEEE',300:'#86D3D4',400:'#62C3C4',700:'#0E676D',800:'#0A5055',950:'#133437'},
 // Neutral anchors are ordered light -> dark (step number = darkness), so interpolation never doubles back.
 'neel-neutral':{0:'#FFFFFF',50:'#F4F4F0',100:'#E6E7EF',150:'#E1E1DA',400:'#A2A6BC',600:'#5B6075',800:'#2A2E44',900:'#1B1F33',925:'#171A28',950:'#10121C'},
 'geru-neutral':{0:'#FFFDFA',50:'#F6F1EB',100:'#F0E7E1',150:'#E7DDD2',400:'#B6A69C',600:'#6C5D55',800:'#3A2D27',900:'#2A1E19',925:'#1F1815',950:'#16110F'},
 'mayur-neutral':{0:'#FFFFFF',50:'#F1F5F3',100:'#E2EDEC',150:'#DBE4E1',400:'#9DB3B3',550:'#61787C',600:'#536A6E',800:'#24363A',900:'#13262A',925:'#121E21',950:'#0C1517'},
 green:{50:'#E4F3EA',400:'#64C793',700:'#1F7A4D',950:'#14301F'}, amber:{50:'#FBF0DC',400:'#E6B450',700:'#94600A',950:'#33270F'}, red:{50:'#FBE7E4',400:'#F0857B',700:'#B42318',950:'#3A1715'}, crimson:{50:'#F8E1EA',400:'#F27DA6',700:'#A3184A',950:'#3A1424'}
};
const steps=[50,100,200,300,400,500,600,700,800,900,950];
const neutralSteps=[0,50,100,150,200,300,400,500,550,600,700,800,850,900,925,950];
function toLab(hex){let [r,g,b]=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);let l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);let L=.2104542553*l+.793617785*m-.0040720468*s,a=1.9779984951*l-2.428592205*m+.4505937099*s,bb=.0259040371*l+.7827717662*m-.808675766*s;return [L,Math.hypot(a,bb),Math.atan2(bb,a)];}
function toHex([L,C,h]){let a=C*Math.cos(h),b=C*Math.sin(h),l=(L+.3963377774*a+.2158037573*b)**3,m=(L-.1055613458*a-.0638541728*b)**3,s=(L-.0894841775*a-1.291485548*b)**3;return '#'+[4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s].map(x=>Math.round(Math.max(0,Math.min(1,x<=.0031308?12.92*x:1.055*Math.max(0,x)**(1/2.4)-.055))*255).toString(16).padStart(2,'0')).join('').toUpperCase();}
const out={palette:{}};
for(const [name,points] of Object.entries(anchors)){out.palette[name]={};const keys=Object.keys(points).map(Number).sort((a,b)=>a-b);const neutral=name.endsWith('-neutral');for(const step of [...new Set([...(neutral?neutralSteps:steps),...keys])].sort((a,b)=>a-b)){let value=points[step];if(!value){const lo=keys.filter(k=>k<step).at(-1)??keys[0],hi=keys.find(k=>k>step)??keys.at(-1),t=lo===hi?0:(step-lo)/(hi-lo),a=toLab(points[lo]),b=toLab(points[hi]);let dh=b[2]-a[2];if(dh>Math.PI)dh-=2*Math.PI;if(dh< -Math.PI)dh+=2*Math.PI;if(neutral){const ca=[a[1]*Math.cos(a[2]),a[1]*Math.sin(a[2])],cb=[b[1]*Math.cos(b[2]),b[1]*Math.sin(b[2])],x=ca[0]+t*(cb[0]-ca[0]),y=ca[1]+t*(cb[1]-ca[1]);value=toHex([a[0]+t*(b[0]-a[0]),Math.hypot(x,y),Math.atan2(y,x)]);}else value=toHex([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1]),a[2]+t*dh]);}out.palette[name][step]={$type:'color',$value:value};}}
writeFileSync(new URL('../src/palette.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
