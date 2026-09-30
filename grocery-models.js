import { FOODS } from './grocery-ledger.js';

export function buildGroceryModels(H) {
  const {THREE,JT,house,B,sph,cyl,stick,mesh,CL,V,canvasTex,signPlane,register}=H;
  const root=new THREE.Group();root.name='Department food hall';JT.add(root);
  const blue='#9fbfc6',cream='#fff1d8',wood='#ddbb91',pink='#eeb0b8';
  const templates=new Map(),hits=[],aisles=new Map();
  function label(id,color){return canvasTex(256,256,c=>{
    c.fillStyle=cream;c.fillRect(0,0,256,256);c.fillStyle=color;c.fillRect(0,161,256,95);
    for(let i=0;i<6;i++){c.beginPath();c.arc(i*52,158,25,0,Math.PI*2);c.fill();}
    c.fillStyle='#fffaf0';c.beginPath();c.ellipse(128,100,65,51,0,0,Math.PI*2);c.fill();
    for(const x of[76,176]){c.beginPath();c.ellipse(x,58,19,32,x===76?-.4:.4,0,Math.PI*2);c.fill();}
    c.fillStyle='#625b51';for(const x of[107,149]){c.beginPath();c.arc(x,94,5,0,Math.PI*2);c.fill();}
    c.beginPath();c.ellipse(128,111,7,5,0,0,7);c.fill();
    c.font='bold 23px Nunito,sans-serif';c.textAlign='center';c.fillText(id.toUpperCase(),128,212);
    for(let i=0;i<17;i++){c.fillStyle='#82735b';c.fillRect(42+i*10,233,2+i%2,14);}
  });}
  function product(id){
    if(templates.has(id))return templates.get(id).clone(true);
    const f=FOODS.find(it=>it.id===id),g=new THREE.Group();g.name=id;
    if(id==='milk'||id==='juice'){
      B(g,.32,.45,.25,cream,0,0,0,.025);B(g,.32,.09,.25,f.color,0,.44,0,.02);
      const top=B(g,.30,.09,.18,cream,0,.53,0,.01);top.rotation.x=.22;
      cyl(g,.038,.038,.04,f.color,.07,.63,0,12);signPlane(g,label(id,f.color),.29,.40,0,.245,.132);
    }else if(id==='onigiri'||id==='sandwich'){
      const shape=new THREE.Shape([new THREE.Vector2(-.23,0),new THREE.Vector2(.23,0),new THREE.Vector2(0,.39)]);
      mesh(new THREE.ExtrudeGeometry(shape,{depth:.20,bevelEnabled:true,bevelSize:.025,bevelThickness:.02,bevelSegments:2}),cream,g,0,.025,-.1);
      if(id==='onigiri'){B(g,.19,.27,.012,'#4d5b50',0,.02,.135,.025);signPlane(g,label(id,f.color),.14,.14,0,.14,.148);}
      else {for(let i=0;i<3;i++)B(g,.34-i*.055,.055,.035,['#aad09b','#e69e84','#eed99b'][i],0,.045+i*.066,.136,.018);}
    }else if(id==='tomato'){
      B(g,.42,.07,.32,cream,0,0,0,.03);
      for(let i=0;i<3;i++){const x=(i%2-.5)*.18,z=(i<2?-.065:.075);sph(g,.11,'#e5826e',x,.16,z);for(let k=0;k<5;k++){const leaf=sph(g,.033,'#76a27e',x+Math.cos(k*1.25)*.04,.264,z+Math.sin(k*1.25)*.04,1.8,.25,.7,8);leaf.rotation.y=-k*1.25;}}
    }else if(id==='leek'){
      for(let i=0;i<3;i++) {const p=new THREE.Group();p.rotation.z=(i-1)*.1;p.position.x=(i-1)*.07;g.add(p);cyl(p,.027,.038,.33,'#e0e5b1',0,0,0,10);for(let k=0;k<3;k++){const leaf=B(p,.036,.32,.018,['#6eaa79','#9bc285','#4f8f65'][k],(k-1)*.023,.28,0,.007);leaf.rotation.z=(k-1)*.18;}}
      B(g,.24,.06,.09,'#e7bb7d',0,.21,0,.015);
    }else if(id==='salmon'){
      B(g,.51,.055,.32,'#657c7b',0,0,0,.05);B(g,.42,.06,.25,'#eda68d',0,.05,0,.05);
      for(let i=0;i<6;i++){const stripe=B(g,.012,.008,.23,'#ffdec1',-.165+i*.064,.11,0,.003);stripe.rotation.y=-.45;}
      B(g,.48,.009,.06,cream,0,.117,.09,.003);
    }else if(id==='eggs'){
      B(g,.44,.075,.30,'#cfbf9e',0,0,0,.055);for(let i=0;i<6;i++)sph(g,.063,'#fff3d6',(i%3-1)*.125,.105,(Math.floor(i/3)-.5)*.125,1,1.35,1,12);
    }else if(id==='pudding'){
      cyl(g,.12,.15,.21,'#f2d69b',0,0,0,20);cyl(g,.12,.12,.035,'#b87e57',0,.21,0,20);sph(g,.075,'#fff3dc',0,.28,0,1,.65,1);sph(g,.034,'#df826f',0,.33,0);
    }else if(id==='roll'){
      B(g,.45,.04,.30,cream,0,0,0,.025);const cake=cyl(g,.135,.135,.30,'#deb17a',0,.04,0,24);cake.rotation.z=Math.PI/2;cake.position.y=.17;
      const t=mesh(new THREE.TorusGeometry(.077,.026,8,24),'#fff1d4',g,.156,.17,0);t.rotation.y=Math.PI/2;
      sph(g,.036,'#deb17a',.174,.17,0,.15,1,1);
    }
    g.traverse(o=>{if(o.isMesh)o.castShadow=true;});templates.set(id,g);return g.clone(true);
  }
  // Blue cabinetry, wood shelves and tall illustrated packages at eye height.
  for(const [a,x,color]of[['drinks',32.5,'#b8d1c6'],['deli',36,'#edbeb1'],['fresh',39.5,'#a9c6b0']]){
    const light=new THREE.PointLight('#fff0d9',5.2,5.2,1.6);light.position.set(x,2.8,-6.2);root.add(light);
    const g=new THREE.Group();g.position.set(x,0,-7.55);root.add(g);aisles.set(a,{x,root:g});
    B(g,3.1,2.62,.12,cream,0,.10,-.33,.04);
    for(const sx of[-1.57,1.57])B(g,.10,2.68,.88,blue,sx,.08,0,.025);
    B(g,3.22,.20,.94,blue,0,.03,0,.03);
    for(const y of[.30,1.06,1.82,2.66]){B(g,3.18,.09,.93,wood,0,y,0,.02);B(g,3.19,.11,.045,color,0,y,.48,.012);}
    const foods=FOODS.filter(it=>it.aisle===a);
    for(let row=0;row<3;row++)for(let col=0;col<5;col++){
      const f=foods[(row*2+col)%foods.length],p=product(f.id);p.position.set(-1.22+col*.59,.39+row*.76,.07);p.scale.setScalar(.78);g.add(p);
      p.traverse(o=>{if(o.isMesh){o.userData.grocery=f.id;hits.push(o);}});
      if(row===1){const tag=signPlane(g,label(f.id,color),.20,.20,-1.22+col*.59,1.075,.514);tag.userData.grocery=f.id;hits.push(tag);}
    }
    const hit=new THREE.Mesh(new THREE.BoxGeometry(3.2,2.8,1),new THREE.MeshBasicMaterial({visible:false}));hit.position.set(0,1.4,0);hit.userData.aisle=a;g.add(hit);hits.push(hit);
  }
  // Food hall checkout and basket stand stay below the second-floor ceiling.
  B(root,1.50,1.0,1.02,blue,42.1,.06,-4.3,.07);B(root,1.65,.11,1.15,wood,42.1,1.06,-4.3,.04);
  const checkout=register(root,42.2,1.17,-4.35);checkout.traverse(o=>{if(o.isMesh){o.userData.groceryCheckout=true;hits.push(o);}});
  B(root,2.75,.15,1.98,wood,35.55,.80,-4.65,.065);
  for(const x of[34.40,36.70])for(const z of[-5.35,-3.95])B(root,.09,.80,.09,blue,x,0,z,.02);
  const basket=new THREE.Group();basket.position.set(35.55,.96,-4.65);root.add(basket);
  B(basket,2.25,.035,1.62,'#f5d2ce',0,0,0,.08);
  for(const y of[.06,.20,.35,.49]){
    for(const z of[-.84,.84])B(basket,2.36,.026,.03,pink,0,y,z,.01);
    for(const x of[-1.18,1.18])B(basket,.03,.026,1.71,pink,x,y,0,.01);
  }
  for(let i=0;i<14;i++)for(const z of[-.84,.84])B(basket,.026,.49,.028,pink,-1.15+i*.176,.015,z,.01);
  for(let i=0;i<10;i++)for(const x of[-1.18,1.18])B(basket,.028,.49,.026,pink,x,.015,-.80+i*.18,.01);
  for(const x of[-1.18,1.18]){stick(basket,V(x,.46,-.52),V(x,.83,-.36),.025,'#d68e9d');stick(basket,V(x,.83,-.36),V(x,.83,.36),.027,'#d68e9d');stick(basket,V(x,.83,.36),V(x,.46,.52),.025,'#d68e9d');}
  const basketItems=new THREE.Group();basket.add(basketItems);
  const basketHit=new THREE.Mesh(new THREE.BoxGeometry(2.5,.9,1.8),new THREE.MeshBasicMaterial({visible:false}));basketHit.position.y=.40;basketHit.userData.groceryBasket=true;basket.add(basketHit);hits.push(basketHit);
  // Hollow kitchen fridge with a hinged door and visible food shelves.
  const fridge=new THREE.Group();fridge.position.set(2.8,.02,-3.6);house.add(fridge);
  B(fridge,.82,1.95,.07,'#cfe7fb',0,0,-.33,.055);
  for(const x of[-.38,.38])B(fridge,.065,1.95,.69,'#cfe7fb',x,0,0,.025);
  for(const y of[0,1.88])B(fridge,.82,.07,.69,'#cfe7fb',0,y,0,.025);
  B(fridge,.67,1.80,.02,'#f4f7ed',0,.075,-.281,.015);
  for(const y of[.12,.56,1.01,1.46])B(fridge,.70,.027,.59,'#dae8df',0,y,.015,.01);
  const door=new THREE.Group();door.position.set(.41,0,.36);fridge.add(door);
  B(door,.82,1.93,.075,'#cfe7fb',-.41,0,0,.10);B(door,.76,.02,.014,'#a3c9e1',-.41,.95,.045,.005);
  for(const y of[.55,1.15])B(door,.05,.30,.06,'#f2f6f6',-.70,y,.07,.018);
  const magnet=sph(door,.068,'#e6abba',-.30,1.50,.07,1,1,.18,12);
  const fridgePick=[];fridge.traverse(o=>{if(o.isMesh){o.userData.fridge=true;fridgePick.push(o);}});
  const fridgeItems=new THREE.Group();fridge.add(fridgeItems);
  const fridgeLight=new THREE.PointLight('#eff9ff',1.1,2.0,1.5);fridgeLight.position.set(0,1.72,.12);fridge.add(fridgeLight);
  let open=false;
  return {root,hits,fridgePick,product,
    setOpen(v){open=v;},
    update(dt){door.rotation.y+=( (open?1.86:0)-door.rotation.y)*Math.min(1,dt*7);},
    setBasket(counts){
      basketItems.clear();let i=0;
      for(const f of FOODS){if(!counts[f.id])continue;for(let n=0;n<Math.min(3,counts[f.id]);n++){const p=product(f.id);p.position.set(-.85+(i%4)*.57+n*.045,.05+n*.032,-.53+Math.floor(i/4)*.52+n*.065);p.scale.setScalar(.85);p.rotation.y=(i%3-1)*.11+n*.11;basketItems.add(p);}i++;}
    },
    setFridge(counts){
      fridgeItems.clear();let i=0;
      for(const f of FOODS){if(!counts[f.id])continue;const p=product(f.id);p.position.set((i%3-1)*.225,1.49-Math.floor(i/3)*.447,.065);p.scale.setScalar(.44);fridgeItems.add(p);i++;}
    },
    view(what,portrait){
      if(what==='basket')return {target:V(35.55,1.14,-4.65),pos:V(35.70,2.84,-2.77),fov:portrait?108:49};
      if(what==='fridge')return {target:V(2.80,1.02,-3.55),pos:V(2.76,1.47,-.48),fov:portrait?54:39};
      if(what==='floor2')return {target:V(36.0,4.25,-6.1),pos:V(36.0,5.8,-.8),fov:portrait?108:75};
      if(aisles.has(what)){const x=aisles.get(what).x;return {target:V(x,1.35,-7.36),pos:V(x,1.50,-4.68),fov:portrait?99:72};}
      return {target:V(36.0,1.30,-7.05),pos:V(36.0,2.50,-2.62),fov:portrait?106:96};
    }
  };
}
