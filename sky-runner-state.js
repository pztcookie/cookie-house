export const RUN_DISTANCE=600;
export const LANE_WIDTH=2.4;
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
export function createRun(seed=Date.now()){return {phase:'ready',seed:seed>>>0,lane:1,x:0,jump:0,vy:0,slide:0,distance:0,stars:0,hearts:3,invincible:0,nextRow:32,rows:[],elapsed:0,id:0};}
function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
export function generateRow(s){const index=s.id++,safe=Math.floor(random(s)*3),other=[0,1,2].filter(i=>i!==safe),kinds=['block','hurdle','arch'];
 const obstacles=other.slice(0,index<3?1:2).map((lane,i)=>({lane,kind:index<2?'block':kinds[(index+i)%3],hit:false}));
 const row={id:index,distance:s.nextRow,obstacles,stars:[{lane:safe,taken:false}],safe};s.nextRow+=index<3?22:18;return row;
}
export function runInput(s,action){if(s.phase!=='running')return;if(action==='left')s.lane=clamp(s.lane-1,0,2);if(action==='right')s.lane=clamp(s.lane+1,0,2);if(action==='jump'&&s.jump===0){s.slide=0;s.vy=8.6;}if(action==='slide'&&s.jump===0){s.slide=.95;}}
export function startRun(s){if(s.phase==='ready')s.phase='running';}
export function pauseRun(s){if(s.phase==='running')s.phase='paused';}
export function resumeRun(s){if(s.phase==='paused')s.phase='running';}
export function scoreRun(s){return Math.floor(s.distance)+s.stars*20;}
export function stepRun(s,delta){if(s.phase!=='running')return [];const events=[],dt=clamp(Number.isFinite(delta)?delta:0,0,.05),old=s.distance;
 s.elapsed+=dt;s.distance=Math.min(RUN_DISTANCE,s.distance+dt*(9+Math.min(7,s.distance/65)));s.x+=( (s.lane-1)*LANE_WIDTH-s.x)*Math.min(1,dt*14);
 s.invincible=Math.max(0,s.invincible-dt);s.slide=Math.max(0,s.slide-dt);
 if(s.vy||s.jump){s.vy-=20*dt;s.jump+=s.vy*dt;if(s.jump<=0){s.jump=0;s.vy=0;}}
 while(s.nextRow<s.distance+100&&s.nextRow<RUN_DISTANCE-12)s.rows.push(generateRow(s));
 for(const row of s.rows){const gap=row.distance-s.distance;
  if(gap<1&&row.distance>=old-1){
   for(const star of row.stars)if(!star.taken&&Math.abs(s.x-(star.lane-1)*LANE_WIDTH)<.82){star.taken=true;s.stars++;events.push('star');}
   for(const o of row.obstacles){if(o.hit||Math.abs(s.x-(o.lane-1)*LANE_WIDTH)>.87)continue;const safe=o.kind==='hurdle'?s.jump>.72:o.kind==='arch'?s.slide>.05:false;
    if(!safe&&!s.invincible){o.hit=true;s.hearts--;s.invincible=1.6;events.push('hit');if(!s.hearts){s.phase='over';events.push('over');return events;}}
   }
  }
 }
 s.rows=s.rows.filter(r=>r.distance>s.distance-12);
 if(s.distance>=RUN_DISTANCE){s.phase='complete';events.push('complete');}return events;
}
export function readSkyRecords(raw){try{const a=JSON.parse(raw||'{}'),result={};for(const k of ['witch','angel'])result[k]={best:Number.isFinite(a[k]?.best)?clamp(Math.floor(a[k].best),0,100000):0,runs:Number.isFinite(a[k]?.runs)?clamp(Math.floor(a[k].runs),0,100000):0};return result;}catch{return {witch:{best:0,runs:0},angel:{best:0,runs:0}};}}
export function saveRunRecord(records,kind,s,write){if(!['over','complete'].includes(s.phase)||s.recorded)return {ok:false};const next=JSON.parse(JSON.stringify(records));next[kind].runs++;next[kind].best=Math.max(next[kind].best,scoreRun(s));try{write(JSON.stringify(next));Object.assign(records,next);s.recorded=true;return {ok:true,best:next[kind].best};}catch{return {ok:false};}}
