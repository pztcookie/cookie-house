// Placement is a free point on a supporting surface, not a fixed decoration slot.
export const TOY_IDS = ['plush', 'plushMint', 'plushLilac'];
export const SURFACES = [
  {id:'bedFloor',room:'bed',y:3.305,r:[-1.7,6,-3.7,2.2],blocks:[[-2,-.15,-4,-.55],[-.1,.85,-4,-3.1],[1,6.4,-4,-3.08],[3.8,5.2,.5,1.85],[.8,2,.8,1.8]]},
  {id:'bed',room:'bed',y:4.14,r:[-1.78,-.31,-1.95,-.65]},
  {id:'livingFloor',room:'living',y:.03,r:[3.3,7.15,-3.7,2.4],blocks:[[3.55,6.0,-4,-3],[4.22,5.4,-2.7,-1.5],[3.8,6.3,-.3,2.1],[6.7,7.4,-3.85,-3],[3.2,4,1.5,2.5]]},
  {id:'sofa',room:'living',y:.49,r:[3.83,5.75,-3.55,-3.13]},
  {id:'piano',room:'living',y:1.215,r:[4.26,5.74,.20,.80],blocks:[[4.7,5.3,.3,.78]]},
  {id:'craftFloor',room:'craft',y:.03,r:[-6.7,-2.45,-3.7,.78],blocks:[[-7,-3.85,-4,-3.04],[-2.9,-2,-4,-2.1],[-5.62,-4.78,-3,-2.15],[-6.86,-5.63,-.95,.35],[-5.3,-4.4,-.65,.3],[-3.2,-2.4,.15,1]]},
  {id:'readingSeat',room:'craft',y:.56,r:[-6.4,-5.82,-.61,.0]},
  {id:'craftDesk',room:'craft',y:.795,r:[-6.85,-3.96,-3.9,-3.12],blocks:[[-6.85,-5.6,-3.92,-3.4],[-5.1,-4.18,-3.9,-3.32]]},
];
const inside=(r,x,z,pad=0)=>x>=r[0]+pad&&x<=r[1]-pad&&z>=r[2]+pad&&z<=r[3]-pad;
export function validPlacement(p,placements={},ignoreId='') {
  if(!p || !Number.isFinite(p.x)||!Number.isFinite(p.z)||!Number.isFinite(p.rotation))return false;
  const s=SURFACES.find(s=>s.id===p.surface);if(!s||!inside(s.r,p.x,p.z,.15))return false;
  if(s.blocks?.some(r=>inside(r,p.x,p.z,-.24)))return false;
  return !Object.entries(placements).some(([id,q])=>id!==ignoreId&&q&&Math.abs((SURFACES.find(s=>s.id===q.surface)?.y??-100)-s.y)<.6&&Math.hypot(q.x-p.x,q.z-p.z)<.53);
}
export function normalizeToys(raw,owned) {
  const out={};for(const id of TOY_IDS){if(!owned.has(id))continue;
    const p=raw?.[id];
    if(p===null){out[id]=null;continue;}
    if(validPlacement(p,out,id))out[id]={surface:p.surface,x:p.x,z:p.z,rotation:p.rotation};
    else if(id==='plush'&&p===undefined)out[id]={surface:'bed',x:-1.25,z:-1.35,rotation:.3};
    else out[id]=null;
  }return out;
}
export function placeToy(store,id,placement,save) {
  if(!TOY_IDS.includes(id)||!store.bought.has(id))return 'unowned';
  if(placement!==null&&!validPlacement(placement,store.toys,id))return 'invalid';
  const before=store.toys[id];store.toys[id]=placement?{...placement}:null;
  if(!save()){if(before===undefined)delete store.toys[id];else store.toys[id]=before;return 'save';}
  return 'ok';
}
