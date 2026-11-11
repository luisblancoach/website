"use client";

// Adapted from portal-artifacts/studies/portal-motion/app/page.tsx.
// Mixed-palette filament and spark study; optional destination artwork stays behind the rim.
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './venture/venture.module.css';

type Settings = { mixed: boolean; scale: number; hue: number; saturation: number; lightness: number; energy: number; speed: number; oval: number; paused: boolean; hover: boolean; replay: number; enter: number; reduced: boolean };
type Spark = { tint:number; x:number; y:number; vx:number; vy:number; life:number; age:number; size:number };
const TAU = Math.PI * 2;
const mixColors = [[238,61,121],[215,227,78],[185,224,223],[239,233,215]];
// Interpolate actual palette RGB values, avoiding unrelated rainbow hues.
function mixedColor(angle:number,alpha:number,light:number){
  const position=((angle/TAU%1)+1)%1*mixColors.length;
  const index=Math.floor(position),blend=position-index;
  const a=mixColors[index],b=mixColors[(index+1)%mixColors.length];
  const heat=Math.max(0,Math.min(1,(light-60)/40));
  const rgb=a.map((channel,i)=>{const base=channel+(b[i]-channel)*blend;return Math.round(base+(255-base)*heat);});
  return `rgba(${rgb.join(',')},${Math.max(0,alpha)})`;
}
const wave = (a:number,t:number) => Math.sin(a*7+t*1.7)*.46 + Math.sin(a*13-t*2.1)*.25 + Math.sin(a*29+t*3)*.16 + Math.sin(a*53-t*1.2)*.08;

