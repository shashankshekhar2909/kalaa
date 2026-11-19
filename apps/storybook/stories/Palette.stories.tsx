import type { Meta, StoryObj } from '@storybook/react-vite';
const ramps=['neel','geru','mayur','neel-neutral','geru-neutral','mayur-neutral','green','amber','red','crimson'], steps=[50,100,200,300,400,500,600,700,800,900,950];
function Palette(){return <main className="foundation"><h1>Palette</h1><p>Primitive ramps support the semantic colour roles.</p>{ramps.map(ramp=><section key={ramp}><h2>{ramp}</h2><div className="ramp">{steps.map(step=><div className="ramp-item" key={step}><div className="swatch" style={{background:`var(--kalaa-palette-${ramp}-${step})`}}/><small>{step}</small></div>)}</div></section>)}</main>}
const meta:Meta={title:'Foundations/Palette',component:Palette};export default meta;export const Ramps:StoryObj={};
