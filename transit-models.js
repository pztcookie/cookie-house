import {STOPS,STATIONS,COAST_TRACK,WHARF_TRACK} from './transit-state.js';
export function buildTransitExtension(H){
 const {THREE,scene,B,cyl,sph,mesh,stick,V,CL,lsign,signPlane,kioskPick,kioskLabels,walkSurf}=H;
 const roots=[];
 for(const index of [2,3,4]){
  const st=STOPS[index],g=new THREE.Group();g.position.set(st.x,st.y,st.z);g.rotation.y=st.yaw;g.name=st.space;scene.add(g);roots.push(g);
  B(g,3.8,.6,5.5,'#d7eafc',0,-.6,0,.12);B(g,3.7,.03,.22,'#f8e6a0',0,0,-2.55,.01);
  const floor=mesh(new THREE.PlaneGeometry(3.6,5.3),CL('#e9e3f1'),g,0,.003,0);floor.rotation.x=-Math.PI/2;walkSurf.push(floor);
  cyl(g,.05,.05,2.5,'#3e5a7c',-1.5,0,2.35,8);
  signPlane(g,lsign(STATIONS[st.station].key,'#bfe0f8','#2f4b6e',512,160,56),2.1,.65,0,2.5,2.36);
  const k=new THREE.Group();k.position.set(1.1,0,.4);g.add(k);
  B(k,.72,1.45,.5,'#bfeadb',0,0,0,.12);B(k,.5,.36,.035,'#dff4ff',0,.92,.26,.02);
  B(k,.3,.05,.03,'#5a6c9c',0,.62,.26,.01);B(k,.8,.28,.58,'#f6c7da',0,1.45,0,.1);
  for(let i=0;i<3;i++)sph(k,.045,['#f6c7da','#f8e6a0','#bfe0f8'][i],-.15+i*.15,.78,.26,1,1,.5,10);
  signPlane(k,lsign('sign_ticket','#fff','#2f6b5a',256,96,56),.62,.23,0,1.59,.30);
  const lab=new THREE.Sprite(new THREE.SpriteMaterial({map:lsign('buyTicket','#5aaeea','#fff',256,96,54),transparent:true,depthWrite:false}));lab.position.set(1.1,2.1,.4);lab.scale.set(1.1,.4,1);g.add(lab);lab.userData.station=st.station;lab.userData.baseY=2.1;kioskLabels.push(lab);kioskPick.push(lab);
  g.traverse(o=>{if(o.isMesh){o.userData.station=st.station;kioskPick.push(o);}});
  B(g,1.2,.09,.42,'#e7cfb0',-.6,.43,1.7,.03);for(const x of [-1.05,-.15])B(g,.08,.43,.38,'#fff',x,0,1.7,.02);
 }
 // A paved way around the outside of Chinatown joins the existing gateway plaza.
 B(scene,4.4,.6,25.4,'#e4cfc0',-43,-.6,.8,.06);
 // Extend the overlook under the new Golden Gate platform.
 B(scene,5.2,7.55,6.8,'#b6c5ab',-62.7,-.61,-49.2,.25);
 B(scene,3.8,.08,.9,'#e2dac7',-62.7,6.86,-52.0,.025);
 function track(route){
 const curve=new THREE.CatmullRomCurve3(route.map(p=>V(...p)),false,'centripetal');
 const points=curve.getSpacedPoints(96),verts=[],indices=[];
 for(let i=0;i<points.length;i++){
  const p=points[i],t=curve.getTangentAt(i/(points.length-1)),side=V(-t.z,0,t.x).normalize();
  for(const s of [-1,1])verts.push(p.x+side.x*1.8*s,p.y-.012,p.z+side.z*1.8*s);
  if(i<points.length-1){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}
  if(i%8===0&&p.y>-.3)B(scene,.3,p.y+.6,.3,'#b9c3ba',p.x,-.6,p.z,.035);
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();const mat=CL('#d3caf1').clone();mat.side=THREE.DoubleSide;mesh(geo,mat,scene);
 for(const s of [-1,1]){const rail=points.map((p,i)=>{const t=curve.getTangentAt(i/(points.length-1));return p.clone().add(V(-t.z,0,t.x).normalize().multiplyScalar(.55*s)).add(V(0,.04,0));});mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rail),128,.045,6,false),'#8e97b8',scene);}
 return curve;
 }
 return {curve:track(COAST_TRACK),wharfCurve:track(WHARF_TRACK),roots};
}
