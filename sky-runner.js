import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {createBrain} from './brain-models.js?v=20261007-brains3d2';
import {createRun,startRun,pauseRun,resumeRun,runInput,stepRun,scoreRun,readSkyRecords,saveRunRecord,RUN_DISTANCE,LANE_WIDTH} from './sky-runner-state.js?v=20261007-brains3d2';
const COPY={
 zh:{title:'脑洞云端跑酷',intro:'沿云朵跑道收集星星。避开大云团，跳过矮栏，滑过星星拱门。',help:'← → 换道 · ↑ / 空格跳跃 · ↓ 滑行，也可以滑动屏幕',start:'出发！',again:'再跑一次',exit:'回到小世界',pause:'暂停',resume:'继续跑',paused:'在云上休息一下',over:'这次的云端旅程',complete:'抵达彩虹终点！',best:'最高分',score:'得分',stars:'星星',distance:'米',saved:'成绩已保存在这个浏览器',saveError:'浏览器未能保存这次成绩',jump:'跳跃',slide:'滑行',left:'向左',right:'向右',ready:'免费游玩 · 三颗爱心 · 600 米'},
 en:{title:'Brain Cloud Run',intro:'Collect stars on the cloud lanes. Dodge big clouds, jump low rails, and slide under star arches.',help:'← → lanes · ↑ / Space jump · ↓ slide · or swipe',start:'Let’s go!',again:'Run again',exit:'Back to the world',pause:'Pause',resume:'Keep running',paused:'A little cloud break',over:'Your cloud adventure',complete:'Rainbow finish!',best:'Best',score:'Score',stars:'Stars',distance:'m',saved:'Record saved in this browser',saveError:'This browser could not save this record.',jump:'Jump',slide:'Slide',left:'Left',right:'Right',ready:'Free play · 3 hearts · 600 m'},
 ja:{title:'ブレインの雲ラン',intro:'雲のレーンで星を集めよう。大きな雲をよけ、低い柵をジャンプ、星のアーチはくぐろう。',help:'← → 移動 · ↑ / Space ジャンプ · ↓ くぐる · スワイプもOK',start:'出発！',again:'もう一度',exit:'世界に戻る',pause:'休憩',resume:'続ける',paused:'雲の上でひと休み',over:'今回の空の旅',complete:'虹のゴール！',best:'ベスト',score:'スコア',stars:'星',distance:'m',saved:'このブラウザーに保存したよ',saveError:'この記録を保存できませんでした。',jump:'ジャンプ',slide:'くぐる',left:'左',right:'右',ready:'無料 · ハート3つ · 600 m'}
};
export function createSkyRunner(H){
 const {THREE,V}=H,geometries=new Set(),materials=new Set(),materialCache=new Map();
 const material=color=>{if(typeof color!=='string'){materials.add(color);return color;}if(!materialCache.has(color))materialCache.set(color,new THREE.MeshStandardMaterial({color,roughness:.8}));const m=materialCache.get(color);materials.add(m);return m;};
 const mesh=(geo,color,parent,x=0,y=0,z=0)=>{geometries.add(geo);const m=new THREE.Mesh(geo,material(color));m.position.set(x,y,z);parent.add(m);return m;};
 let sphereGeo=null;
 const sph=(par,r,c,x=0,y=0,z=0,sx=1,sy=1,sz=1)=>{sphereGeo||=new THREE.SphereGeometry(1,24,16);const m=mesh(sphereGeo,c,par,x,y,z);m.scale.set(r*sx,r*sy,r*sz);return m;};
 const B=(par,w,h,d,c,x=0,y=0,z=0,r=.04)=>mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/2,h/2,d/2)),c,par,x,y+h/2,z);
 const stick=(par,a,b,r,c,seg=10)=>{const v=b.clone().sub(a),m=mesh(new THREE.CylinderGeometry(r,r,v.length(),seg),c,par);m.position.copy(a).addScaledVector(v,.5);m.quaternion.setFromUnitVectors(V(0,1,0),v.normalize());return m;};
 const modelH={THREE,V,mesh,sph,stick,B};
 const ui=document.createElement('section');ui.id='runnerUI';ui.hidden=true;ui.setAttribute('aria-label','Cloud runner');document.body.append(ui);
 ui.innerHTML='<div class="run-hud"><div class="run-score" id="runScore"></div><button data-run="pause"></button><button data-run="exit"></button></div><div class="run-center" role="dialog" aria-modal="true" id="runCenter"></div><div class="run-help" id="runHelp"></div><div class="run-controls"></div>';
 const score=ui.querySelector('#runScore'),center=ui.querySelector('#runCenter'),pause=ui.querySelector('[data-run="pause"]'),help=ui.querySelector('#runHelp');
 let active=false,s=null,kind='witch',world=null,camera=null,avatar=null,rowViews=new Map(),clouds=[],time=0,lastPhase='',lastScore='',records;
 try{records=readSkyRecords(localStorage.getItem('cookieHouse.skyRuns.v1'));}catch{records=readSkyRecords(null);}
 const tr=k=>(COPY[H.lang()]||COPY.zh)[k];
 function star(parent,x,y,z,r=.26){const shape=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,rr=i%2?r*.46:r;i?shape.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):shape.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}shape.closePath();return mesh(new THREE.ExtrudeGeometry(shape,{depth:.10,bevelEnabled:true,bevelSize:.035,bevelThickness:.03,bevelSegments:2}),new THREE.MeshStandardMaterial({color:'#ffe07d',emissive:'#b68022',emissiveIntensity:.22,roughness:.5}),parent,x,y,z);}
 function group(parent,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
 function makeWorld(){world=new THREE.Scene();world.background=new THREE.Color('#c7dff2');world.fog=new THREE.Fog('#c7dff2',35,110);world.add(new THREE.HemisphereLight('#fff9ed','#c2b5dc',2.5));const sun=new THREE.DirectionalLight('#fff6e8',2.7);sun.position.set(-6,15,8);world.add(sun);
 camera=new THREE.PerspectiveCamera(57,innerWidth/innerHeight,.1,150);fitCamera();
 for(let i=0;i<3;i++){B(world,2.3,.25,140,i%2?'#eee8f8':'#f8ecf7',(i-1)*LANE_WIDTH,-.3,-55,.1);for(let j=0;j<28;j++){const cloud=group(world,(i-1)*LANE_WIDTH,-.18,-j*5);sph(cloud,.60,'#fff8f0',-.52,0,0,1.4,.35,1.15);sph(cloud,.60,'#fff8f0',.48,0,.2,1.3,.33,1.1);clouds.push({root:cloud,base:-j*5});}}
 for(const side of [-1,1])for(let i=0;i<16;i++){const c=group(world,side*(6+(i%3)*2),.2+(i%4),-i*7);for(let j=0;j<3;j++)sph(c,.8+j*.2,['#fff6e8','#ece5fc','#e6f0fc'][i%3],j-.9,Math.sin(j)*.25,0,1.4,.65,1);clouds.push({root:c,base:-i*7});}
 const rainbow=group(world,0,2,-80);for(let i=0;i<5;i++){const arc=mesh(new THREE.TorusGeometry(7+i*.27,.135,8,56,Math.PI),['#efb2cf','#f2c9a5','#f6e1a4','#b1d9cb','#b6c8ec'][i],rainbow);arc.rotation.z=0;}
 avatar=createBrain(modelH,kind);avatar.root.scale.setScalar(.78);avatar.root.position.set(0,0,3);avatar.root.rotation.y=Math.PI;avatar.setAir(false);world.add(avatar.root);
 }
 function fitCamera(){if(!camera)return;camera.aspect=innerWidth/innerHeight;const narrow=camera.aspect<.8;camera.fov=narrow?60:57;camera.position.set(0,narrow?8:6.7,narrow?Math.max(18.5,3+4.2/camera.aspect/Math.tan(Math.PI/6)):12.8);camera.lookAt(0,1,narrow?-10:-11);camera.updateProjectionMatrix();}
 function disposeWorld(){if(!world)return;for(const g of geometries)g.dispose();for(const m of materials)m.dispose();geometries.clear();materials.clear();materialCache.clear();sphereGeo=null;world=null;rowViews.clear();clouds=[];}
 function rowView(row){const g=group(world);const stars=[];for(const o of row.obstacles){const x=(o.lane-1)*LANE_WIDTH;
   if(o.kind==='block'){const c=group(g,x,0,0);for(const [dx,y,r]of [[-.45,.6,.57],[.1,.9,.76],[.54,.56,.55]])sph(c,r,'#b8acd8',dx,y,0,1,1,.85);for(let j=0;j<3;j++)star(c,(j-1)*.22,1.7+Math.sin(j)*.1,.05,.07);}
   else if(o.kind==='hurdle'){for(const side of [-1,1])B(g,.12,.78,.18,'#a4c7d9',x+side*.90,0,0,.06);B(g,1.98,.27,.26,'#dfaccd',x,.48,0,.10);for(let j=0;j<3;j++)star(g,x+(j-1)*.40,.68,.16,.095);}
   else{for(const side of [-1,1])B(g,.15,2.55,.22,'#ac94cd',x+side*1.0,0,0,.07);B(g,2.15,.6,.3,'#b7a2da',x,1.31,0,.12);for(let j=0;j<3;j++)star(g,x+(j-1)*.57,2.17,.03,.16);}
  }
  row.stars.forEach(v=>stars.push(star(g,(v.lane-1)*LANE_WIDTH,1.25,0,.24)));rowViews.set(row.id,{root:g,stars});return rowViews.get(row.id);
 }
 function renderUI(force=false){if(!active)return;const result=['over','complete'].includes(s.phase),key=[s.phase,kind,H.lang(),s.recorded].join(':');
  if(force||key!==lastPhase){lastPhase=key;pause.textContent=tr(s.phase==='paused'?'resume':'pause');pause.hidden=s.phase==='ready'||result;ui.querySelector('[data-run="exit"]').textContent=tr('exit');help.textContent=tr('help');ui.querySelector('.run-controls').innerHTML=[['left','←'],['jump','↑'],['slide','↓'],['right','→']].map(([a,icon])=>`<button data-run="${a}" aria-label="${tr(a)}">${icon}<small>${tr(a)}</small></button>`).join('');
   center.hidden=s.phase==='running';center.innerHTML=s.phase==='ready'?`<div class="run-doodles">☁︎ ✦ ☁︎</div><h2>${tr('title')}</h2><p>${tr('intro')}</p><p>${tr('ready')}</p><button class="run-primary" data-run="start">${tr('start')}</button>`:s.phase==='paused'?`<h2>${tr('paused')}</h2><button class="run-primary" data-run="resume">${tr('resume')}</button>`:result?`<div class="run-doodles">${s.phase==='complete'?'🌈':'✦ ☁︎ ✦'}</div><h2>${tr(s.phase==='complete'?'complete':'over')}</h2><p><b>${tr('score')} ${scoreRun(s)}</b> · ${tr('stars')} ${s.stars}</p><p>${tr('best')} ${records[kind].best} · ${Math.floor(s.distance)} / ${RUN_DISTANCE} ${tr('distance')}</p><p role="status">${tr(s.recorded?'saved':'saveError')}</p><button class="run-primary" data-run="again">${tr('again')}</button><button data-run="exit">${tr('exit')}</button>`:'';
  }
  const sk=[s.hearts,s.stars,Math.floor(s.distance),scoreRun(s)].join(':');if(force||sk!==lastScore){lastScore=sk;score.innerHTML=`${'♥'.repeat(s.hearts)}${'♡'.repeat(3-s.hearts)} &nbsp; ✦ ${s.stars}<small>${Math.floor(s.distance)} / ${RUN_DISTANCE} ${tr('distance')} · ${tr('best')} ${records[kind].best}</small>`;}
 }
 function start(k){if(active)return;kind=k;s=createRun();active=true;ui.setAttribute('aria-label',tr('title'));ui.hidden=false;time=0;makeWorld();document.body.classList.add('sky-runner');renderUI(true);}
 function exit(){if(!active)return;active=false;ui.hidden=true;document.body.classList.remove('sky-runner');disposeWorld();H.exit();}
 function restart(){disposeWorld();makeWorld();s=createRun();startRun(s);time=0;renderUI(true);}
 function action(a){if(!active)return;if(a==='exit')return exit();if(a==='again')return restart();if(a==='start'){startRun(s);renderUI();return;}if(a==='pause'){s.phase==='paused'?resumeRun(s):pauseRun(s);renderUI();return;}if(a==='resume'){resumeRun(s);renderUI();return;}runInput(s,a);}
 ui.addEventListener('click',e=>{const a=e.target.closest('[data-run]')?.dataset.run;if(a)action(a);});
 addEventListener('keydown',e=>{if(!active)return;const a={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'jump',w:'jump',' ':'jump',ArrowDown:'slide',s:'slide',Escape:'exit',p:'pause'}[e.key];if(a){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)action(a);}},true);
 let touch=null;H.canvas.addEventListener('pointerdown',e=>{if(active){touch={x:e.clientX,y:e.clientY};e.stopImmediatePropagation();}},true);H.canvas.addEventListener('pointerup',e=>{if(!active||!touch)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.max(Math.abs(dx),Math.abs(dy))>20)action(Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy<0?'jump':'slide');e.stopImmediatePropagation();},true);
 H.canvas.addEventListener('pointercancel',()=>touch=null);
 function suspend(){if(active){pauseRun(s);touch=null;renderUI();}}addEventListener('blur',suspend);document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();});
 addEventListener('resize',fitCamera);
 function update(dt){if(!active)return;time+=s.phase==='running'?dt:0;const events=stepRun(s,dt);for(const e of events)if(e==='star')H.chime();if(events.includes('over')||events.includes('complete'))saveRunRecord(records,kind,s,value=>localStorage.setItem('cookieHouse.skyRuns.v1',value));
  avatar.root.position.set(s.x,s.jump,3);avatar.root.scale.set(.78,s.slide>0?.29:.78,.78);avatar.body.rotation.z=-((s.lane-1)*LANE_WIDTH-s.x)*.12;avatar.anim({phase:time*12,amp:s.phase==='running'?1:0,runner:true},time);avatar.root.visible=!(s.invincible>0&&Math.floor(time*12)%2);
  for(const c of clouds)c.root.position.z=(c.base+s.distance%140+140)%140-125;
  for(const row of s.rows){const v=rowViews.get(row.id)||rowView(row);v.root.position.z=3-(row.distance-s.distance);v.stars.forEach((star,i)=>{star.visible=!row.stars[i].taken;star.rotation.y=time*1.8;star.position.y=1.25+Math.sin(time*3+row.id)*.08;});}
  for(const [id,v]of rowViews)if(!s.rows.some(r=>r.id===id)){v.root.removeFromParent();rowViews.delete(id);}renderUI();
 }
 return {start,exit,active:()=>active,update,render:renderer=>{if(active)renderer.render(world,camera);},snapshot:()=>s?{phase:s.phase,distance:s.distance,stars:s.stars,hearts:s.hearts,lane:s.lane,score:scoreRun(s)}:null};
}
