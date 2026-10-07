import {createSkyRunner} from './sky-runner.js?v=20261007-brains1';
const WORDS={
 zh:{forward:'向前飞',left:'向左飞',backward:'向后飞',right:'向右飞',fly:'遨游天空',run:'玩小游戏',up:'重新升空',land:'降落到陆地',control:'落地并操控',fall:'正在轻轻降落…',rise:'正在飞回天空…',air:'点空中的角色会降落。也可以一起俯瞰小世界，或去云端跑酷。',ground:'可以操控、跳跃或拖拽，也可以重新飞回天空。',sky:'一起遨游天空',back:'回到小世界',auto:'自动漫游',pause:'停下来看看',overview:'整个小世界',home:'小屋',jt:'日本町',china:'中国城',gg:'金门大桥',wharf:'渔人码头',hint:'方向键 / WASD 或下方箭头移动 · 滚轮拉近拉远',descW:'紫色星月帽和扫帚，脑洞飞向天空。',descA:'带着浅蓝翅膀和金色光环，轻轻飞过小世界。'},
 en:{forward:'Move forward',left:'Move left',backward:'Move back',right:'Move right',fly:'Explore the sky',run:'Play Cloud Run',up:'Fly again',land:'Land gently',control:'Land & control',fall:'Floating gently down…',rise:'Heading into the sky…',air:'Tap the flying friend to land, explore the world from above, or play Cloud Run.',ground:'Walk, jump or pick me up. You can fly again anytime.',sky:'A little sky adventure',back:'Back to the world',auto:'Auto cruise',pause:'Pause for the view',overview:'Whole world',home:'Home',jt:'Japantown',china:'Chinatown',gg:'Golden Gate',wharf:'Fisherman’s Wharf',hint:'Arrows / WASD or the buttons to move · scroll to zoom',descW:'A starry purple hat and a broom, with a head full of adventures.',descA:'Pale blue wings and a golden halo, floating over the little world.'},
 ja:{forward:'前へ飛ぶ',left:'左へ飛ぶ',backward:'後ろへ飛ぶ',right:'右へ飛ぶ',fly:'空を旅する',run:'雲ランで遊ぶ',up:'もう一度飛ぶ',land:'地上に降りる',control:'降りて操作する',fall:'ふわっと降りているよ…',rise:'空に戻っているよ…',air:'空の友だちをタップして着地。空の散歩や雲ランもできるよ。',ground:'歩く、ジャンプ、つかんで移動。また空に戻れるよ。',sky:'小さな空の旅',back:'世界に戻る',auto:'自動で旅する',pause:'景色を眺める',overview:'世界全体',home:'おうち',jt:'日本町',china:'中華街',gg:'金門橋',wharf:'ワーフ',hint:'矢印 / WASD またはボタンで移動 · スクロールでズーム',descW:'星と月の紫の帽子とほうきで、想像の空へ。',descA:'水色の翼と金色の輪で、ふわりと世界を飛ぶ。'}
};
export const SKY_PLACES={home:{x:0,z:3,y:0},jt:{x:29,z:6,y:0},china:{x:-31,z:8,y:0},gg:{x:-63,z:-54,y:6.94},wharf:{x:62,z:-51,y:0}};
export function createSkyFriends(H){
 const {THREE,V,chars,camera,controls}=H,brains=chars.filter(c=>c.brain);
 const actions=document.createElement('div');actions.id='brainActions';actions.hidden=true;document.querySelector('#card').append(actions);
 const panel=document.createElement('section');panel.id='skyPanel';panel.hidden=true;document.body.append(panel);
 let flying=null,cruise=true,cruiseStop=0,dwell=0,target=null,held='',lastState='',savedView=null,runnerReturn=null,skyHeight=45,overview=false;
 const tr=k=>(WORDS[H.lang()]||WORDS.zh)[k];
 const runner=createSkyRunner({...H,exit(){const c=runnerReturn;runnerReturn=null;H.restore();if(c)H.focus(c.i);}});
 function busy(){return !!flying||runner.active();}
 function clearCharacter(c){c.carried=false;c.riding=false;c.wantTram=false;c.cutscene=false;c.dining=false;c.path=[];c.jump=0;c.jv=0;c.faceCam=false;c.wait=.5;c.stuck=0;c.lastD=1e9;}
 function landingSpot(c){const points=[{x:8,z:5,y:0},{x:-8,z:6,y:0},...Object.values(SKY_PLACES).filter(p=>p!==SKY_PLACES.home)];points.sort((a,b)=>Math.hypot(a.x-c.x,a.z-c.z)-Math.hypot(b.x-c.x,b.z-c.z));for(const p of points){const safe=H.findSpot(p.x,p.z,p.y);if(safe)return safe;}return {x:8,z:5,y:0};}
 function land(i,control=false){const c=chars[i];if(!c?.brain||runner.active())return;if(c.skyState==='ground'){H.focus(i);if(control)H.control(i);return;}
  if(flying)endSky(false);clearCharacter(c);const to=landingSpot(c);c.skyMotion={from:V(c.x,c.y,c.z),to:V(to.x,to.y,to.z),t:0,duration:2.3,control};c.skyState='landing';c.setAir(false);H.focus(i);refresh();
 }
 function ascend(i){const c=chars[i];if(!c?.brain||c.skyState!=='ground')return;clearCharacter(c);c.skyState='rising';c.setAir(true);c.airAnchor={x:c.x,z:c.z,y:Math.max(11,c.y+9)};c.skyMotion={from:V(c.x,c.y,c.z),to:V(c.x,c.airAnchor.y,c.z),t:0,duration:2.0};H.focus(i);refresh();}
 function detachForCarry(c){if(!c?.brain)return;if(flying)endSky(false);if(c.skyState!=='ground')c.good=landingSpot(c);c.skyState='ground';c.skyMotion=null;c.setAir(false);c.carryY=0;}
 function refresh(){const i=H.selected(),c=chars[i],active=!!c?.brain,card=document.querySelector('#card');card.dataset.brain=String(active);actions.hidden=!active||busy();if(!active||busy())return;
  const air=c.skyState==='flying',moving=['rising','landing'].includes(c.skyState);document.querySelector('#cDesc').textContent=tr(c.skyState==='landing'?'fall':c.skyState==='rising'?'rise':air?'air':'ground');
  if(air||moving)document.querySelector('#cMain').textContent=tr('control');document.querySelector('#cMain').disabled=moving;
  const state=[i,c.skyState,H.lang()].join(':');if(lastState===state)return;lastState=state;
  actions.innerHTML=air?`<button class="pill" data-sky="fly">✧ ${tr('fly')}</button><button class="pill" data-sky="run">✦ ${tr('run')}</button><button class="pill" data-sky="land">↓ ${tr('land')}</button>`:moving?'':`<button class="pill" data-sky="up">↑ ${tr('up')}</button>`;
 }
 actions.addEventListener('click',e=>{const a=e.target.closest('[data-sky]')?.dataset.sky,i=H.selected();if(a==='land')land(i);if(a==='up')ascend(i);if(a==='fly')startSky(i);if(a==='run')startRunner(i);});
 function updateCharacter(c,dt,t){if(!c.brain||c.skyState==='ground')return false;
  c.root.visible=true;c.amp=0;c.phase=0;c.ripple.visible=false;c.body.scale.setScalar(1);c.body.position.set(0,0,0);c.body.rotation.set(0,0,Math.sin(t*1.6+c.i)*.035);
  if(c.skyMotion){const m=c.skyMotion;m.t=Math.min(1,m.t+dt/m.duration);const k=m.t*m.t*(3-2*m.t),p=m.from.clone().lerp(m.to,k);c.x=p.x;c.y=p.y;c.z=p.z;
   if(m.t>=1){c.skyMotion=null;c.skyState=c.skyState==='landing'?'ground':'flying';c.setAir(c.skyState!=='ground');c.good={x:c.x,y:c.skyState==='ground'?c.y:0,z:c.z};c.wait=.35;if(c.skyState==='ground'){c.squash=.15;if(m.control)H.control(c.i);}H.refresh();}
  }else if(flying!==c){const a=c.airAnchor;c.x=a.x+Math.sin(t*.23+c.i)*1.15;c.z=a.z+Math.cos(t*.23+c.i)*.75;c.y=a.y+Math.sin(t*1.1+c.i)*.30;c.yaw=H.selected()===c.i?Math.atan2(camera.position.x-c.x,camera.position.z-c.z):Math.sin(t*.22+c.i)*.35;}
  c.root.position.set(c.x,c.y+.02,c.z);c.root.rotation.set(0,c.yaw,0);c.anim(c,t);return true;
 }
 function skyUI(){panel.innerHTML=`<div class="sky-head"><b class="sky-name">✧ ${tr('sky')}</b><button data-sky="back">${tr('back')}</button></div><div class="sky-destinations"><button data-place="overview">${tr('overview')}</button>${Object.keys(SKY_PLACES).map(k=>`<button data-place="${k}">${tr(k)}</button>`).join('')}</div><div class="sky-footer"><p>${tr('hint')}</p><div class="sky-buttons"><button data-sky="cruise">${tr(cruise?'pause':'auto')}</button><button data-sky="land">↓ ${tr('land')}</button><button data-sky="run">✦ ${tr('run')}</button></div><div class="sky-pad"><button data-dir="up" aria-label="${tr('forward')}">↑</button><button data-dir="left" aria-label="${tr('left')}">←</button><button data-dir="down" aria-label="${tr('backward')}">↓</button><button data-dir="right" aria-label="${tr('right')}">→</button></div></div>`;}
 function startSky(i){const c=chars[i];if(!c?.brain||c.skyState!=='flying'||H.busy())return;clearCharacter(c);savedView=H.enterSky();flying=c;skyHeight=camera.aspect<1?61:45;overview=false;cruise=true;cruiseStop=0;dwell=0;target=SKY_PLACES.home;document.body.classList.add('sky-view');panel.hidden=false;controls.enablePan=false;H.cancelTween();H.view(V(c.x,0,c.z),V(c.x,45,c.z+24),63,1.2);skyUI();H.refresh();}
 function endSky(focus=true){if(!flying)return;const c=flying;flying=null;target=null;held='';panel.hidden=true;document.body.classList.remove('sky-view');c.airAnchor={x:c.x,y:Math.max(13,c.y),z:c.z};controls.enablePan=true;H.restore(savedView);savedView=null;if(focus)H.focus(c.i);}
 function startRunner(i){const c=chars[i];if(!c?.brain||c.skyState!=='flying'||runner.active()||H.busy())return;if(flying)endSky(false);runnerReturn=c;H.enterRunner();runner.start(c.kind);}
 function visit(k){if(!flying)return;cruise=false;held='';overview=k==='overview';if(overview){target=null;H.cancelTween();H.view(V(6,0,-30),V(6,Math.max(170,160/camera.aspect),54),65,1.2);}else{target=SKY_PLACES[k];}skyUI();}
 panel.addEventListener('click',e=>{const p=e.target.closest('[data-place]')?.dataset.place;if(p)return visit(p);const a=e.target.closest('[data-sky]')?.dataset.sky;if(a==='back')endSky();if(a==='land')land(flying.i);if(a==='run')startRunner(flying.i);if(a==='cruise'){overview=false;cruise=!cruise;target=cruise?Object.values(SKY_PLACES)[cruiseStop]:null;skyUI();}});
 panel.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-dir]');if(b){held=b.dataset.dir;cruise=false;target=null;b.setPointerCapture(e.pointerId);e.preventDefault();}});for(const event of ['pointerup','pointercancel','lostpointercapture'])panel.addEventListener(event,()=>held='');
 H.canvas.addEventListener('wheel',e=>{if(!flying||overview)return;skyHeight=THREE.MathUtils.clamp(skyHeight+Math.sign(e.deltaY)*4,29,100);e.preventDefault();e.stopImmediatePropagation();if(!target)target={x:flying.x,z:flying.z};},{passive:false,capture:true});
 addEventListener('blur',()=>held='');document.addEventListener('visibilitychange',()=>{if(document.hidden)held='';});
 function update(dt,t){if(!flying)return;const c=flying,input=H.input(),ix=(input.has('arrowright')||input.has('d')||held==='right'?1:0)-(input.has('arrowleft')||input.has('a')||held==='left'?1:0),iz=(input.has('arrowdown')||input.has('s')||held==='down'?1:0)-(input.has('arrowup')||input.has('w')||held==='up'?1:0);let moving=false;
  if(ix||iz){overview=false;if(cruise){cruise=false;skyUI();}target=null;const length=Math.hypot(ix,iz);c.x=THREE.MathUtils.clamp(c.x+ix/length*18*dt,-80,88);c.z=THREE.MathUtils.clamp(c.z+iz/length*18*dt,-85,22);c.yaw=Math.atan2(ix,iz);moving=true;}
  else if(target){const dx=target.x-c.x,dz=target.z-c.z,d=Math.hypot(dx,dz);if(d>1){const step=Math.min(d,dt*14);c.x+=dx/d*step;c.z+=dz/d*step;c.yaw=Math.atan2(dx,dz);moving=true;}else if(cruise){dwell+=dt;if(dwell>3){dwell=0;cruiseStop=(cruiseStop+1)%Object.keys(SKY_PLACES).length;target=Object.values(SKY_PLACES)[cruiseStop];}}}
  c.y=16+Math.sin(t)*.3;c.root.position.set(c.x,c.y,c.z);c.root.rotation.y=c.yaw;
  if(moving||target){H.cancelTween();const offset=V(0,skyHeight,skyHeight*.577),wanted=V(c.x,2,c.z);controls.target.lerp(wanted,Math.min(1,dt*3));camera.position.lerp(wanted.clone().add(offset),Math.min(1,dt*3));camera.fov=63;camera.updateProjectionMatrix();}
 }
 function leave(){if(flying)endSky(false);if(runner.active())runner.exit();}
 return {refresh,land,ascend,updateCharacter,detachForCarry,update,busy,leave,runner,startSky,startRunner,skyActive:()=>!!flying};
}
