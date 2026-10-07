// Rounded, closed sculptures; cached templates are cloned so runner cleanup is isolated.
let brainTemplate=null;
function sculptBrain(THREE,V){
 if(brainTemplate)return brainTemplate.clone();
 const samples=[];
 function fold(points,face){
  const curve=new THREE.CatmullRomCurve3(points.map(([u,v])=>V(u,v,0)));
  for(const p of curve.getPoints(64)){
   let u=p.x,v=p.y;const length=Math.hypot(u,v);if(length>.97){u*=.97/length;v*=.97/length;}
   const w=Math.sqrt(1-u*u-v*v);
   samples.push(face==='front'?V(u,v,w):face==='back'?V(-u,v,-w):face==='left'?V(-w,v,u):face==='right'?V(w,v,-u):V(u,w,v));
  }
 }
 const front=[
  [[-.40,.80],[-.51,.57],[-.46,.30],[-.61,.09],[-.63,-.17],[-.48,-.45]],
  [[-.73,.26],[-.43,.24],[-.23,.06],[-.29,-.19],[-.48,-.29]],
  [[.25,.86],[.38,.62],[.31,.37],[.46,.22]],
  [[.22,-.58],[.15,-.32],[.35,-.09],[.62,-.15],[.72,-.43]],
  [[-.12,-.85],[-.08,-.65],[-.21,-.47]],
  [[.71,.33],[.77,.07],[.84,-.10]]
 ];
 for(const face of ['front','back'])for(const path of front)fold(path,face);
 for(const face of ['left','right']){
  fold([[-.50,.54],[-.20,.61],[.06,.41],[.03,.14],[.25,-.04],[.46,.01]],face);
  fold([[-.59,-.11],[-.30,-.13],[-.17,-.36],[.08,-.50],[.29,-.39]],face);
  fold([[.37,.53],[.54,.31],[.47,.09]],face);
 }
 fold([[-.65,-.48],[-.53,-.18],[-.60,.13],[-.40,.43]],'top');
 fold([[.65,-.43],[.48,-.14],[.56,.18],[.41,.49]],'top');
 const geo=new THREE.SphereGeometry(1,160,112),pos=geo.attributes.position,colors=[];
 const base=new THREE.Color('#efb0d1'),shadow=new THREE.Color('#d489b1');
 for(let i=0;i<pos.count;i++){
  const n=V().fromBufferAttribute(pos,i).normalize();let nearest=Infinity;
  for(const p of samples){const dx=n.x-p.x,dy=n.y-p.y,dz=n.z-p.z;nearest=Math.min(nearest,dx*dx+dy*dy+dz*dz);}
  const groove=Math.exp(-nearest/.0020),bank=Math.exp(-nearest/.012);
  const split=Math.exp(-n.x*n.x/.0027)*THREE.MathUtils.smoothstep(n.y,-.70,-.20);
  const lobes=.038*Math.sin(n.x*6+n.z*1.4)*Math.sin(n.y*5-n.z*1.9)+.024*Math.cos(n.z*9+n.x*3);
  const r=1+lobes-.074*groove-.027*bank-.060*split;
  pos.setXYZ(i,n.x*.98*r,n.y*.81*r,n.z*.87*r);
  const color=base.clone().lerp(shadow,Math.min(.55,groove*.30+split*.25));colors.push(color.r,color.g,color.b);
 }
 geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();
 // Sphere seams share positions; weld their shading without adding another mesh shell.
 const normals=geo.attributes.normal;
 for(let y=0;y<=112;y++){const a=y*161,b=a+160,n=V().fromBufferAttribute(normals,a).add(V().fromBufferAttribute(normals,b)).normalize();normals.setXYZ(a,n.x,n.y,n.z);normals.setXYZ(b,n.x,n.y,n.z);}
 for(const y of [0,112]){const n=V();for(let x=0;x<=160;x++)n.add(V().fromBufferAttribute(normals,y*161+x));n.normalize();for(let x=0;x<=160;x++)normals.setXYZ(y*161+x,n.x,n.y,n.z);}
 geo.computeBoundingSphere();brainTemplate=geo;return geo.clone();
}
function sculptWing(THREE,V,shape){
 const edge=shape.getSpacedPoints(96).slice(0,-1),N=edge.length,R=20,positions=[],colors=[],indices=[];
 const blue=new THREE.Color('#8bbcff'),white=new THREE.Color('#eef6ff');
 for(const side of [1,-1])for(let j=0;j<=R;j++)for(let k=0;k<N;k++){
  const r=j/R,p=edge[k],x=.42+(p.x-.42)*r,y=.06+(p.y-.06)*r;
  positions.push(x,y,side*.25*Math.sqrt(Math.max(0,1-r*r)));
  const color=white.clone().lerp(blue,THREE.MathUtils.smoothstep(r,.78,.99)*(side>0?.88:.68));colors.push(color.r,color.g,color.b);
 }
 const stride=(R+1)*N;
 for(let side=0;side<2;side++)for(let j=0;j<R;j++)for(let k=0;k<N;k++){
  const a=side*stride+j*N+k,b=side*stride+j*N+(k+1)%N,c=a+N,d=b+N;
  if(side===0)indices.push(a,b,c,b,d,c);else indices.push(a,c,b,b,c,d);
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();
 // Front and back meet in a soft rim, not an extruded vertical edge.
 const normals=geo.attributes.normal;for(let k=0;k<N;k++){const a=R*N+k,b=stride+a,n=V().fromBufferAttribute(normals,a).add(V().fromBufferAttribute(normals,b)).normalize();normals.setXYZ(a,n.x,n.y,n.z);normals.setXYZ(b,n.x,n.y,n.z);}
 return geo;
}
export function createBrain(H,kind='witch') {
 const {THREE,mesh,sph,stick,V}=H, root=new THREE.Group(),body=new THREE.Group();root.add(body);
 const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.72});
 const pink=mat('#efb0d1'),crease=mat('#c5689b'),purple=mat('#a878e5'),edge=mat('#8050b7'),gold=mat('#ffdf65'),blue=mat('#8bbcff'),ivory=mat('#eef6ff');
 const group=(parent,x=0,y=0,z=0)=>{const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;};
 const tube=(parent,pts,r,m)=>mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>V(...p))),36,r,8,false),m,parent);
 const brainMat=new THREE.MeshStandardMaterial({color:'#ffffff',vertexColors:true,roughness:.59});
 const brainMesh=mesh(sculptBrain(THREE,V),brainMat,body,0,1.22,0);brainMesh.name='full-volume brain with sculpted folds';brainMesh.receiveShadow=false;
 const eyes=new THREE.Group();body.add(eyes); // Common animation interface; deliberately no face.
 const legs=[-1,1].map(s=>{const g=group(root,s*.30,.57,0);stick(g,V(0,0,0),V(s*.035,-.37,.02),.066,pink,12);sph(g,.13,kind==='witch'?purple:pink,s*.045,-.46,.12,1.12,.68,1.60);if(kind==='witch'){const boot=mesh(new THREE.CylinderGeometry(.11,.12,.20,16),purple,g,s*.035,-.32,.045);boot.rotation.z=s*.1;stick(g,V(s*.045-.038,-.32,.154),V(s*.045+.038,-.32,.154),.012,gold);stick(g,V(s*.045,-.36,.154),V(s*.045,-.28,.154),.012,gold);}return g;});
 function flatShape(parent,s,m,x,y,z,scale=1){const o=mesh(new THREE.ExtrudeGeometry(s,{depth:.025,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:2,curveSegments:20}),m,parent,x,y,z);o.scale.setScalar(scale);return o;}
 function star(parent,x,y,z,r,m=gold){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,rr=i%2?r*.44:r;const px=Math.cos(a)*rr,py=Math.sin(a)*rr;if(!i)s.moveTo(px,py);else s.lineTo(px,py);}s.closePath();return flatShape(parent,s,m,x,y,z);}
 let broom=null,hat=null,halo=null,wings=[];
 if(kind==='witch'){
  // The hat is a soft bent cone, not a stack of disconnected primitives.
  hat=group(body,0,1.86,-.015);const vs=[],ids=[],N=48;
  const profile=[[0,0,.66],[0,.20,.51],[.03,.51,.38],[.14,.83,.28],[.30,1.08,.19],[.49,1.15,.13],[.65,1.02,.06],[.72,.99,.005]];
  profile.forEach(([cx,cy,r],j)=>{for(let i=0;i<=N;i++){const a=i/N*Math.PI*2;vs.push(cx+Math.sin(a)*r,cy,Math.cos(a)*r*.78);if(j<profile.length-1&&i<N){const k=j*(N+1)+i;ids.push(k,k+1,k+N+1,k+1,k+N+2,k+N+1);}}});
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vs,3));geo.setIndex(ids);geo.computeVertexNormals();mesh(geo,purple,hat);
  const brim=mesh(new THREE.SphereGeometry(1,48,20),purple,hat,0,0,0);brim.scale.set(1.06,.080,.88);brim.rotation.z=-.035;
  const band=mesh(new THREE.CylinderGeometry(.50,.62,.16,48,1,true),mat('#df73be'),hat,0,.17,0);band.scale.z=.79;
  const rim=mesh(new THREE.TorusGeometry(.95,.033,8,64),edge,hat,0,0,0);rim.rotation.x=Math.PI/2;rim.scale.set(1.08,.91,1);
  for(const [x,y,z,r]of [[-.24,.50,.295,.09],[.17,.86,.19,.08],[.33,1.05,.10,.065],[-.67,.04,.34,.10],[.64,.04,.36,.085]])star(hat,x,y,z,r);
  const moon=new THREE.Shape();moon.moveTo(.08,.13);moon.bezierCurveTo(-.16,.15,-.18,-.14,.02,-.15);moon.bezierCurveTo(.14,-.15,.18,-.07,.16,-.045);moon.bezierCurveTo(-.025,-.13,-.09,.03,.08,.13);flatShape(hat,moon,gold,.17,.49,.312,.72);
  tube(hat,[[.72,1.00,0],[.78,.92,0],[.80,.82,0]],.016,gold);star(hat,.80,.72,.02,.15);
  const skull=group(hat,0,.20,.50);sph(skull,.155,ivory,0,0,0,1,.95,.60);for(const s of [-1,1]){sph(skull,.045,edge,s*.06,.02,.092,.78,1.12,.25);sph(skull,.035,ivory,s*.075,-.115,0,.7,1,.5);}sph(skull,.025,edge,0,-.06,.093,.7,1,.2);
  for(const s of [-1,1]){tube(body,[[s*.77,1.16,.10],[s*1.01,1.28,.16],[s*1.10,1.49,.19]],.045,pink);sph(body,.09,pink,s*1.10,1.50,.19,.8,1,.8);}
  broom=group(body,0,.45,0);tube(broom,[[-1.12,0,.10],[-.40,-.025,.11],[.55,.04,.12],[1.15,.17,.13]],.055,edge);
  for(let j=0;j<6;j++){const a=j/6*Math.PI*2;const tip=V(1.60,.23+Math.cos(a)*.16,.13+Math.sin(a)*.14);const b=mesh(new THREE.ConeGeometry(.115,.62,16),gold,broom);b.position.copy(V(1.20,.18,.13).lerp(tip,.5));b.quaternion.setFromUnitVectors(V(0,1,0),V(1,0.1,0).normalize());b.scale.y=-1;}
  const tie=mesh(new THREE.TorusGeometry(.12,.022,8,24),mat('#eba951'),broom,1.14,.17,.13);tie.rotation.y=Math.PI/2;
 } else {
  const shape=new THREE.Shape();shape.moveTo(0,0);shape.bezierCurveTo(.18,.52,.90,.79,1.02,.50);shape.bezierCurveTo(1.18,.22,.84,.13,.82,.12);shape.bezierCurveTo(1.00,-.10,.73,-.27,.56,-.16);shape.bezierCurveTo(.65,-.42,.27,-.50,.19,-.28);shape.bezierCurveTo(.12,-.30,0,-.16,0,0);
  for(const s of [-1,1]){const wing=group(body,s*.67,1.35,-.19);wing.scale.x=s;
   const wingMat=new THREE.MeshStandardMaterial({color:'#ffffff',vertexColors:true,roughness:.57});
   const wingMesh=mesh(sculptWing(THREE,V,shape),wingMat,wing);wingMesh.receiveShadow=false;
   tube(wing,[[.18,-.19,.20],[.22,-.02,.24],[.36,.02,.265],[.43,-.07,.255],[.36,-.13,.24]],.025,blue);wings.push(wing);}

  halo=mesh(new THREE.TorusGeometry(.37,.045,12,48),gold,body,0,2.32,0);halo.rotation.x=Math.PI/2;halo.scale.y=.86;
 }
 for(const [x,y,z,r]of [[-.55,.98,.71,.065],[.60,1.49,.67,.055]]){const glint=star(body,x,y,z,r,kind==='witch'?gold:ivory);glint.rotation.y=x*.68;glint.rotation.x=-(y-1.22)*.85;}
 let air=true;
 const setAir=value=>{air=value;if(broom)broom.visible=value;};
 function anim(ch,t){const flying=air&&!ch.runner;legs.forEach((leg,k)=>leg.rotation.x=flying?.40+Math.sin(t*2+k)*.05:Math.sin((ch.phase||0)+k*Math.PI)*.55*(ch.amp||0));wings.forEach((w,k)=>{w.rotation.y=(k?1:-1)*(flying?.23+Math.sin(t*5)*.40:.15+Math.sin(t*2)*.08);w.rotation.z=(k?1:-1)*Math.sin(t*2)*.06;});if(hat)hat.rotation.z=Math.sin(t*1.8)*.035;if(halo){halo.position.y=2.32+Math.sin(t*1.7)*.035;halo.rotation.z=Math.sin(t)*.04;}}
 return {root,body,eyes,radius:.82,height:kind==='witch'?3.18:2.48,kind,broom,wings,setAir,anim};
}
