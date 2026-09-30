import {orderChowder,CHOWDER_PRICE} from './wharf-state.js';
const WORDS={
 zh:{title:'渔人码头 · 海风与面包香',bakery:'浓汤面包店',chowder:'海景餐桌',seaLions:'PIER 39 · 看海狮',intro:'沿木栈道散步，吃一碗热浓汤，再去看看海狮。',menu:'蛤蜊浓汤面包碗',hint:'海狮主厨欢迎你！选 1–3 位朋友，每人一碗，坐在海边一起吃。',watch:'海狮们正在浮台上晒太阳，旁边还有一位在游泳。',who:'和谁一起？',pay:(n,t)=>`${n} 碗 · ${t} 金币 · 一起吃`,price:'每碗 6 金币',empty:'请先选一位朋友',short:n=>`还差 ${n} 金币。可以先去收集金币，再回来吃。`,save:'这次没能保存，请重试。',serving:'热乎乎的浓汤上桌了…',eating:'一口浓汤，一阵海风。',happy:'吃饱啦，和朋友多看一会儿海。',finish:'吃好了，去散步',photo:'拍一张码头拍立得',back:'码头全景',goBakery:'去面包店',goLions:'去看海狮',goTable:'海景餐桌'},
 en:{title:'Fisherman’s Wharf · Bread & Sea Breeze',bakery:'The Chowder Bakery',chowder:'A Table by the Bay',seaLions:'PIER 39 · Sea Lions',intro:'Stroll along the wooden pier, share warm chowder, and watch the sea lions.',menu:'Clam Chowder Bread Bowl',hint:'Your sea lion chef is ready! Choose 1–3 friends for a warm bowl each by the sea.',watch:'Sea lions bask on the floating docks while one swims nearby.',who:'Who is coming?',pay:(n,t)=>`${n} bowls · ${t} coins · Eat together`,price:'6 coins per bowl',empty:'Choose at least one friend.',short:n=>`You need ${n} more coins. Collect some and come back!`,save:'Could not save. Please try again.',serving:'Warm bowls are on their way…',eating:'A spoonful of chowder and a sea breeze.',happy:'Happy and full. Stay a little longer by the bay.',finish:'Finish and take a stroll',photo:'Take a Wharf Polaroid',back:'Wharf view',goBakery:'Visit the bakery',goLions:'Watch sea lions',goTable:'Seaside table'},
 ja:{title:'ワーフ · 海風とパンの香り',bakery:'チャウダーのお店',chowder:'海辺のテーブル',seaLions:'PIER 39 · アシカ',intro:'木の桟橋を歩いて、温かいチャウダーを食べて、アシカを見に行こう。',menu:'クラムチャウダーのパンボウル',hint:'アシカのシェフがお出迎え！友だちを1〜3人選んで、海辺で一人一杯ずつ。',watch:'浮き桟橋で日向ぼっこ。そばでは一頭が泳いでいるよ。',who:'だれと食べる？',pay:(n,t)=>`${n}杯 · ${t}コイン · 一緒に食べる`,price:'一杯6コイン',empty:'友だちを選んでね。',short:n=>`あと${n}コイン必要だよ。`,save:'保存できませんでした。もう一度試してね。',serving:'温かいチャウダーを運んでいるよ…',eating:'チャウダーをひとくち、海風をひと息。',happy:'おなかいっぱい。もう少し海を眺めよう。',finish:'ごちそうさま、散歩に行く',photo:'ワーフでチェキ',back:'ワーフ全景',goBakery:'パン屋さんへ',goLions:'アシカを見る',goTable:'海辺のテーブル'}
};
export function wharfView(V,space,aspect){
 const narrow=aspect<1;
 if(space==='bakery')return {target:V(54.7,2.1,-67),pos:V(54.7,3.45,-56.7),fov:narrow?76:52};
 if(space==='chowder')return {target:V(67.6,1.25,-54.8),pos:V(68.5,4.5,-44.5),fov:narrow?65:42};
 if(space==='seaLions')return {target:V(84,0,-68.5),pos:V(76,6,-55),fov:narrow?63:45};
 return {target:V(66,1,-58),pos:V(88,29,-19),fov:narrow?73:49};
}
export function createWharfExperience(H,model){
 const {V,chars}=H;let selected=new Set([0]),meal=null;
 const bar=document.createElement('section');bar.id='wharfBar';bar.className='panel';bar.hidden=true;document.querySelector('#bottom').prepend(bar);
 const tr=(k,...a)=>{const v=(WORDS[H.lang()]||WORDS.zh)[k];return typeof v==='function'?v(...a):v;};
 function refresh(){const {space,mode}=H.location();bar.hidden=mode!=='orbit'||!['wharf','bakery','chowder','seaLions'].includes(space);if(bar.hidden)return;
 const dining=['bakery','chowder'].includes(space),title=space==='wharf'?'title':space;
 bar.innerHTML=`<b>${tr(title)}</b><p role="status">${meal?tr(meal.phase):tr(dining?'hint':space==='seaLions'?'watch':'intro')}</p>${meal?`<button class="pill" data-wharf="finish">${tr('finish')}</button>`:dining?`<div class="wharf-menu"><span aria-hidden="true">🥖</span><div><strong>${tr('menu')}</strong><small>${tr('price')}</small></div></div><div class="wharf-friends"><span>${tr('who')}</span>${chars.map((c,i)=>`<button class="chip ${selected.has(i)?'on':''}" data-wharf="friend:${i}" aria-pressed="${selected.has(i)}">${H.name(i)}</button>`).join('')}</div><button class="pill main" data-wharf="order" ${!selected.size?'disabled':''}>${selected.size?tr('pay',selected.size,selected.size*CHOWDER_PRICE):tr('empty')}</button>`:`<div class="wharf-actions"><button class="pill" data-wharf="photo">${tr('photo')}</button>${space==='wharf'?`<button class="chip" data-wharf="bakery">${tr('goBakery')}</button><button class="chip" data-wharf="seaLions">${tr('goLions')}</button>`:`<button class="chip" data-wharf="wharf">${tr('back')}</button>`}</div>`}`;
 }
 function view(){H.fly(wharfView(V,H.location().space,H.aspect()),.9);}
 function order(){const r=orderChowder(H.store,[...selected],H.save,!!meal||H.busy());if(!r.ok){if(r.reason==='short')H.toast(tr('short',r.short));else if(r.reason==='save')H.toast(tr('save'));return;}H.wallet();H.enter('chowder');model.serve(r.pass);meal={pass:r.pass,t:0,phase:'serving',people:[]};
 for(const i of r.pass){const c=chars[i],seat=model.seat(i),state={i,hand:c.hand?.position.clone(),mouth:c.mouth?.scale.clone(),spoon:null};
 Object.assign(c,{dining:true,cutscene:true,riding:false,carried:false,wantTram:false,faceCam:false,path:[],jump:0,jv:0,amp:0});H.scene.add(c.root);c.x=seat.point.x;c.y=seat.point.y;c.z=seat.point.z;c.yaw=seat.yaw;c.root.position.copy(seat.point);c.root.rotation.set(0,seat.yaw,0);c.ripple.visible=false;
 if(c.hand){state.spoon=model.spoon();c.hand.add(state.spoon.root);state.spoon.root.rotation.set(-.25,0,-.3);state.spoon.root.position.set(0,.06,0);const off=state.spoon.tip.clone().applyEuler(state.spoon.root.rotation).add(state.spoon.root.position).applyQuaternion(c.hand.quaternion);state.target=V(0,1.36,.43).sub(off);}
 meal.people.push(state);}
 H.chime();view();refresh();
 }
 function finish(navigate=true){if(!meal)return;const m=meal;meal=null;
 for(const a of m.people){const c=chars[a.i];if(a.spoon){a.spoon.root.removeFromParent();H.dispose(a.spoon.root);}c.body.position.set(0,0,0);c.body.rotation.set(0,0,0);c.body.scale.setScalar(1);c.eyes.scale.y=1;if(c.hand&&a.hand)c.hand.position.copy(a.hand);if(c.mouth&&a.mouth)c.mouth.scale.copy(a.mouth);c.updateHandArm?.();Object.assign(c,{dining:false,cutscene:false,faceCam:false,path:[],wait:4,cool:8,y:0,x:64+(a.i-1)*1.5,z:-52,yaw:0});c.root.position.set(c.x,.02,c.z);c.root.rotation.set(0,0,0);c.good={x:c.x,y:0,z:c.z};c.anim({phase:0,amp:0},0);}
 model.clearMeal();if(navigate)H.go('wharf');refresh();
 }
 const smooth=x=>x*x*(3-2*x);
 function update(dt,t){if(!meal)return;meal.t+=dt;const time=meal.t,phase=time<1.5?'serving':time<15?'eating':'happy';if(phase!==meal.phase){meal.phase=phase;refresh();}
 for(const a of meal.people){const c=chars[a.i];c.anim({phase:0,amp:0},t);c.body.position.set(0,0,0);c.body.rotation.set(0,0,0);if(c.hand)c.hand.position.copy(a.hand);c.eyes.scale.y=1;
 const u=Math.max(0,time-1.5-a.i*.18),p=(u%3.8)/3.8,eating=time>=1.5&&time<15;if(eating){const reach=V(.3,.8,.8);if(c.hand){if(p<.2)c.hand.position.lerpVectors(a.hand,reach,smooth(p/.2));else if(p<.45)c.hand.position.lerpVectors(reach,a.target,smooth((p-.2)/.25));else if(p<.66)c.hand.position.copy(a.target);else c.hand.position.lerpVectors(a.target,a.hand,smooth((p-.66)/.34));a.spoon.root.visible=p>.12&&p<.85;}else{const lean=Math.sin(p*Math.PI);c.body.rotation.x=lean*.24;c.body.position.z=lean*.18;c.body.position.y=-lean*.08;}if(p>.43&&p<.72)c.eyes.scale.y=.6;
 }else if(a.spoon)a.spoon.root.visible=false;
 if(time>=15)c.eyes.scale.y=.7;const b=model.bowls.find(b=>b.i===a.i);if(b){b.soup.position.y=.29-Math.min(1,u/13.5)*.15;b.steam.visible=time<15;}c.updateHandArm?.();}
 }
 bar.addEventListener('click',e=>{const a=e.target.closest('[data-wharf]')?.dataset.wharf;if(!a)return;if(a.startsWith('friend:')&&!meal){const i=+a.split(':')[1];selected.has(i)?selected.delete(i):selected.add(i);refresh();}else if(a==='order')order();else if(a==='finish')finish();else if(a==='photo')H.photo();else if(['wharf','bakery','seaLions','chowder'].includes(a))H.go(a);});
 addEventListener('keydown',e=>{if(e.key==='Escape')finish();});
 return {refresh,view,update,busy:()=>!!meal,leave:()=>finish(false),handleRay(ray){if(meal||H.busy())return false;const h=ray.intersectObjects(model.picks,false)[0];if(!h)return false;if(h.object.userData.seaLion!==undefined){H.go('seaLions');return true;}const id=h.object.userData.wharf;if(id==='bakery'&&H.location().space!=='bakery')H.approach(id);else H.go(id);return true;}};
}
