import {TOY_IDS,SURFACES,normalizeToys,validPlacement,placeToy} from './toy-state.js';
import {toyIcon} from './toy-models.js?v=20260929-food1';
const COPY={
zh:{title:'玩偶收纳箱',empty:'去百货商店二楼，挑一只食物玩偶吧。',stored:'在收纳箱',placed:'已摆放',take:'拿出来摆',put:'收进箱子',rotate:'转个方向',done:'布置好了',cancel:'取消移动',hint:'拖动玩偶自由摆放；也可以点地面或家具表面，再按「放这里」。',invalid:'这里放不稳，换个位置吧。',save:'这次没能保存，已保留原来的位置。',bed:'卧室',living:'客厅',craft:'阅读区',shop:'去挑玩偶',place:'放这里',arrange:'布置玩偶',names:['曲奇饼干','草莓啵啵','吐司软软']},
en:{title:'Toy chest',empty:'Choose a little food plush on the department store’s second floor.',stored:'In the chest',placed:'On display',take:'Take out',put:'Put in chest',rotate:'Turn around',done:'All arranged',cancel:'Cancel move',hint:'Drag your toy freely, or tap a floor or furniture surface, then choose “Place here”.',invalid:'Try a clear, steady spot.',save:'Could not save. The previous spot is safe.',bed:'Bedroom',living:'Living room',craft:'Reading room',shop:'Shop for toys',place:'Place here',arrange:'Arrange toys',names:['Cookie Crumb','Strawberry Sprout','Toastie']},
ja:{title:'ぬいぐるみ箱',empty:'デパート2階で食べもののぬいぐるみを選ぼう。',stored:'箱の中',placed:'飾っています',take:'取り出す',put:'箱にしまう',rotate:'向きを変える',done:'できあがり',cancel:'移動を取り消す',hint:'ドラッグで自由に配置。床や家具の上をタップして「ここに置く」でもOK。',invalid:'安定した空いている場所に置こう。',save:'保存できなかったので、前の場所に戻しました。',bed:'寝室',living:'リビング',craft:'読書コーナー',shop:'お店へ',place:'ここに置く',arrange:'ぬいぐるみを飾る',names:['クッキークラム','いちごちゃん','トースティー']}
};
export function createToyCollection(H){
 const {THREE,store,items,scene,controls}=H,$=s=>document.querySelector(s),tr=k=>(COPY[H.lang()]||COPY.zh)[k];
 store.toys=normalizeToys(store.toys,store.bought);
 let expanded=false,selected=null,ghost=null,drag=null;
 const objects=TOY_IDS.map(id=>items.find(it=>it.id===id));
 const box=new THREE.Group();box.position.set(1.4,3.305,1.3);scene.add(box);
 H.B(box,1.05,.46,.66,'#b0d7cb',0,0,0,.08);H.B(box,1.1,.07,.7,'#f4d2a2',0,.46,0,.04);
 H.B(box,.30,.10,.04,'#fff7e9',0,.18,.35,.03);H.sph(box,.075,'#e4a98e',0,.54,0,1,.55,1);
 const boxPick=[];box.traverse(m=>{if(m.isMesh)boxPick.push(m);});
 const ring=new THREE.Mesh(new THREE.RingGeometry(.28,.31,40),new THREE.MeshBasicMaterial({color:'#64bda1',side:THREE.DoubleSide,depthTest:false,transparent:true,opacity:.85}));ring.rotation.x=-Math.PI/2;ring.renderOrder=9;ring.visible=false;scene.add(ring);
 const bar=document.createElement('section');bar.id='toyBar';bar.className='panel';bar.hidden=true;$('#bottom').prepend(bar);
 function sync(){objects.forEach(it=>{const p=store.toys[it.id];it.homeObj.visible=store.bought.has(it.id)&&!!p;if(p){const s=SURFACES.find(s=>s.id===p.surface);it.homeObj.position.set(p.x,s.y,p.z);it.homeObj.rotation.y=p.rotation;it.homeObj.scale.setScalar(1);}});ring.visible=false;}
 function refresh(){const loc=H.location();bar.hidden=!['all','bed','living','craft'].includes(loc.space)||loc.mode!=='orbit';if(bar.hidden){cancel(false);return;}
  bar.innerHTML=`<div class="toy-heading"><button class="chip ${expanded?'on':''}" data-toy="toggle">${tr('title')} · ${TOY_IDS.filter(id=>store.bought.has(id)).length}</button>${expanded?`<button class="chip" data-toy="done">${tr('done')}</button>`:''}</div>${expanded?`<div class="toy-list">${objects.filter(it=>store.bought.has(it.id)).map(it=>{const i=TOY_IDS.indexOf(it.id);return `<button class="toy-card ${selected===it.id?'on':''}" data-toy="select:${it.id}" aria-pressed="${selected===it.id}">${toyIcon(i)}<span>${tr('names')[i]}<small>${store.toys[it.id]?tr('placed'):tr('stored')}</small></span></button>`;}).join('')||`<span>${tr('empty')}</span><button class="chip" data-toy="shop">${tr('shop')}</button>`}</div>${selected?`<p>${tr('hint')}</p><div class="toy-actions"><button class="chip" data-toy="rotate">↻ ${tr('rotate')}</button><button class="chip" data-toy="put">${tr('put')}</button><button class="chip main" data-toy="place" ${ghost?'':'disabled'}>${tr('place')}</button><button class="chip" data-toy="cancel">${tr('cancel')}</button></div><div class="toy-rooms">${['bed','living','craft'].map(r=>`<button class="chip ${loc.space===r?'on':''}" data-toy="room:${r}">${tr(r)}</button>`).join('')}</div>`:''}`:''}`;
 }
 function cancel(render=true){drag=null;controls.enabled=true;ghost=null;sync();if(render)refresh();}
 function reset(){cancel(false);selected=null;expanded=false;refresh();}
 function select(id){if(!store.bought.has(id))return;cancel(false);selected=id;expanded=true;const p=store.toys[id];const room=p?SURFACES.find(s=>s.id===p.surface).room:'bed';H.view(room);if(!p){const defaults={bed:[2,-1],living:[6.5,-1],craft:[-4,-1]};const [x,z]=defaults[room];preview({surface:room+'Floor',x,z,rotation:0});}refresh();}
 function preview(p){if(!validPlacement(p,store.toys,selected))return false;ghost=p;const it=objects.find(it=>it.id===selected),s=SURFACES.find(s=>s.id===p.surface);it.homeObj.visible=true;it.homeObj.position.set(p.x,s.y+.015,p.z);it.homeObj.rotation.y=p.rotation;ring.visible=true;ring.position.set(p.x,s.y+.025,p.z);return true;}
 function fromRay(ray){const room=H.location().space,ps=SURFACES.filter(s=>s.room===room),hits=[];
  for(const s of ps){const v=ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-s.y),new THREE.Vector3());if(v&&v.x>=s.r[0]&&v.x<=s.r[1]&&v.z>=s.r[2]&&v.z<=s.r[3])hits.push({s,v,d:ray.ray.origin.distanceTo(v)});}
  hits.sort((a,b)=>a.d-b.d);if(!hits.length)return false;const {s,v}=hits[0],p={surface:s.id,x:Math.round(v.x*100)/100,z:Math.round(v.z*100)/100,rotation:ghost?.rotation??store.toys[selected]?.rotation??0};return preview(p);
 }
 function commit(){if(!ghost)return;const result=placeToy(store,selected,ghost,H.save);if(result!=='ok')H.toast(tr(result==='save'?'save':'invalid'));cancel();}
 function pick(ray){const visible=objects.filter(it=>it.homeObj.visible&&store.bought.has(it.id));const hits=ray.intersectObjects(visible.map(it=>it.homeObj),true);if(!hits.length)return null;return visible.find(it=>{let o=hits[0].object;while(o){if(o===it.homeObj)return true;o=o.parent;}return false;})?.id;}
 function down(e,ray){if(bar.hidden||H.busy())return false;
  const id=pick(ray);if(!id){if(ray.intersectObjects(boxPick,false).length){expanded=true;H.view('bed');refresh();return true;}if(!selected||!expanded)return false;}
  if(id){if(H.location().space==='all'){select(id);return true;}selected=id;expanded=true;}
  controls.enabled=false;drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,valid:false};e.target.setPointerCapture(e.pointerId);refresh();return true;
 }
 function move(e,ray){if(!drag||drag.id!==e.pointerId)return false;drag.moved ||= Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>4;if(drag.moved){drag.valid=fromRay(ray);ring.material.color.set(drag.valid?'#64bda1':'#e07b88');}return true;}
 function up(e,ray){if(!drag||drag.id!==e.pointerId)return false;const d=drag;drag=null;controls.enabled=true;if(e.type==='pointercancel')cancel();else if(d.moved){if(d.valid)commit();else{cancel();H.toast(tr('invalid'));}}else{fromRay(ray);refresh();}return true;}
 bar.addEventListener('click',e=>{const b=e.target.closest('[data-toy]');if(!b||b.disabled)return;const a=b.dataset.toy;
  if(a==='toggle'){expanded=!expanded;if(!expanded){cancel(false);selected=null;}refresh();}
  else if(a==='done')reset();else if(a==='shop')H.shop();else if(a.startsWith('select:'))select(a.slice(7));
  else if(a==='put'){const r=placeToy(store,selected,null,H.save);if(r!=='ok')H.toast(tr('save'));cancel();}
  else if(a==='rotate'){const p=ghost||store.toys[selected];if(p){preview({...p,rotation:p.rotation+Math.PI/4});refresh();}}
  else if(a==='place')commit();else if(a==='cancel')cancel();
  else if(a.startsWith('room:')){cancel(false);H.view(a.slice(5));refresh();}
 });
 addEventListener('keydown',e=>{if(e.key==='Escape')reset();});addEventListener('blur',()=>cancel(false));
 sync();return {refresh,leave:reset,down,move,up,pick,box,received(){store.toys=normalizeToys(store.toys,store.bought);sync();refresh();}};
}
