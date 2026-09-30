import {ICE_MENU,buyIce,CYCLE_ROUTE} from './coast-state.js';
const TEXT={zh:{title:'金门大桥 · 海风小站',ice:'Sunny Scoops',bike:'桥边骑单车',photo:'和大桥拍立得',visitIce:'去买雪糕',visitBike:'去骑单车',who:'谁来玩？',ride:'出发 · 兜一圈',riding:'沿着海风慢慢骑…',pause:'停下来看看',resume:'继续骑行',finish:'结束，回到海边',arrived:'兜风结束，回到海边啦。',free:'免费骑行 · 约半分钟，可随时停下',hint:'拍拍照，吹吹海风，再吃一支雪糕。',iceHint:'选一个口味，在海边坐下慢慢吃。',serving:'雪糕做好啦，送到海边座位…',eating:'慢慢吃雪糕，看看海。',happy:'甜甜凉凉的一口～',vanilla:'香草软雪糕',berry:'草莓软雪糕',cocoa:'巧克力软雪糕',coins:n=>`${n} 金币 · 坐下吃`,short:n=>`还差 ${n} 金币，去收集一点再来吧。`,save:'还没保存成功，请再试一次',back:'海边全景'},en:{title:'Golden Gate · Sea Breeze Stop',ice:'Sunny Scoops',bike:'Cycle by the bridge',photo:'A bridge Polaroid',visitIce:'Visit Sunny Scoops',visitBike:'Go cycling',who:'Who is coming?',ride:'Start a little ride',riding:'A ride in the sea breeze…',pause:'Pause for the view',resume:'Keep cycling',finish:'Finish at the seaside',arrived:'Back at the seaside!',free:'Free ride · about half a minute, stop anytime',hint:'A photo, a sea breeze, and a little ice cream.',iceHint:'Choose a flavor and enjoy it by the water.',serving:'Bringing your ice cream to the seaside seat…',eating:'An ice cream and a view of the bay.',happy:'A cool, sweet little moment.',vanilla:'Vanilla soft serve',berry:'Strawberry soft serve',cocoa:'Chocolate soft serve',coins:n=>`${n} coins · eat here`,short:n=>`You need ${n} more coins.`,save:'Could not save. Please try again.',back:'Seaside view'},ja:{title:'金門橋 · 海風の休憩所',ice:'Sunny Scoops',bike:'橋のそばでサイクリング',photo:'橋とチェキを撮る',visitIce:'アイス屋さんへ',visitBike:'自転車に乗る',who:'だれと行こう？',ride:'ひとまわり出発',riding:'海風の中をゆっくり…',pause:'景色を眺める',resume:'続きを走る',finish:'海辺に戻る',arrived:'海辺に戻ったよ。',free:'無料 · 約30秒、いつでも休めるよ',hint:'写真と海風と、ひとくちのアイス。',iceHint:'味を選んで海辺でのんびり食べよう。',serving:'海辺の席にアイスを届けるよ…',eating:'海を眺めながらアイス。',happy:'ひんやり甘いひととき。',vanilla:'バニラソフト',berry:'いちごソフト',cocoa:'チョコソフト',coins:n=>`${n}コイン · お店で食べる`,short:n=>`あと${n}コイン必要だよ。`,save:'保存できませんでした。もう一度試してね。',back:'海辺の全景'}};
export function coastWords(lang){return TEXT[lang]||TEXT.zh;}
export function createCoastExperience(H,model){
 const {THREE,chars,V,controls}=H,tr=(k,...args)=>{const v=coastWords(H.location().space==='ice'||active==='ice'?'en':H.lang())[k];return typeof v==='function'?v(...args):v;};
 const bar=document.createElement('section');bar.id='coastBar';bar.className='panel';document.querySelector('#bottom').prepend(bar);
 let who=0,active=null,time=0,paused=false,backup=null,serving=null,held=null,handTarget=null,bites=0,phase='';
 const curve=new THREE.CatmullRomCurve3(CYCLE_ROUTE.map(p=>V(...p)),false,'centripetal');
 const bicycle=model.bike();bicycle.root.visible=false;H.scene.add(bicycle.root);
 function refresh(){const s=H.location();bar.hidden=!['gg','bike','ice'].includes(s.space)||s.mode!=='orbit';if(bar.hidden)return;
  bar.classList.toggle('sunny-scoops',s.space==='ice');bar.lang=s.space==='ice'?'en':H.lang();
  const title=s.space==='ice'?'ice':s.space==='bike'?'bike':'title';
  bar.innerHTML=`<b>${tr(title)}</b><p role="status">${active==='cycle'?tr('riding'):active==='ice'?tr(phase||'serving'):tr(s.space==='ice'?'iceHint':s.space==='bike'?'free':'hint')}</p>${active?`<div>${active==='cycle'?`<button class="chip" data-coast="pause">${tr(paused?'resume':'pause')}</button>`:''}<button class="pill" data-coast="stop">${tr('finish')}</button></div>`:`${s.space!=='gg'?`<div class="coast-friends"><span>${tr('who')}</span>${chars.map((c,i)=>`<button class="chip ${who===i?'on':''}" data-coast="who:${i}" aria-pressed="${who===i}">${H.name(i,s.space==='ice'?'en':H.lang())}</button>`).join('')}</div>`:''}<div>${s.space==='gg'?`<button class="pill main" data-coast="photo">${tr('photo')}</button><button class="chip" data-coast="bike">${tr('visitBike')}</button><button class="chip" data-coast="ice">${tr('visitIce')}</button>`:s.space==='bike'?`<button class="pill main" data-coast="ride">${tr('ride')}</button><button class="chip" data-coast="gg">${tr('back')}</button>`:`${ICE_MENU.map(it=>`<button class="ice-card" data-coast="buy:${it.id}"><svg viewBox="0 0 46 52" aria-hidden="true"><path d="M12 30h22L23 51z" fill="#e9c16c"/><path d="M10 30c-7-8 2-14 8-16-3-5 6-5 5-12 12 8 15 16 10 18 14 7 4 15-4 13z" fill="${it.color}" stroke="#cfbca0"/></svg><b>${tr(it.id)}</b><small>${tr('coins',it.price)}</small></button>`).join('')}`}</div>`}`;
 }
 function acquire(kind){H.enter(kind==='cycle'?'bike':'ice');const c=chars[who];backup={hand:c.hand?.position.clone(),mouth:c.mouth?.scale.clone()};active=kind;time=0;paused=false;bites=0;phase='serving';
  Object.assign(c,{dining:true,cutscene:true,riding:false,carried:false,wantTram:false,path:[],jump:0,jv:0,amp:0});c.ripple.visible=false;controls.enabled=kind!=='cycle';refresh();return c;}
 function ride(){if(active||H.busy())return;acquire('cycle');bicycle.root.visible=true;H.chime();}
 function purchase(id){const result=buyIce(H.store,id,H.save,!!active||H.busy());if(!result.ok){if(result.reason==='short')H.toast(tr('short',result.short));if(result.reason==='save')H.toast(tr('save'));return;}
  H.wallet();const c=acquire('ice');c.x=model.iceSeat.x;c.y=model.iceSeat.y+(who? .25:0);c.z=model.iceSeat.z;c.yaw=0;c.root.position.set(c.x,c.y,c.z);c.root.rotation.set(0,0,0);
  serving=model.cone(id);H.scene.add(serving.root);serving.root.position.copy(model.iceTable);if(who)serving.root.scale.setScalar(.62);
  if(c.hand){held=model.cone(id);c.hand.add(held.root);held.root.position.set(0,.12,0);held.root.rotation.set(-.2,0,-.4);held.root.visible=false;const offset=held.tip.clone().applyEuler(held.root.rotation).add(held.root.position).applyQuaternion(c.hand.quaternion);handTarget=V(0,1.36,.43).sub(offset);}
  const target=V(c.x,c.y+.70,c.z+.30);H.fly({target,pos:target.clone().add(V(.35,1.1,5.9)),fov:H.portrait()?53:38},1.15);H.chime();
 }
 function stop(returnView=true){if(!active)return;const kind=active,c=chars[who];active=null;time=0;paused=false;controls.enabled=true;bicycle.root.visible=false;
  c.dining=false;c.cutscene=false;c.body.position.set(0,0,0);c.body.rotation.set(0,0,0);c.body.scale.setScalar(1);c.eyes.scale.y=1;if(c.hand&&backup?.hand)c.hand.position.copy(backup.hand);if(c.mouth&&backup?.mouth)c.mouth.scale.copy(backup.mouth);c.updateHandArm?.();
  for(const m of [serving,held])if(m){m.root.removeFromParent();H.dispose(m.root);}serving=held=null;handTarget=null;
  c.x=-64+(who-1)*.8;c.y=6.94;c.z=-54.2;c.yaw=0;c.root.position.set(c.x,c.y+.02,c.z);c.root.rotation.set(0,0,0);c.path=[];c.wait=5;c.good={x:c.x,y:c.y,z:c.z};c.anim({phase:0,amp:0},0);
  if(returnView){H.go(kind==='cycle'?'gg':'ice');if(kind==='cycle')H.toast(tr('arrived'));}refresh();
 }
 function update(dt,t){if(!active)return;const c=chars[who];if(!paused)time+=dt;
  if(active==='cycle'){
   const u=Math.min(1,time/34),p=curve.getPointAt(u),dir=curve.getTangentAt(u),yaw=Math.atan2(dir.x,dir.z);bicycle.root.position.copy(p);bicycle.root.rotation.y=yaw;
   if(!paused){bicycle.wheels.forEach(w=>w.rotation.x-=dt*9);bicycle.pedals.rotation.x+=dt*9;}
   c.root.position.copy(p).add(V(0,who?.86:.4,who?-.47:-.13).applyAxisAngle(V(0,1,0),yaw));c.root.rotation.set(0,yaw,0);c.x=c.root.position.x;c.y=p.y;c.z=c.root.position.z;
   c.anim({phase:time*9,amp:paused?0:who?.12:.7},time);c.body.position.set(0,Math.sin(time*5)*.009,0);c.body.rotation.set(who?0:.07,0,Math.sin(time)*.025);
   if(c.hand)c.hand.position.set(.14,.69,.70);c.updateHandArm?.();
   const target=p.clone().add(V(0,1.0,0)),offset=V(4.8,3.4,6.8);H.track(target,target.clone().add(offset),H.portrait()?64:48,dt);
   if(u>=1)stop();
  }else{
   c.anim({phase:0,amp:0},t);c.body.rotation.set(0,0,0);c.body.position.set(0,0,0);if(c.hand)c.hand.position.copy(backup.hand);
   const next=time<2?'serving':time<11?'eating':'happy';if(phase!==next){phase=next;refresh();}
   serving.root.visible=time>=1;let bite=0,p=0;if(time>=2&&time<11){bite=Math.min(2,Math.floor((time-2)/3));p=((time-2)%3)/3;
    if(c.hand){const tip=V(0,.35+.24*held.food.scale.y,0).applyEuler(held.root.rotation).add(held.root.position).applyQuaternion(c.hand.quaternion);handTarget=V(0,1.36,.43).sub(tip);const pickup=V(.22,.50,.9),smooth=k=>k*k*(3-2*k);if(p<.18)c.hand.position.lerpVectors(backup.hand,pickup,smooth(p/.18));else if(p<.45)c.hand.position.lerpVectors(pickup,handTarget,smooth((p-.18)/.27));else if(p<.68)c.hand.position.copy(handTarget);else c.hand.position.lerpVectors(handTarget,backup.hand,smooth((p-.68)/.32));held.root.visible=p>.15&&p<.70;serving.root.visible=!held.root.visible;}
    else {c.body.rotation.x=Math.sin(p*Math.PI)*.23;c.body.position.z=Math.sin(p*Math.PI)*.12;}
    if(p>.53&&bites< bite+1){bites=bite+1;H.chime();serving.food.scale.y=Math.max(.05,1-bites*.31);if(held)held.food.scale.copy(serving.food.scale);}
    if(p>.53)c.eyes.scale.y=.6;
   }else if(held)held.root.visible=false;
   if(time>=11){serving.food.visible=false;c.eyes.scale.y=.35;c.body.position.y=Math.abs(Math.sin(t*4))*.035;}
   c.updateHandArm?.();if(time>=13.5)stop();
  }
 }
 function action(e){const a=e.target.closest('[data-coast]')?.dataset.coast;if(!a)return;if(a.startsWith('who:')&&!active){who=+a.slice(4);refresh();}else if(a==='ride')ride();else if(a==='stop')stop();else if(a==='pause'){paused=!paused;refresh();}else if(a.startsWith('buy:'))purchase(a.slice(4));else if(a==='photo')H.photo();else if(['gg','bike','ice'].includes(a))H.go(a);}
 bar.addEventListener('click',action);
 addEventListener('keydown',e=>{if(e.key==='Escape')stop();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&active==='cycle'){paused=true;refresh();}});
 return {refresh,update,stop,leave:()=>stop(false),busy:()=>!!active,handleRay(ray){if(active||H.busy())return false;if(ray.intersectObjects(model.icePick,false).length){H.go('ice');return true;}if(ray.intersectObjects(model.bikePick,false).length){H.go('bike');return true;}if(ray.intersectObjects(model.photoPick,false).length||(['city','gg'].includes(H.location().space)&&ray.intersectObjects(model.bridgePick,false).length)){H.go('gg');return true;}return false;}};
}
