export function buildCoast(H){
 const {THREE,scene,B,sph,cyl,stick,mesh,CL,V,canvasTex,glow}=H,root=new THREE.Group();root.position.set(-68,6.92,-59);scene.add(root);const icePick=[],bikePick=[],photoPick=[];
 const blue='#7cc4da',yellow='#edc96e',cream='#fff1d6',red='#e88b71',wood='#c7a581';
 const g=(parent,x=0,y=0,z=0)=>{const o=new THREE.Group();o.position.set(x,y,z);parent.add(o);return o;};
 const mark=(o,list)=>o.traverse(m=>{if(m.isMesh)list.push(m);});
 const signPaints=[];
 function sign(parent,text,w,h,x,y,z,bg=blue,fg=cream){
  // Match the canvas to the sign so the bubbly letters keep their natural shape.
  const width=w<h?256:1024,height=Math.round(width*h/w),lines=w<h?[...text]:[text];
  const paint=q=>{q.clearRect(0,0,width,height);q.fillStyle=bg;q.fillRect(0,0,width,height);q.textAlign='center';q.textBaseline='middle';
   const lineHeight=height*.88/lines.length;let size=Math.min(lineHeight*.88,width*.83);
   q.font=`${size}px "Sunny Chewy", Nunito, sans-serif`;
   while(lines.some(line=>q.measureText(line).width>width*.93)&&size>12){size-=2;q.font=`${size}px "Sunny Chewy", Nunito, sans-serif`;}
   lines.forEach((line,i)=>{const baseline=height*.51+(i-(lines.length-1)/2)*lineHeight;
    if(text==='Sunny Scoops'){q.fillStyle='#e2a98b';q.fillText(line,width/2+2,baseline+4);}
    q.fillStyle=fg;q.fillText(line,width/2,baseline);
   });
  };
  const tex=canvasTex(width,height,paint);signPaints.push(()=>{paint(tex.image.getContext('2d'));tex.needsUpdate=true;});
  return mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,roughness:.85}),parent,x,y,z);
 }
 // A cliff-backed overlook ties the pier and the existing bridge deck together.
 B(root,19,7.6,14,'#b6c5ab',0,-7.6,0,.7);B(root,19.4,.18,14.4,'#dcd2bf',0,-.18,0,.09);
 for(let x=-9;x<10;x+=.7)B(root,.018,.005,14,'#c5b9a6',x,.004,0);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(19,14),new THREE.MeshBasicMaterial({visible:false}));floor.rotation.x=-Math.PI/2;floor.position.y=.01;root.add(floor);H.walkSurf.push(floor);
 // Separated, painted cycle promenade beside the bridge's red roadway.
 B(scene,62,.16,3.5,'#c4dbce',-47,6.77,-67.5,.05);
 const routeFloor=new THREE.Mesh(new THREE.PlaneGeometry(62,3.5),new THREE.MeshBasicMaterial({visible:false}));routeFloor.rotation.x=-Math.PI/2;routeFloor.position.set(-47,6.94,-67.5);scene.add(routeFloor);H.walkSurf.push(routeFloor);
 for(let x=-77;x<=-16;x+=1.6){if(x<-73||x>-69)B(scene,.075,1.05,.075,'#e58b73',x,6.94,-65.78);B(scene,.075,1.05,.075,'#e58b73',x,6.94,-69.21);if(x%3<1)B(scene,.65,.008,.04,cream,x,6.938,-67.5);}
 B(scene,62,.08,.09,'#e58b73',-47,7.94,-69.21,.03);B(scene,5,.08,.09,'#e58b73',-75.5,7.94,-65.78,.03);B(scene,53,.08,.09,'#e58b73',-42.5,7.94,-65.78,.03);
 for(const x of [-9.45,9.45]){B(root,.1,1,14,'#ebc58d',x,0,0);for(let z=-6.5;z<7;z+=.65)B(root,.1,.90,.07,'#dce9e2',x,.04,z);}
 for(let i=0;i<7;i++)sph(scene,2.1,'#acbe9c',-77+i*2.7,1.5+(i%2)*.4,-52,1.25,1.5,1,12);
 const kiosk=g(root,-2,0,-1.7);
 B(kiosk,6.6,3.55,3.5,cream,0,0,0,.06);B(kiosk,6.72,.40,3.7,blue,0,3.25,0,.035);
 // Blue window framing, striped counter, and a giant yellow sunrise marquee.
 B(kiosk,5.95,1.7,.10,'#435f69',0,1.08,1.79,.02);B(kiosk,5.72,1.35,.04,'#d5e7e5',0,1.30,1.86);
 for(const x of [-2.86,-.95,.95,2.86])B(kiosk,.1,1.8,.18,blue,x,1.06,1.93,.02);
 B(kiosk,6.8,.12,1.1,'#ede0c6',0,1.0,2.15,.04);B(kiosk,6.35,.82,.2,blue,0,.12,1.84,.03);
 for(let x=-3;x<=3;x+=.4)B(kiosk,.18,.76,.035,cream,x,.14,1.96);
 const canopy=B(kiosk,7.25,.17,2.0,blue,0,3.03,2.1,.05);canopy.rotation.x=.04;B(kiosk,7.32,.16,.1,cream,0,2.98,3.08,.02);
 const marquee=g(kiosk,0,3.48,1.82);B(marquee,7.2,1.4,.16,blue,0,0,0,.03);
 const sun=mesh(new THREE.CircleGeometry(.55,28,0,Math.PI),yellow,marquee,-2,.02,.1);
 for(let i=0;i<7;i++){const a=i*Math.PI/6;const beam=B(marquee,.15,.52,.06,yellow,-2+Math.cos(a)*.92,.1+Math.sin(a)*.7,.12,.02);beam.rotation.z=a-Math.PI/2;}
 sign(marquee,'Sunny Scoops',4.05,.63,1.25,.77,.11,blue,cream);sign(marquee,'Scoops of Sunshine',3.9,.38,1.25,.25,.11,blue,cream);
 sign(kiosk,'Ice Cream',3.3,.38,0,2.75,2.1,blue,cream);
 for(const x of [-3.0,3.0])sign(kiosk,'ICE',.43,1.3,x,2.43,2.23,red,cream);
 for(let i=0;i<3;i++){const tray=g(kiosk,-1.55+i*1.55,1.1,2.08);B(tray,1.2,.12,.58,cream,0,0,0,.04);for(let j=0;j<5;j++)sph(tray,.12,['#fff0cf','#f0aaba','#a97f67'][i],-.38+j*.19,.16,0,1,.85,1,10);}
 for(const x of [-2.1,2.1]){cyl(kiosk,.15,.14,.38,cream,x,1.1,1.43,14);for(let i=0;i<5;i++)stick(kiosk,V(x+(i-2)*.035,1.4,1.43),V(x+(i-2)*.06,1.80,1.43),.012,wood,5);}
 // Sculpted soft-serve landmark, like the photo's tall pavement cone.
 const giant=g(kiosk,-4.12,0,2.3);cyl(giant,.36,.4,.25,'#d9e3df',0,0,0,24);cyl(giant,.35,.05,1.85,yellow,0,.25,0,24);
 for(let i=0;i<5;i++)cyl(giant,.35-i*.014,.35-i*.014,.055,'#d7ab5c',0,.58+i*.3,0,24);
 for(let i=0;i<5;i++)sph(giant,.36-i*.055,cream,Math.sin(i*.8)*.045,2.12+i*.18,0,1,.7,1,20);mark(giant,icePick);mark(kiosk,icePick);
 // A sunny doughnut puppet: soft pile, oversized eyes, mittens and little boots.
 const mascot=g(root,.9,0,1.65),dough='#e8b969',baked='#d19b50',face='#553941';mascot.name='sunny-doughnut-mascot';
 const body=mesh(new THREE.TorusGeometry(.58,.31,18,48),dough,mascot,0,1.37,0);body.scale.set(1,1.06,.82);
 const seam=mesh(new THREE.TorusGeometry(.58,.315,8,48), '#f2cb85',mascot,0,1.37,-.015);seam.scale.set(1,1.06,.15);
 // Sparse, shallow rounded pile keeps the fabric soft without a spiky silhouette.
 const pile=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),CL('#ecc078'),160),matrix=new THREE.Matrix4(),rotation=new THREE.Quaternion();
 for(let i=0;i<160;i++){
  const a=i*Math.PI*2/160,b=i*2.399963,r=.58+.31*Math.cos(b),normal=V(Math.cos(b)*Math.cos(a),Math.cos(b)*Math.sin(a),Math.sin(b)).normalize();
  rotation.setFromUnitVectors(V(0,1,0),normal);matrix.compose(V(r*Math.cos(a),1.37+r*Math.sin(a)*1.06,.2542*Math.sin(b)),rotation,V(.021,.008,.018));pile.setMatrixAt(i,matrix);
 }pile.castShadow=true;pile.receiveShadow=true;mascot.add(pile);
 mesh(new THREE.CircleGeometry(.225,32),blue,mascot,0,1.37,-.12);
 mesh(new THREE.CircleGeometry(.086,24),cream,mascot,0,1.37,-.115);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;stick(mascot,V(Math.cos(a)*.115,1.37+Math.sin(a)*.115,-.105),V(Math.cos(a)*.155,1.37+Math.sin(a)*.155,-.105),.013,cream,6);}
 for(const side of [-1,1]){
  const x=side*.218;sph(mascot,.223,'#fff9e8',x,2.155+(side===-1?.035:0),.285,.98,1.06,.78,22);sph(mascot,.088,face,x+.013,2.155,.451,.92,1.05,.42,18);sph(mascot,.025,'#fffef4',x-.011,2.187,.485,1,1,.45,12);
  sph(mascot,.11,'#e8a188',side*.43,1.91,.238,1,.68,.36,16);
  const arm=new THREE.CatmullRomCurve3([V(side*.75,1.56,.01),V(side*.98,1.31,.06),V(side*.95,1.04,.15)]);
  mesh(new THREE.TubeGeometry(arm,14,.105,10,false),dough,mascot);
  for(let j=0;j<3;j++)sph(mascot,.113,'#f0c77d',side*(.91+j*.026),1.40-j*.12,.085,1,.54,1,14);
  sph(mascot,.185,cream,side*.92,.98,.17,.94,1,.76,18);sph(mascot,.085,cream,side*.77,1.04,.22,.8,1,1,14);
  for(let j=0;j<3;j++)sph(mascot,.057,'#f9edd6',side*(.82+j*.075),.88,.23,.85,1,.9,12);
  cyl(mascot,.13,.145,.39,dough,side*.30,.17,.005,16);
  for(let j=0;j<3;j++)sph(mascot,.145,'#f0c77d',side*.30,.26+j*.11,.015,1,.38,1,14);
  sph(mascot,.24,dough,side*.32,.14,.13,1.20,.59,1.65,18);sph(mascot,.22,baked,side*.32,.055,.14,1.18,.16,1.66,16);
 }
 mark(mascot,icePick);
 // Planters, a mint parasol, and seats looking out to the bay.
 for(const x of [-6.1,8.0]){B(root,2.1,.63,.7,wood,x,.02,2.65,.04);for(let k=0;k<8;k++)sph(root,.22,'#98bc94',x-.8+k*.23,.77,2.65,1,.7,1,10);}
 const seats=g(root,4,.0,3.7);cyl(seats,.7,.7,.07,cream,0,.87,0,32);cyl(seats,.06,.08,.88,'#99b6be',0,0,0);
 for(const x of [-1.3,1.3]){cyl(seats,.37,.37,.11,blue,x,.52,0,24);for(const dx of [-.2,.2])for(const dz of [-.2,.2])B(seats,.05,.52,.05,cream,x+dx,0,dz);}
 const seat=g(root,4,.0,2.75);B(seat,.72,.15,.65,blue,0,.50,0,.08);B(seat,.75,.62,.10,blue,0,.57,-.31,.04);for(const dx of [-.26,.26])for(const dz of [-.22,.22])B(seat,.06,.5,.06,cream,dx,0,dz);
 const parasol=g(root,7,0,2.2);cyl(parasol,.045,.045,3.2,cream,0,0,0,10);const shade=mesh(new THREE.ConeGeometry(1.4,.43,10),CL('#acd4cb'),parasol,0,3.25,0);sph(parasol,.085,yellow,0,3.5,0,1,1,1,12);
 sign(root,'GOLDEN GATE · SCENIC STOP',4.4,.48,-6.5,1.35,6.66,'#d9c8a9','#567887');
 const photoSign=B(root,4.6,.65,.10,wood,-6.5,1.05,6.59,.025);mark(photoSign,photoPick);
 function cone(id='vanilla') {const o=new THREE.Group(),food=new THREE.Group();o.add(food);food.position.y=.35;cyl(o,.13,.015,.35,yellow,0,0,0,18);for(let j=0;j<5;j++)cyl(o,.12-j*.014,.12-j*.014,.009,'#d1a960',0,.31-j*.05,0,18);
  const color={vanilla:'#fff0cf',berry:'#f0aaba',cocoa:'#a97f67'}[id];for(let i=0;i<4;i++)sph(food,.145-i*.025,color,0,.03+i*.07,0,1,.65,1,18);return {root:o,food,tip:V(0,.59,0)};}
 function bike(){const o=new THREE.Group(),wheels=[];
  for(const z of [-.66,.66]){const wheel=g(o,0,.34,z);mesh(new THREE.TorusGeometry(.32,.045,8,32),'#536476',wheel).rotation.y=Math.PI/2;mesh(new THREE.TorusGeometry(.265,.017,6,24),cream,wheel).rotation.y=Math.PI/2;for(let i=0;i<8;i++){const a=i*Math.PI/4;stick(wheel,V(0,0,0),V(0,Math.cos(a)*.27,Math.sin(a)*.27),.008,'#acbfca',4);}wheels.push(wheel);}
  const a=V(0,.34,-.66),b=V(0,.77,-.22),c=V(0,.42,.02),d=V(0,.83,.48),e=V(0,.34,.66);for(const [p,q]of[[a,b],[b,c],[c,a],[b,d],[c,d],[d,e]])stick(o,p,q,.035,blue,8);
  B(o,.37,.07,.27,'#ac896f',0,.79,-.23,.025);stick(o,V(0,.8,.48),V(0,1.04,.39),.025,cream);stick(o,V(-.34,1.04,.39),V(.34,1.04,.39),.022,cream);
  for(const x of [-.29,.29])B(o,.18,.05,.10,'#a9876c',x,1.01,.4,.02);
  const pedals=g(o,0,.43,.02);for(const x of [-.23,.23]){stick(pedals,V(0,0,0),V(x,0,x>0?.15:-.15),.025,'#8ca0ad');B(pedals,.13,.045,.16,'#596778',x,-.025,x>0?.15:-.15,.01);}
  // A rear luggage tray also gives the round, handless friends a safe perch.
  B(o,.75,.05,.45,cream,0,.78,-.49,.02);B(o,.1,.28,.48,blue,-.35,.82,-.49,.02);B(o,.1,.28,.48,blue,.35,.82,-.49,.02);
  return {root:o,wheels,pedals};
 }
 const rental=bike();rental.root.position.set(-4,.015,4.6);rental.root.rotation.y=.5;root.add(rental.root);mark(rental.root,bikePick);sign(root,'Seaside Rides',2.2,.5,-4,1.65,4.6,cream,'#628d95');
 // Canvas textures need repainting once the bundled font has finished loading.
 document.fonts.load('64px "Sunny Chewy"').then(()=>signPaints.forEach(paint=>paint())).catch(()=>{});
 const bridgePick=[];mark(H.bridge,bridgePick);return {root,icePick,bikePick,photoPick,bridgePick,cone,bike,seat,iceSeat:V(-64,7.49,-56.25),iceTable:V(-64,7.89,-55.3),photoScene(){const g=new THREE.Group(),bridge=H.bridge.clone(true);bridge.position.set(17,0,72);g.add(bridge);g.scale.setScalar(.10);return g;}};
}
