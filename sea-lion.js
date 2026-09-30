// Soft puppet-like sea lions. Head and torso are one continuous surface;
// expressions and the whole body move together, so there is no neck joint to split.
export function createSeaLion(H,{color='#b99576',chef=false,seed=0}={}){
 const {THREE,sph,cyl,mesh,stick,V}=H;
 const root=new THREE.Group(),body=new THREE.Group();root.add(body);
 const group=(parent,x=0,y=0,z=0)=>{const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;};
 const material=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.96,metalness:0});
 const fur=material(color),cream=material('#eed8b6'),nose=material('#59443e'),navy=material('#294966'),white=material('#fff5dc'),gold=material('#e7bb69');
 // Fine felt grain changes the light, not the silhouette: no spikes or tufts.
 const grain=new Uint8Array(64*64*4);let n=731;
 for(let i=0;i<grain.length;i+=4){n=(n*1664525+1013904223)>>>0;const k=118+(n%36);grain[i]=grain[i+1]=grain[i+2]=k;grain[i+3]=255;}
 const bump=new THREE.DataTexture(grain,64,64);bump.wrapS=bump.wrapT=THREE.RepeatWrapping;bump.repeat.set(7,5);bump.needsUpdate=true;
 for(const m of [fur,navy,cream]){m.bumpMap=bump;m.bumpScale=.009;}
 const profile=new THREE.CatmullRomCurve3([[0,0],[.42,.04],[.69,.26],[.73,.61],[.67,1.02],[.59,1.43],[.54,1.70],[.38,1.94],[0,2.075]].map(([r,y])=>V(r,y,0)),false,'centripetal');
 const outline=profile.getPoints(80).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y));
 function shell(points,extra=0){const g=new THREE.LatheGeometry(points,56),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const y=p.getY(i),u=THREE.MathUtils.smoothstep(y,.2,1.6);p.setX(i,p.getX(i)*(1+extra));p.setZ(i,p.getZ(i)*(.94-.12*u)*(1+extra)-.13+.25*u);}
  g.computeVertexNormals();return g;
 }
 const silhouette=mesh(shell(outline),fur,body);silhouette.name='continuous sea lion head and body';
 const tail=group(root,0,.09,-.63);
 for(const side of [-1,1]){const f=sph(tail,.30,fur,side*.19,0,-.17,.90,.22,1.40,24);f.rotation.y=-side*.32;}
 const flippers=[];
 for(const side of [-1,1]){
  const joint=group(body,side*.49,.76,.03);joint.rotation.z=side*.12;
  const fin=sph(joint,.34,fur,side*.29,-.20,.15,1.22,1.16,.26,28);fin.rotation.z=side*.48;flippers.push(joint);
  // Small folded ears remain tucked into the rounded head.
  const ear=sph(body,.14,fur,side*.51,1.58,.18,.60,1,.70,24);ear.rotation.z=-side*.22;
 }
 const face=group(body);
 // A broad open felt smile, cream cheek pads and a single button nose.
 sph(face,.245,material('#56313b'),0,1.28,.65,1.17,.66,.23,32);
 sph(face,.112,material('#d78388'),.02,1.20,.698,1.16,.36,.16,24);
 for(const side of [-1,1]){
  sph(face,.225,cream,side*.165,1.44,.665,1,.61,.51,32);
  sph(face,.078,material('#d29b8b'),side*.38,1.40,.565,1,.52,.22,20);
  // Two soft embroidered whiskers per cheek, rather than protruding bristles.
  for(let j=0;j<2;j++){
   const points=[V(side*.23,1.45-j*.08,.776),V(side*.35,1.44-j*.08,.739),V(side*.43,1.46-j*.09,.653)];
   mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),10,.009,5,false),nose,face);
  }
 }
 sph(face,.108,nose,0,1.515,.80,1.12,.68,.77,28);
 const eyes=group(face,0,1.755,.585);
 for(const side of [-1,1]){
  const eye=group(eyes,side*.205,side===1?.018:0,0);eye.rotation.z=-side*.07;
  sph(eye,.192,white,0,0,0,1,1.12,.80,32);
  sph(eye,.098,nose,-side*.023,-.012,.150,1,1.12,.44,28);
  sph(eye,.025,'#fffdf2',-side*.023-.021,.024,.191,1,1,.36,16);
 }
 let hat=null,ladle=null;
 if(chef){
  const coatPoints=outline.filter(p=>p.y<=1.18);coatPoints.push(new THREE.Vector2(.637,1.18));
  mesh(shell(coatPoints,.019),navy,body).name='navy sailor jacket';
  // White V collar and a little red sailor scarf sit on the jacket's surface.
  for(const side of [-1,1]){
   const a=V(side*.43,1.19,.56),b=V(0,.96,.657);
   stick(body,a,b,.070,white,16);stick(body,a.clone().add(V(0,.015,.064)),b.clone().add(V(0,.015,.064)),.018,navy,10);
   sph(body,.035,gold,side*.20,.78,.606,1,1,.45,16);
   sph(body,.035,gold,side*.20,.57,.564,1,1,.45,16);
   const cuff=sph(flippers[side===-1?0:1],.26,navy,side*.13,-.08,.08,1,1,.33,24);cuff.rotation.z=side*.3;
  }
  sph(body,.075,material('#cb6e65'),0,.975,.71,1,.85,.5,20);
  const scarf=mesh(new THREE.ConeGeometry(.075,.23,3),material('#cb6e65'),body,.045,.835,.666);scarf.rotation.z=.20;
  hat=group(body,0,2.01,.025);cyl(hat,.435,.43,.18,white,0,0,0,40);
  for(let j=0;j<5;j++){const a=j*Math.PI*2/5;sph(hat,.27,white,Math.sin(a)*.255,.34,Math.cos(a)*.225,1,1.18,1,28);}
  sph(hat,.31,white,0,.42,0,1.08,1.05,.96,28);
  // A short soup ladle attached to the fin stays connected while stirring.
  ladle=group(flippers[0],-.50,-.28,.30);
  stick(ladle,V(0,0,0),V(.20,-.20,.25),.025,'#c4ced0',12);
  sph(ladle,.13,'#c4ced0',.22,-.22,.29,1,.35,1.15,24);
 }
 let wave=0;
 function update(dt,t,welcoming=false){wave=Math.max(0,wave-dt);body.rotation.z=Math.sin(t*.8+seed)*.035;body.rotation.x=Math.sin(t*.62+seed)*.025;body.scale.y=1+Math.sin(t*1.2+seed)*.008;
  const blink=(t+seed*1.71)%4.9;eyes.scale.y=blink<.13?.22:1;
  flippers[0].rotation.z=-.12+(chef?Math.sin(t*2.4)*.11:Math.sin(t*.9+seed)*.05);
  flippers[1].rotation.z=.12+((wave>0||welcoming)?(.18+Math.sin(t*3.8)*.12):Math.sin(t*.8+seed)*.06);
 }
 return {root,body,eyes,flippers,hat,ladle,update,greet:()=>{wave=3.4;}};
}
