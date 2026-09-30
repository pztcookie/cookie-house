import {TEAS,DIM_SUM,teaName,teaBill,payTeaTable} from './tea-state.js';
const WORDS={
 zh:{tea:'春和茶馆',teaPatio:'灯笼下的早茶',choose:'先泡一壶茶，再挑几盘点心。',free:'茶免费 · 点心按盘，一桌分享',brew:'泡好这壶茶',brewing:'茶叶舒展开，等茶香慢慢散开…',ready:'茶泡好了，挑点心、请朋友一起坐吧。',who:'请谁一起吃茶？',hint:'最多挑三盘，也可以只喝茶。',each:n=>`${n} 金币 / 盘`,pay:n=>`上点心，一起吃 · ${n} 金币`,drink:'一起喝茶 · 免费',pouring:'给大家倒一杯热茶。',serving:'点心上桌，给大家倒茶。',drinking:'捧起茶杯，慢慢喝一口。',eating:'一桌点心，和朋友们慢慢分享。',relax:'茶香还在，和朋友再坐一会儿。',more:'再选点心',sip:'再喝一口茶',leave:'散席，去逛街',back:'回灯笼街',inside:'坐室内',outside:'坐灯笼下',short:n=>`还差 ${n} 金币，可以少选一盘。`,save:'还没保存成功，请再试一次。',guests:'至少请一位朋友来吧。',limit:'一桌先选三盘，吃完还可以再点。',paid:n=>`这一桌 ${n} 金币 · 已付款`,teaOnly:'这一壶茶免费',change:'换一壶茶'},
 en:{tea:'Spring Harmony Tea',teaPatio:'Tea under the lanterns',choose:'Brew a pot, then choose a few plates.',free:'Tea is free · each plate is shared by the table',brew:'Brew this pot',brewing:'The leaves unfold; a little time for the tea…',ready:'Tea is ready. Choose dim sum and invite your friends.',who:'Who is joining?',hint:'Choose up to three plates, or just enjoy tea.',each:n=>`${n} coins / plate`,pay:n=>`Serve & share · ${n} coins`,drink:'Share some tea · free',pouring:'Pouring a warm cup for everyone.',serving:'Dim sum is here. Pouring tea for everyone.',drinking:'A little cup, a slow sip.',eating:'A table of little treats to share.',relax:'Stay a little longer with your friends.',more:'Choose more dim sum',sip:'Another sip of tea',leave:'Leave the table',back:'Back to the lane',inside:'Sit inside',outside:'Sit under the lanterns',short:n=>`You need ${n} more coins. Try one fewer plate.`,save:'Could not save. Please try again.',guests:'Invite at least one friend.',limit:'Up to three plates at a time. You can order more later.',paid:n=>`${n} coins for the table · paid`,teaOnly:'This pot of tea is free',change:'Brew a different tea'},
 ja:{tea:'春和茶館',teaPatio:'ランタンの下で飲茶',choose:'お茶を淹れてから、点心を選ぼう。',free:'お茶は無料 · 点心は一皿ずつ、みんなでシェア',brew:'このお茶を淹れる',brewing:'茶葉がひらき、香りが広がる…',ready:'お茶ができたよ。点心と友だちを選ぼう。',who:'だれと一緒に？',hint:'三皿まで選べるよ。お茶だけでもどうぞ。',each:n=>`一皿 ${n}コイン`,pay:n=>`点心を囲もう · ${n}コイン`,drink:'一緒にお茶 · 無料',pouring:'みんなに温かいお茶を注ぐよ。',serving:'点心を並べて、お茶を注ぐよ。',drinking:'湯のみを持って、ゆっくりひとくち。',eating:'友だちと分け合う、小さな点心。',relax:'お茶の香りと、友だちとのひととき。',more:'点心を追加',sip:'もうひとくち',leave:'席を立つ',back:'通りへ',inside:'店内に座る',outside:'ランタンの下へ',short:n=>`あと${n}コイン必要。一皿減らしてみよう。`,save:'保存できませんでした。もう一度試してね。',guests:'ひとり以上の友だちを選ぼう。',limit:'一度に三皿まで。あとで追加できるよ。',paid:n=>`テーブルで${n}コイン · 支払済`,teaOnly:'このお茶は無料',change:'違うお茶を淹れる'},
};
const ART={osmanthus:'<path d="M8 20h30v17H8z" fill="#f2d795"/><path d="M8 15h30v13H8z" fill="#fff0c4"/><path d="M16 19l4 5m-4 0 4-5m7 0 4 5m-4 0 4-5" stroke="#d5a742" stroke-width="2"/>',redbean:'<path d="M9 17h29v21H9z" fill="#a76966"/><path d="M9 14h29v10H9z" fill="#cf9481"/><g fill="#714549"><circle cx="16" cy="19" r="2"/><circle cx="29" cy="18" r="2"/><circle cx="24" cy="29" r="2"/></g>',almond:'<path d="M12 13q12-6 24 0l4 23q-16 8-32 0z" fill="#fff5de"/><path d="M18 14q6-4 12 0" fill="none" stroke="#e8bc60" stroke-width="3"/>',tart:'<path d="M7 23l5-10 5 3 5-5 5 4 5-2 8 10-4 14H11z" fill="#ddb373"/><ellipse cx="24" cy="22" rx="13" ry="9" fill="#f8d567"/>',bun:'<ellipse cx="24" cy="25" rx="17" ry="14" fill="#fff0cc"/><path d="M16 13l8 8 7-9m-7 9v-9" stroke="#dcca9e" fill="none"/><path d="M28 26q12 1 3 7" fill="#eaba54"/>',dumpling:'<path d="M6 31q4-26 18-16 15-9 19 16Q24 43 6 31" fill="#fff1df"/><path d="M13 29q2-13 6-6m1 8q1-14 6-6m2 7q0-13 6-6" stroke="#dcbba8" fill="none"/>'};
export function createTeaExperience(H,model){
 const {THREE,chars,V}=H,sets=model.teaSets,tables=sets.tables;
 const bar=document.createElement('section');bar.id='teaBar';bar.className='panel';bar.hidden=true;document.querySelector('#bottom').prepend(bar);
 const tr=(k,...args)=>{const v=(WORDS[H.lang()]||WORDS.zh)[k];return typeof v==='function'?v(...args):v;};
 let place='tea',teaId='osmanthusTea',phase='choose',time=0,selected=[],guests=[0],seated=new Map(),orders=[],paid=0,drinksOnly=false;
 const busy=()=>['brewing','serving','drinking','eating'].includes(phase);
 const table=()=>tables[place],name=it=>teaName(it,H.lang()),isHere=()=>['tea','teaPatio'].includes(H.location().space)&&H.location().mode==='orbit';
 const button=(act,label,main=false)=>`<button class="${main?'pill main':'chip'}" data-tea="${act}">${label}</button>`;
 function refresh(){bar.hidden=!isHere();if(bar.hidden)return;const current=H.location().space;if(!seated.size&&!busy())place=current;
  const playing=['serving','drinking','eating'].includes(phase),choosing=['choose','ready'].includes(phase);
  bar.innerHTML=`<div class="tea-heading"><b>${tr(place)}</b>${choosing?button(place==='tea'?'outside':'inside',tr(place==='tea'?'outside':'inside')):''}</div><p role="status">${tr(phase==='serving'&&drinksOnly?'pouring':phase)}</p>${phase==='choose'?`<div class="tea-types">${TEAS.map(it=>`<button class="chip ${teaId===it.id?'on':''}" data-tea="type:${it.id}" aria-pressed="${teaId===it.id}">${name(it)}</button>`).join('')}</div><small>${tr('free')}</small><div class="tea-actions">${button('brew',tr('brew'),true)}${button('back',tr('back'))}</div>`:''}${phase==='ready'?`<div class="tea-friends"><span>${tr('who')}</span>${chars.map((c,i)=>`<button class="chip ${guests.includes(i)?'on':''}" data-tea="guest:${i}" aria-pressed="${guests.includes(i)}">${H.name(i)}</button>`).join('')}</div><div class="dim-sum-menu">${DIM_SUM.map(it=>`<button class="dim-sum ${selected.includes(it.id)?'on':''}" data-tea="dish:${it.id}" aria-pressed="${selected.includes(it.id)}"><svg viewBox="0 0 48 46" aria-hidden="true"><ellipse cx="24" cy="37" rx="22" ry="7" fill="#e9dfc9"/>${ART[it.id]}</svg><b>${name(it)}</b><small>${tr('each',it.price)}</small></button>`).join('')}</div><small>${tr('hint')}</small><div class="tea-actions">${button('start',selected.length?tr('pay',teaBill(selected)):tr('drink'),true)}${button('change',tr('change'))}</div>`:''}${playing?`<small>${paid?tr('paid',paid):tr('teaOnly')}</small>`:''}${phase==='relax'?`<div class="tea-actions">${button('more',tr('more'),true)}${button('sip',tr('sip'))}</div>`:''}${!choosing?`<div class="tea-actions">${button('leave',tr('leave'))}</div>`:''}`;
 }
 function view(close=false){const t=table(),target=t.world(V(0,H.portrait()?.12:.85,0)),pos=t.world(V(close?.3:0,H.portrait()?3.1:3.25,H.portrait()?6.5:6.0));H.fly({target,pos,fov:H.portrait()?74:48},1.0);}
 function release(i){const s=seated.get(i);if(!s)return;const c=chars[i];
  if(s.held){s.held.removeFromParent();H.dispose(s.held);}if(s.portion){s.portion.removeFromParent();H.dispose(s.portion);}
  c.dining=false;c.cutscene=false;c.faceCam=false;c.body.position.set(0,0,0);c.body.rotation.set(0,0,0);c.body.scale.setScalar(1);c.eyes.scale.y=1;if(c.hand)c.hand.position.copy(s.hand);if(c.mouth)c.mouth.scale.copy(s.mouth);c.anim({phase:0,amp:0},0);c.updateHandArm?.();
  c.x=-31+(i-1)*.9;c.y=0;c.z=place==='tea'?.3:-3.5;c.yaw=0;c.root.position.set(c.x,.02,c.z);c.root.rotation.set(0,0,0);c.path=[];c.wait=5;c.good={x:c.x,y:0,z:c.z};seated.delete(i);
 }
 function seatGuests(){const t=table();for(const i of [...seated.keys()])if(!guests.includes(i))release(i);
  for(const i of guests){const c=chars[i];if(!seated.has(i))seated.set(i,{hand:c.hand?.position.clone(),mouth:c.mouth?.scale.clone()});const s=seated.get(i),slot=i,pos=t.seat(slot,i);s.slot=slot;
   Object.assign(c,{dining:true,cutscene:true,riding:false,carried:false,wantTram:false,faceCam:false,path:[],jump:0,jv:0,amp:0,x:pos.point.x,y:pos.point.y,z:pos.point.z,yaw:pos.yaw});c.root.position.copy(pos.point);c.root.rotation.set(0,c.yaw,0);c.ripple.visible=false;
  }t.cups.forEach((c,i)=>c.root.visible=guests.includes(i));
 }
 function enter(){H.enter(place);seatGuests();view();}
 function brew(){if(busy()||H.busy())return;place=H.location().space;phase='brewing';time=0;orders=[];selected=[];table().clear();table().reset();table().warm=true;enter();refresh();H.chime();}
 function stop(){for(const i of [...seated.keys()])release(i);for(const t of Object.values(tables)){t.reset();t.warm=false;}table().clear();phase='choose';time=0;selected=[];orders=[];paid=0;refresh();}
 function start(sip=false){if(H.busy()||busy())return;const ids=sip?[]:selected;
  const result=payTeaTable(H.store,{ids,guests,ready:phase==='ready'||phase==='relax',busy:false},H.save);
  if(!result.ok){H.toast(result.reason==='short'?tr('short',result.short):tr(result.reason==='save'?'save':'guests'));return;}
  paid=result.total;orders=[...ids];drinksOnly=!ids.length;phase='serving';time=0;table().reset();table().serve(ids);table().warm=true;H.wallet();enter();
  for(const s of seated.values()){if(s.held){s.held.removeFromParent();H.dispose(s.held);s.held=null;}if(s.portion){s.portion.removeFromParent();H.dispose(s.portion);s.portion=null;}s.bite=-1;}
  refresh();H.chime();
 }
 function changePhase(next){if(phase!==next){phase=next;refresh();}}
 function prepareHeld(c,s,kind){if(s.kind===kind&&s.held)return;
  for(const key of ['held','portion'])if(s[key]){s[key].removeFromParent();H.dispose(s[key]);s[key]=null;}
  s.kind=kind;const obj=kind==='cup'?sets.cup(TEAS.find(it=>it.id===teaId).color):sets.piece(kind);s.tip=obj.tip;
  if(c.hand){s.held=obj.root;c.hand.add(s.held);s.held.position.set(0,.12,0);s.held.rotation.set(0,0,-.5);}
  else {s.portion=obj.root;table().root.add(s.portion);const p=table().seatOffsets[s.slot].clone().normalize().multiplyScalar(.64);s.portion.position.set(p.x,table().top+.035,p.z);s.portion.scale.setScalar(.9);}
 }
 function update(dt,t){if(!isHere()&&!seated.size)return;const tb=table();if(busy())time+=dt;
  if(phase==='brewing'){tb.pot.rotation.z=Math.sin(time*3)*.045;if(time>=2.8){tb.pot.rotation.z=0;changePhase('ready');}}
  if(['serving','drinking','eating'].includes(phase)){
   const end=drinksOnly?11.5:21;
   changePhase(time<4?'serving':time<end&&(drinksOnly||time<10)?'drinking':time<end?'eating':'relax');
   tb.snacks.forEach(d=>{d.root.position.y=Math.max(0,1-Math.min(1,time/1.5))*.5;});
   if(time<4){const k=Math.min(guests.length-1,Math.floor(Math.max(0,time-1)*guests.length/3)),slot=guests[k],cup=tb.cups[slot].root,progress=Math.min(1,(time-1)*guests.length/3-k),inward=V(-cup.position.x,0,-cup.position.z).normalize().multiplyScalar(.36);tb.pot.position.copy(cup.position).add(inward).add(V(0,.40,0));tb.pot.rotation.set(0,-Math.atan2(-inward.z,-inward.x),progress>0?-.48*Math.sin(progress*Math.PI):0);
    tb.stream.visible=progress>.12&&progress<.85;if(tb.stream.visible){const from=V(.34,.15,0).applyEuler(tb.pot.rotation).add(tb.pot.position),to=cup.position.clone().add(V(0,.12,0)),dir=to.clone().sub(from);tb.stream.position.copy(from).addScaledVector(dir,.5);tb.stream.scale.y=dir.length();tb.stream.quaternion.setFromUnitVectors(V(0,1,0),dir.normalize());}
   }else {tb.pot.position.set(.15,tb.top,-.11);tb.pot.rotation.set(0,0,0);tb.stream.visible=false;}
   if(phase==='relax'){tb.reset();tb.cups.forEach((c,i)=>c.root.visible=guests.includes(i));H.chime();}
  }
  for(const [i,s] of seated){const c=chars[i];c.anim({phase:0,amp:0},t);c.body.position.set(0,0,0);c.body.rotation.set(0,0,0);c.body.scale.setScalar(1);c.eyes.scale.y=Math.sin(t*1.2+i)>.993?.2:1;if(c.hand)c.hand.position.copy(s.hand);if(c.mouth)c.mouth.scale.copy(s.mouth);if(s.held)s.held.visible=false;if(s.portion)s.portion.visible=false;
   const drink=phase==='drinking',eat=phase==='eating'&&!drinksOnly;
   if(drink||eat){const startAt=drink?4:10,local=Math.max(0,time-startAt-i*.17),p=(local%3)/3,round=Math.floor(local/3),kind=drink?'cup':orders[Math.min(orders.length-1,Math.floor(round*orders.length/3))];prepareHeld(c,s,kind);
    const lift=Math.sin(Math.min(1,p/.65)*Math.PI),cup=tb.cups[i];
    if(c.hand){const sm=n=>n*n*(3-2*n),obj=s.held,offset=s.tip.clone().applyEuler(obj.rotation).add(obj.position).applyQuaternion(c.hand.quaternion),target=V(0,1.36,.43).sub(offset),pickup=V(.18,.52,.86);
     if(p<.15)c.hand.position.lerpVectors(s.hand,pickup,sm(p/.15));else if(p<.48)c.hand.position.lerpVectors(pickup,target,sm((p-.15)/.33));else if(p<.67)c.hand.position.copy(target);else c.hand.position.lerpVectors(target,s.hand,sm((p-.67)/.33));obj.visible=p>.13&&p<.70;if(drink){cup.root.visible=!obj.visible;if(obj.visible&&p>.48)obj.rotation.x=-.18;}
    }else {c.body.rotation.x=lift*(drink?.18:.28);c.body.position.z=lift*.13;if(s.portion){s.portion.visible=eat;s.portion.scale.setScalar(p>.62?.58:.9);}cup.root.visible=true;}
    if(p>.53){c.eyes.scale.y=.52;if(drink)cup.liquid.position.y=.065;else{const plate=tb.snacks[Math.min(tb.snacks.length-1,Math.floor(round*orders.length/3))];if(plate)plate.parts[Math.min(2,(orders.length===3?0:round*guests.length)+guests.indexOf(i))].visible=false;}}
   }else if(phase==='relax'){c.body.rotation.z=Math.sin(t*1.5+i)*.018;c.eyes.scale.y=.78;tb.cups[i].root.visible=true;}
   c.updateHandArm?.();
  }
 }
 bar.addEventListener('click',e=>{const a=e.target.closest('[data-tea]')?.dataset.tea;if(!a)return;
  if(a==='leave'||a==='back'){stop();H.go('lantern');return;}if(busy())return;
  if(a==='inside'||a==='outside'){stop();H.go(a==='inside'?'tea':'teaPatio');place=a==='inside'?'tea':'teaPatio';view();return;}
  if(a.startsWith('type:')){teaId=a.slice(5);const color=TEAS.find(it=>it.id===teaId).color;table().cups.forEach(c=>c.liquid.material.color.set(color));refresh();}
  else if(a==='brew')brew();else if(a==='change'){phase='choose';refresh();}
  else if(a.startsWith('guest:')){const i=+a.slice(6);guests=guests.includes(i)?guests.filter(x=>x!==i):[...guests,i].sort();seatGuests();refresh();}
  else if(a.startsWith('dish:')){const id=a.slice(5);if(selected.includes(id))selected=selected.filter(x=>x!==id);else if(selected.length<3)selected.push(id);else H.toast(tr('limit'));table().serve(selected);refresh();}
  else if(a==='start')start();else if(a==='sip')start(true);else if(a==='more'){selected=[];table().clear();phase='ready';refresh();}
 });
 addEventListener('keydown',e=>{if(e.key==='Escape'&&seated.size){stop();H.go(place);}});
 return {refresh,update,busy:()=>busy()||seated.size>0,leave:stop,view,handleRay(ray){if(busy()||H.busy())return false;const hit=ray.intersectObjects(sets.picks,false)[0];if(!hit)return false;const id=hit.object.userData.teaTable;if(H.location().space!==id){H.go(id);place=id;view();}else if(phase==='choose')brew();return true;}};
}
