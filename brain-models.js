// Original 3D interpretations of the two supplied brain illustrations.
export function createBrain(H,kind='witch') {
 const {THREE,mesh,sph,stick,V}=H, root=new THREE.Group(),body=new THREE.Group();root.add(body);
 const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.72});
 const pink=mat('#efb0d1'),crease=mat('#c5689b'),purple=mat('#a878e5'),edge=mat('#8050b7'),gold=mat('#ffdf65'),blue=mat('#8bbcff'),ivory=mat('#eef6ff');
 const group=(parent,x=0,y=0,z=0)=>{const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;};
 const tube=(parent,pts,r,m)=>mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>V(...p))),36,r,8,false),m,parent);
 const outline=new THREE.Shape();
 outline.moveTo(-.72,.10);outline.bezierCurveTo(-.85,.40,-.57,.65,-.31,.54);outline.bezierCurveTo(-.15,.66,-.02,.62,.04,.60);outline.bezierCurveTo(.29,.84,.60,.62,.56,.38);outline.bezierCurveTo(.85,.40,.94,.02,.74,-.13);outline.bezierCurveTo(.93,-.42,.56,-.67,.28,-.49);outline.bezierCurveTo(.09,-.69,-.27,-.65,-.36,-.50);outline.bezierCurveTo(-.63,-.64,-.93,-.45,-.81,-.18);outline.bezierCurveTo(-.94,-.02,-.86,.08,-.72,.10);
 const brain=new THREE.ExtrudeGeometry(outline,{depth:.36,bevelEnabled:true,bevelSize:.095,bevelThickness:.19,bevelSegments:8,curveSegments:24});
 mesh(brain,pink,body,0,1.10,-.18).name='continuous rounded pink brain';
 // Curved folds sit just above the soft pillow surface, with no detached ends.
 const folds=[ [[-.32,.52],[-.43,.32],[-.42,.04],[-.53,-.14],[-.45,-.40]], [[.04,.60],[.12,.39],[.10,.22]], [[-.23,.32],[-.04,.20],[.06,.04],[-.02,-.11],[-.25,-.16]], [[.14,-.14],[.32,.00],[.52,-.02],[.60,-.18]], [[.15,-.22],[.23,-.45],[.43,-.48]], [[-.70,.13],[-.55,.18],[-.42,.12]] ];
 for(const side of [-1,1])for(const f of folds){tube(body,f.map(([x,y])=>[x,1.10+y,side*.378]),.022,crease);}
 const eyes=new THREE.Group();body.add(eyes); // Common animation interface; deliberately no face.
 const legs=[-1,1].map(s=>{const g=group(root,s*.30,.57,0);stick(g,V(0,0,0),V(s*.035,-.37,.02),.066,pink,12);sph(g,.13,kind==='witch'?purple:pink,s*.045,-.46,.12,1.12,.68,1.60);if(kind==='witch'){const boot=mesh(new THREE.CylinderGeometry(.11,.12,.20,16),purple,g,s*.035,-.32,.045);boot.rotation.z=s*.1;stick(g,V(s*.045-.038,-.32,.154),V(s*.045+.038,-.32,.154),.012,gold);stick(g,V(s*.045,-.36,.154),V(s*.045,-.28,.154),.012,gold);}return g;});
 function flatShape(parent,s,m,x,y,z,scale=1){const o=mesh(new THREE.ExtrudeGeometry(s,{depth:.025,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:2,curveSegments:20}),m,parent,x,y,z);o.scale.setScalar(scale);return o;}
 function star(parent,x,y,z,r,m=gold){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,rr=i%2?r*.44:r;const px=Math.cos(a)*rr,py=Math.sin(a)*rr;if(!i)s.moveTo(px,py);else s.lineTo(px,py);}s.closePath();return flatShape(parent,s,m,x,y,z);}
 let broom=null,hat=null,halo=null,wings=[];
 if(kind==='witch'){
  // The hat is a soft bent cone, not a stack of disconnected primitives.
  hat=group(body,0,1.56,-.015);const vs=[],ids=[],N=48;
  const profile=[[0,0,.66],[0,.20,.51],[.03,.51,.38],[.14,.83,.28],[.30,1.08,.19],[.49,1.15,.13],[.65,1.02,.06],[.72,.99,.005]];
  profile.forEach(([cx,cy,r],j)=>{for(let i=0;i<=N;i++){const a=i/N*Math.PI*2;vs.push(cx+Math.sin(a)*r,cy,Math.cos(a)*r*.78);if(j<profile.length-1&&i<N){const k=j*(N+1)+i;ids.push(k,k+1,k+N+1,k+1,k+N+2,k+N+1);}}});
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vs,3));geo.setIndex(ids);geo.computeVertexNormals();mesh(geo,purple,hat);
  const brim=mesh(new THREE.SphereGeometry(1,48,20),purple,hat,0,0,0);brim.scale.set(1.00,.065,.70);brim.rotation.z=-.035;
  const band=mesh(new THREE.CylinderGeometry(.50,.62,.16,48,1,true),mat('#df73be'),hat,0,.17,0);band.scale.z=.79;
  const rim=mesh(new THREE.TorusGeometry(.95,.033,8,64),edge,hat,0,0,0);rim.rotation.x=Math.PI/2;rim.scale.y=.71;
  for(const [x,y,z,r]of [[-.24,.50,.295,.09],[.17,.86,.19,.08],[.33,1.05,.10,.065],[-.67,.04,.34,.10],[.64,.04,.36,.085]])star(hat,x,y,z,r);
  const moon=new THREE.Shape();moon.moveTo(.08,.13);moon.bezierCurveTo(-.16,.15,-.18,-.14,.02,-.15);moon.bezierCurveTo(.14,-.15,.18,-.07,.16,-.045);moon.bezierCurveTo(-.025,-.13,-.09,.03,.08,.13);flatShape(hat,moon,gold,.17,.49,.312,.72);
  tube(hat,[[.72,1.00,0],[.78,.92,0],[.80,.82,0]],.016,gold);star(hat,.80,.72,.02,.15);
  const skull=group(hat,0,.20,.50);sph(skull,.155,ivory,0,0,0,1,.95,.32);for(const s of [-1,1]){sph(skull,.045,edge,s*.06,.02,.048,.78,1.12,.25);sph(skull,.035,ivory,s*.075,-.115,0,.7,1,.5);}sph(skull,.025,edge,0,-.06,.053,.7,1,.2);
  for(const s of [-1,1]){tube(body,[[s*.64,1.10,.02],[s*.90,1.15,.08],[s*1.01,1.36,.10]],.045,pink);sph(body,.09,pink,s*1.01,1.37,.10,.7,1,.6);}
  broom=group(body,0,.45,0);tube(broom,[[-1.12,0,.10],[-.40,-.025,.11],[.55,.04,.12],[1.15,.17,.13]],.055,edge);
  for(let j=0;j<6;j++){const a=j/6*Math.PI*2;const tip=V(1.60,.23+Math.cos(a)*.16,.13+Math.sin(a)*.14);const b=mesh(new THREE.ConeGeometry(.115,.62,16),gold,broom);b.position.copy(V(1.20,.18,.13).lerp(tip,.5));b.quaternion.setFromUnitVectors(V(0,1,0),V(1,0.1,0).normalize());b.scale.y=-1;}
  const tie=mesh(new THREE.TorusGeometry(.12,.022,8,24),mat('#eba951'),broom,1.14,.17,.13);tie.rotation.y=Math.PI/2;
 } else {
  const shape=new THREE.Shape();shape.moveTo(0,0);shape.bezierCurveTo(.18,.52,.90,.79,1.02,.50);shape.bezierCurveTo(1.18,.22,.84,.13,.82,.12);shape.bezierCurveTo(1.00,-.10,.73,-.27,.56,-.16);shape.bezierCurveTo(.65,-.42,.27,-.50,.19,-.28);shape.bezierCurveTo(.12,-.30,0,-.16,0,0);
  for(const s of [-1,1]){const wing=group(body,s*.64,1.15,-.21);wing.scale.x=s;flatShape(wing,shape,blue,0,0,0);flatShape(wing,shape,ivory,.05,.01,.045,.84);
   tube(wing,[[.18,-.19,.11],[.22,-.02,.115],[.36,.02,.12],[.43,-.07,.12],[.36,-.13,.12]],.022,blue);wings.push(wing);}
  halo=mesh(new THREE.TorusGeometry(.37,.045,12,48),gold,body,0,2.03,0);halo.rotation.x=Math.PI/2;halo.scale.y=.86;
 }
 for(const [x,y,z,r]of [[-.55,.82,.40,.06],[.54,1.35,.40,.055]])star(body,x,y,z,r,kind==='witch'?gold:ivory);
 let air=true;
 const setAir=value=>{air=value;if(broom)broom.visible=value;};
 function anim(ch,t){const flying=air&&!ch.runner;legs.forEach((leg,k)=>leg.rotation.x=flying?.40+Math.sin(t*2+k)*.05:Math.sin((ch.phase||0)+k*Math.PI)*.55*(ch.amp||0));wings.forEach((w,k)=>{w.rotation.y=(k?1:-1)*(flying?.23+Math.sin(t*5)*.40:.15+Math.sin(t*2)*.08);w.rotation.z=(k?1:-1)*Math.sin(t*2)*.06;});if(hat)hat.rotation.z=Math.sin(t*1.8)*.035;if(halo){halo.position.y=2.03+Math.sin(t*1.7)*.035;halo.rotation.z=Math.sin(t)*.04;}}
 return {root,body,eyes,radius:.65,height:kind==='witch'?2.95:2.17,kind,broom,wings,setAir,anim};
}
