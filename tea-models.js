// Tea sets and dim sum share the cottage's native clay geometry and lighting.
export function buildTeaTables(H,indoor,lane){
 const {THREE,B,sph,cyl,stick,mesh,CL,V}=H,cream='#fff0d5',jade='#83aaa0',wood='#ba8d62',bamboo='#d6ad70',tables={},picks=[];
 const group=(parent,x=0,y=0,z=0)=>{const o=new THREE.Group();o.position.set(x,y,z);parent?.add(o);return o;};
 const ring=(parent,r,t,color,x,y,z)=>{const m=mesh(new THREE.TorusGeometry(r,t,8,32),color,parent,x,y,z);m.rotation.x=Math.PI/2;return m;};
 function plate(parent,r=.34){cyl(parent,r,r*.85,.035,cream,0,0,0,32);ring(parent,r*.94,.017,jade,0,.039,0);}
 function piece(id){const g=group(),food=group(g);
  if(['osmanthus','redbean'].includes(id)){
   const red=id==='redbean';B(food,.25,.13,.21,red?'#a75f59':'#f2d99b',0,0,0,.025);B(food,.25,.045,.21,red?'#bc7770':'#fff0c4',0,.09,0,.02);
   if(red)for(let i=0;i<5;i++)sph(food,.023,'#693f43',-.085+(i%3)*.08,.14,-.06+Math.floor(i/3)*.12,1,.4,.7,10);
   else for(let i=0;i<4;i++){const x=-.065+(i%2)*.13,z=-.045+Math.floor(i/2)*.09;for(let k=0;k<4;k++)sph(food,.013,'#e6b956',x+Math.cos(k*1.57)*.014,.142,z+Math.sin(k*1.57)*.014,1,.35,.65,8);}
  }else if(id==='almond'){
   cyl(food,.11,.14,.14,'#fff3d8',0,0,0,24);sph(food,.028,'#eab35a',.015,.15,.015,1.6,.28,.8,12);
  }else if(id==='tart'){
   cyl(food,.145,.10,.08,'#dba557',0,0,0,24);cyl(food,.124,.115,.045,'#f8d565',0,.058,0,24);for(let i=0;i<14;i++){const a=i*Math.PI/7;sph(food,.029,'#e6b872',Math.cos(a)*.13,.074,Math.sin(a)*.13,.78,1,.78,10);}sph(food,.065,'#f5bc42',0,.105,0,1,.09,1,14);
  }else if(id==='bun'){
   sph(food,.145,'#fff0cb',0,.13,0,1,.88,1,20);for(let i=0;i<6;i++){const a=i*Math.PI/3;stick(food,V(Math.cos(a)*.025,.25,Math.sin(a)*.025),V(Math.cos(a)*.07,.23,Math.sin(a)*.07),.008,'#e6ce9f',5);}sph(food,.034,'#eaba54',.036,.18,.119,1.05,.65,.40,12);
  }else{
   sph(food,.145,'#f4e5da',0,.105,0,1.2,.7,.7,20);sph(food,.09,'#eeb99a',0,.065,.067,1.05,.50,.28,14);for(let i=0;i<7;i++){const x=-.115+i*.038;const p=mesh(new THREE.TorusGeometry(.045,.012,6,12,Math.PI),'#fff1df',food,x,.125,0);p.rotation.y=Math.PI/2;}
  }return {root:g,food,tip:V(0,id==='bun'?.27:.15,0)};
 }
 function dish(id){const root=group(),steamer=['bun','dumpling'].includes(id),parts=[];
  if(steamer){cyl(root,.35,.35,.08,bamboo,0,0,0,28);for(let i=-3;i<=3;i++)B(root,.55,.014,.035,'#ecd0a0',0,.083,i*.072,.004);for(const y of [.10,.17])ring(root,.34,.032,bamboo,0,y,0);for(let i=0;i<20;i++){const a=i*Math.PI/10;stick(root,V(Math.cos(a)*.343,.085,Math.sin(a)*.343),V(Math.cos(a)*.343,.18,Math.sin(a)*.343),.016,'#e1bb84',5);}}
  else plate(root);
  for(const [x,z] of [[-.145,-.09],[.145,-.09],[0,.145]]){const p=piece(id);root.add(p.root);p.root.position.set(x,steamer?.095:.042,z);p.root.rotation.y=x*2;parts.push(p.root);}return {root,parts};
 }
 function cup(color='#bba36f'){const root=group();cyl(root,.098,.070,.12,'#dbe7d7',0,0,0,24);ring(root,.093,.014,cream,0,.12,0);const liquid=cyl(root,.079,.079,.008,color,0,.105,0,24);liquid.material=liquid.material.clone();const handle=mesh(new THREE.TorusGeometry(.047,.013,6,18),jade,root,.095,.063,0);return {root,liquid,tip:V(0,.13,0)};}
 function pot(parent){const root=group(parent);sph(root,.21,jade,0,.17,0,1,.78,1);cyl(root,.13,.14,.03,cream,0,.30,0,20);sph(root,.04,wood,0,.35,0);const sp=mesh(new THREE.CylinderGeometry(.033,.06,.29,12),jade,root,.25,.22,0);sp.rotation.z=-1.0;mesh(new THREE.TorusGeometry(.145,.026,8,24),wood,root,-.20,.17,0).rotation.y=Math.PI/2;return root;}
 function make(parent,id,x,y,z,ry=0){
  const root=group(parent,x,y,z);root.rotation.y=ry;const top=.86;
  cyl(root,1.05,1.05,.09,wood,0,top-.09,0,48);ring(root,1.015,.028,'#e2bc82',0,top,0);cyl(root,.19,.32,.77,'#608d80',0,0,0,20);
  cyl(root,.67,.67,.012,'#f3e5c7',0,top+.003,0,40);ring(root,.64,.011,jade,0,top+.016,0);
  const seatOffsets=[V(0,0,-1.35),V(-1.36,0,-.42),V(1.36,0,-.42)];
  for(const p of seatOffsets){cyl(root,.34,.34,.09,wood,p.x,.49,p.z,24);for(const dx of [-.18,.18])for(const dz of [-.18,.18])B(root,.07,.49,.07,'#658d7b',p.x+dx,0,p.z+dz);}
  const potRoot=pot(root);potRoot.position.set(.15,top,-.11);
  const cupRoots=seatOffsets.map((p,i)=>{const c=cup();root.add(c.root);const v=p.clone().normalize().multiplyScalar(i===0?.72:.78);c.root.position.set(v.x,top,v.z);c.root.rotation.y=Math.atan2(-p.x,-p.z);return c;});
  const dishes=group(root,0,top+.018,0),snacks=[],puffs=[];
  for(let i=0;i<6;i++){const puff=sph(root,.055,new THREE.MeshBasicMaterial({color:'#fff7e4',transparent:true,opacity:0,depthWrite:false}),.15,1.24,-.11,.65,1,.65,10);puffs.push(puff);}
  const stream=mesh(new THREE.CylinderGeometry(.013,.02,1,8),new THREE.MeshBasicMaterial({color:'#d9b772',transparent:true,opacity:.65}),root);stream.visible=false;
  const hit=mesh(new THREE.CylinderGeometry(1.05,1.05,.16,24),new THREE.MeshBasicMaterial({visible:false}),root,0,top,0);hit.userData.teaTable=id;picks.push(hit);root.traverse(o=>{if(o.isMesh&&!o.userData.teaTable){o.userData.teaTable=id;picks.push(o);}});
  const api={root,pot:potRoot,cups:cupRoots,top,seatOffsets,puffs,stream,dishes,snacks,warm:false,
   clear(){for(const d of snacks){d.root.removeFromParent();H.dispose?.(d.root);}snacks.length=0;},
   serve(ids){this.clear();const positions=ids.length===1?[[0,.27]]:ids.length===2?[[-.40,.24],[.40,.24]]:[[-.42,.28],[.42,.28],[0,-.21]];ids.forEach((id,i)=>{const d=dish(id);dishes.add(d.root);d.root.position.set(positions[i][0],0,positions[i][1]);snacks.push(d);});},
   world(p){root.updateWorldMatrix(true,false);return root.localToWorld(p.clone());},
   seat(i,character){const p=seatOffsets[i].clone();p.y=character===0?.47:.66;const yaw=Math.atan2(-p.x,-p.z)+ry+(id==='tea'?-Math.PI/2:0);return {point:this.world(p),yaw};},
   reset(){potRoot.position.set(.15,top,-.11);potRoot.rotation.set(0,0,0);stream.visible=false;cupRoots.forEach(c=>{c.root.visible=true;c.liquid.visible=true;c.liquid.position.y=.109;});}
  };tables[id]=api;return api;
 }
 make(indoor,'tea',0,.16,.65);
 // Two round tables share a little court at the open end of the lantern lane.
 const court=group(lane,0,0,-6.65);B(court,5.7,.065,4.2,'#dbccb0',0,.015,0,.06);
 make(court,'teaPatio',-1.25,.085,.40);const extra=make(court,'teaPatioSide',1.4,.085,-.80,.12);
 extra.serve(['tart','bun']);extra.root.scale.setScalar(.72);
 extra.root.traverse(m=>{if(m.isMesh)m.userData.teaTable='teaPatio';});
 // A brass-and-jade dim-sum trolley and its stacked bamboo baskets.
 const trolley=group(indoor,-2.08,.16,1.16);for(const x of [-.32,.32])for(const z of [-.24,.24]){cyl(trolley,.028,.028,.96,wood,x,.10,z,8);const w=mesh(new THREE.TorusGeometry(.08,.025,6,16),'#687970',trolley,x,.09,z);w.rotation.y=Math.PI/2;}
 for(const y of [.28,.75])B(trolley,.77,.055,.61,jade,0,y,0,.03);
 for(let i=0;i<3;i++){cyl(trolley,.225,.225,.10,bamboo,0,.80+i*.11,0,24);ring(trolley,.226,.018,'#ebc995',0,.90+i*.11,0);}const sample=dish('osmanthus');trolley.add(sample.root);sample.root.scale.setScalar(.56);sample.root.position.set(0,.33,0);
 return {tables,picks,piece,cup,dish,update(dt,t){for(const table of Object.values(tables)){table.puffs.forEach((p,i)=>{const u=(t*.33+i/6)%1;p.visible=table.warm;p.position.set(table.pot.position.x+Math.sin(t+i)*.035,table.top+.40+u*.52,table.pot.position.z+Math.cos(t+i)*.03);p.scale.set(.035+u*.025,.06+u*.05,.035+u*.025);p.material.opacity=table.warm?(1-u)*.18:0;});}}};
}