export default function PortalEnergy({ energized = false, destinationSrc }: { energized?: boolean; destinationSrc?: string }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const settings: Settings = useMemo(() => ({ mixed: true, scale: 1, hue: 339.66, saturation: 83.89, lightness: 58.63, energy: 1.8, speed: 1.15, oval: .55, paused: reduced, hover: energized, replay: 0, enter: 0, reduced }), [energized, reduced]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef(settings);
  const wake = useRef<(() => void) | null>(null);
  useEffect(() => { live.current = settings; wake.current?.(); }, [settings]);
  useEffect(() => {
    const el = canvas.current!;
    const context = el.getContext('2d', { alpha: true });
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;
    let width=0,height=0,frame=0,last=0,time=0,opening=0,hover=0,travel=0,replay=-1,enter=0;
    let sparks:Spark[]=[];
    let previous:Settings | null=null;
    let dirty=true;
    let visible=true;
    const schedule = () => {
      if (!frame && visible && !document.hidden) frame=requestAnimationFrame(draw);
    };
    const invalidate = () => { dirty=true; schedule(); };
    const syncVisibility = () => {
      cancelAnimationFrame(frame); frame=0; last=0;
      schedule();
    };
    wake.current=invalidate;
    let destinationReady=false;
    const destination=new Image();
    // Bake two blur levels once; crossfade them without filtering a full canvas every frame.
    const views=[document.createElement('canvas'),document.createElement('canvas')];
    destination.onload=()=>{
      for(let i=0;i<views.length;i++){
        const view=views[i];view.width=960;view.height=960;
        const v=view.getContext('2d');if(!v)return;
        const cover=Math.max(1008/destination.naturalWidth,1008/destination.naturalHeight);
        const iw=destination.naturalWidth*cover,ih=destination.naturalHeight*cover;
        v.filter=`blur(${i===0?2:0}px)`;
        v.drawImage(destination,(960-iw)/2,(960-ih)/2,iw,ih);
      }
      destinationReady=true;invalidate();
    };
    if (destinationSrc) destination.src=destinationSrc;
    const resize = () => {
      dirty=true;
      width=el.clientWidth; height=el.clientHeight;
      // Three large canvases share the screen; retain crisp edges without
      // allocating four physical pixels per CSS pixel on high-DPI displays.
      const dpr=Math.min(window.devicePixelRatio || 1,1.5);
      el.width=width*dpr; el.height=height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
      schedule();
    };
    const observer=new ResizeObserver(resize); observer.observe(el); resize();
    const visibilityObserver=new IntersectionObserver(([entry])=>{
      visible=entry.isIntersecting; syncVisibility();
    });
    visibilityObserver.observe(el);
    document.addEventListener('visibilitychange',syncVisibility);
    function draw(now:number) {
      frame=0;
      if (!visible || document.hidden) return;
      const s=live.current;
      // A reduced-motion portal paints once, then sleeps until invalidated.
      if (!s.paused) schedule();
      // Idle portals drift at 30fps; the portal being explored stays at 60fps.
      if (!dirty && now-last < (s.hover ? 1000/60 : 1000/30) - 1) return;
      const dt=last ? Math.min((now-last)/1000,.05) : .016; last=now;
      if(s.paused && previous===s && !dirty) return;
      previous=s;dirty=false;
      const step=s.reduced || s.paused ? 0 : dt;
      if(replay!==s.replay){ replay=s.replay; opening=s.reduced?1:0; sparks=[]; travel=0; }
      if(enter!==s.enter){enter=s.enter;travel=.001;}
      if(travel>0){travel+=dt*.55; if(travel>1){travel=0;opening=0;sparks=[];}}
      opening=Math.min(1,opening+dt*.65);
      hover+=(Number(s.hover)-hover)*Math.min(1,dt*4);
      time+=step*s.speed*(1+hover*.5);
      const o=s.reduced?1:1-Math.pow(1-opening,3);
      const zoom=1+Math.pow(travel,3)*9;
      const r=height*.32*s.scale*(.08+.92*o)*zoom;
      const ratio=Math.min(.9,width*.25/Math.max(r,1));
      const cx=width*.5,cy=height*.47;
      const energy=s.energy*(1+hover*.65);
      const color=(alpha:number,light=60,angle=0) => s.mixed ? mixedColor(angle-time*.15,alpha,light) : `hsla(${s.hue},${s.saturation}%,${Math.min(97, s.lightness + (light-60)*(100-s.lightness)/40)}%,${alpha})`;
      ctx.clearRect(0,0,width,height);
      // Light cast below the opening.
      ctx.save(); ctx.translate(cx,cy+r*1.25); ctx.scale(1,.13);
      const floor=ctx.createRadialGradient(0,0,0,0,0,r*1.5);
      floor.addColorStop(0,color(.14*o));floor.addColorStop(1,color(0));ctx.fillStyle=floor;
      ctx.fillRect(-r*1.6,-r*1.6,r*3.2,r*3.2);ctx.restore();
      ctx.save();ctx.translate(cx,cy);ctx.scale(ratio,1);
      const haze=ctx.createRadialGradient(0,0,r*.72,0,0,r*1.5);
      haze.addColorStop(0,color(0));haze.addColorStop(.36,color(.1*energy));haze.addColorStop(1,color(0));
      ctx.fillStyle=haze;ctx.fillRect(-r*1.5,-r*1.5,r*3,r*3);
      // A destination sits behind the rim, softened by the portal membrane.
      ctx.save();ctx.beginPath();ctx.arc(0,0,r*.978,0,TAU);ctx.clip();
      ctx.fillStyle='#080f20';ctx.fillRect(-r,-r,r*2,r*2);
      if(destinationReady){
        ctx.save();
        // Undo the portal's ellipse transform so the landscape keeps natural proportions.
        ctx.scale(1/ratio,1);
        const size=r*2.18*(1+hover*.035+travel*.16);
        const driftX=s.reduced?0:Math.sin(time*.16)*r*.018;
        const driftY=s.reduced?0:Math.cos(time*.12)*r*.012;
        const reveal=s.reduced?0:Math.min(1,hover*.8+travel);
        ctx.globalAlpha=.76+hover*.12;
        ctx.drawImage(views[0],-size/2+driftX,-size/2+driftY,size,size);
        ctx.globalAlpha=reveal*(.76+hover*.12);
        ctx.drawImage(views[1],-size/2+driftX,-size/2+driftY,size,size);
        ctx.restore();
      }
      for(let i=0;i<8;i++){
        const a=i*2.399+time*(.025+i*.003);
        const x=Math.cos(a)*r*.65,y=Math.sin(a*1.2+time*.04)*r*.55;
        const fog=ctx.createRadialGradient(x,y,0,x,y,r*(.55+i*.018));
        fog.addColorStop(0,`hsla(${s.hue+i*5},${s.saturation}%,${18+hover*7}%,.16)`);fog.addColorStop(1,color(0));
        ctx.fillStyle=fog;ctx.fillRect(-r,-r,r*2,r*2);
      }
      const depth=ctx.createRadialGradient(-r*.12,-r*.1,0,0,0,r);
      depth.addColorStop(0,'rgba(8,15,32,.06)');depth.addColorStop(.65,'rgba(8,15,32,.14)');depth.addColorStop(.92,'rgba(8,15,32,.48)');depth.addColorStop(1,color(.3));
      ctx.fillStyle=depth;ctx.fillRect(-r,-r,r*2,r*2);ctx.restore();
      ctx.globalCompositeOperation='lighter';
      // Broken, moving filaments share a noisy edge, rather than separate perfect rings.
      for(let layer=0;layer<36;layer++){
        const a0=layer*2.399+time*(.55+(layer%5)*.12);
        const length=.35+(Math.sin(layer*13.7)*.5+.5)*(s.mixed?.8:2.1);
        ctx.beginPath();
        for(let j=0;j<=64;j++){
          const a=a0+j/64*length;
          const n=wave(a,time+layer*.05);
          const rr=r+(n*5+(layer-18)*.34+Math.sin(a*21-time*5+layer)*1.3)*(r/220);
          const x=Math.cos(a)*rr,y=Math.sin(a)*rr;
          if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.lineWidth=(layer%6===0?2.1:.65)*(r/220);
        ctx.strokeStyle=color((layer%6===0?.22:.42)*Math.min(energy,1.7),layer%5===0?86:59,a0+length/2);
        ctx.shadowColor=color(.8,60,a0+length/2);ctx.shadowBlur=layer%6===0?15:3;ctx.stroke();
      }
      ctx.shadowBlur=0;ctx.restore();
      if(step>0 && opening>.12){
        const count=Math.floor((230+energy*490)*step);
        for(let i=0;i<count && sparks.length<650;i++){
          const a=Math.random()*TAU;
          const rr=r+wave(a,time)*5;
          const velocity=(20+Math.pow(Math.random(),2)*190)*(.7+energy*.4)*(r/220);
          const tangential=velocity*(.65+Math.random()*.6);
          const outward=velocity*(.15+Math.random()*.7);
          sparks.push({tint:a-time*.15,x:cx+Math.cos(a)*rr*ratio,y:cy+Math.sin(a)*rr,
            vx:(-Math.sin(a)*tangential+Math.cos(a)*outward)*ratio,
            vy:Math.cos(a)*tangential+Math.sin(a)*outward,
            life:.25+Math.random()*1.25,age:0,size:.4+Math.random()*1.2});
        }
      }
      ctx.globalCompositeOperation='lighter';
      sparks=sparks.filter(p=>p.age<p.life);
      for(const p of sparks){
        p.age+=step;p.x+=p.vx*step;p.y+=p.vy*step;p.vy+=65*step;p.vx*=Math.exp(-step*.5);
        const fade=Math.pow(Math.max(0,1-p.age/p.life),1.7);
        ctx.strokeStyle=color(fade*.9,p.age<.08?88:62,p.tint+time*.15);ctx.lineWidth=p.size;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.025,p.y-p.vy*.025);ctx.stroke();
      }
      ctx.globalCompositeOperation='source-over';
      if(travel>.7){ctx.fillStyle=`rgba(239,233,215,${Math.sin((travel-.7)/.3*Math.PI)*.2})`;ctx.fillRect(0,0,width,height);}
    }
    schedule();
    return()=>{
      wake.current=null;
      cancelAnimationFrame(frame);
      observer.disconnect();visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange',syncVisibility);
      destination.onload=null;
    };
  },[destinationSrc]);
  return <canvas ref={canvas} className={styles.portalEnergy} aria-hidden="true" />;
}
