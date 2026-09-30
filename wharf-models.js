import {WHARF_ORIGIN} from './wharf-state.js';
export function buildWharf(H){
 const {THREE,scene,B,sph,cyl,mesh,stick,V,CL,canvasTex,walkSurf}=H;
 const root=new THREE.Group();root.name='Fisherman’s Wharf';root.position.set(...WHARF_ORIGIN);scene.add(root);
 const picks=[],lions=[],floats=[],gulls=[],roof=new THREE.Group(),bowls=[];
 const C={wood:'#98765b',light:'#c7a27c',dark:'#665344',navy:'#354b64',cream:'#f4e3bb',red:'#c76f60',water:'#8ebdc9'};
 const group=(par,x=0,y=0,z=0)=>{const g=new THREE.Group();g.position.set(x,y,z);par.add(g);return g;};
 const mark=(o,space)=>o.traverse(m=>{if(m.isMesh){m.userData.wharf=space;picks.push(m);}});
 function sign(par,text,w,h,x,y,z,bg=C.navy,fg=C.cream){const cw=1024,ch=Math.round(cw*h/w),tex=canvasTex(cw,ch,q=>{q.fillStyle=bg;q.fillRect(0,0,cw,ch);q.strokeStyle=fg;q.lineWidth=5;q.strokeRect(12,12,cw-24,ch-24);let sz=Math.min(ch*.65,180);q.textAlign='center';q.textBaseline='middle';q.font=`900 ${sz}px Nunito, sans-serif`;while(q.measureText(text).width>cw*.91){sz-=2;q.font=`900 ${sz}px Nunito,sans-serif`;}q.fillStyle=fg;q.fillText(text,cw/2,ch*.54);});return mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,roughness:.9}),par,x,y,z);}
 function boards(par,w,d,x,y,z){B(par,w,.32,d,C.dark,x,y-.32,z,.05);for(let i=0;i<Math.ceil(d/.56);i++){const zz=z-d/2+(i+.5)*d/Math.ceil(d/.56);B(par,w-.03,.045,d/Math.ceil(d/.56)-.035,i%3===0?'#ac8867':i%3===1?'#b79470':'#bea07d',x,y-.025,zz,.008);} }
 boards(root,32,32,0,0,0);boards(root,7.5,6.3,0,0,18.1);
 const floor=mesh(new THREE.PlaneGeometry(32,32),new THREE.MeshBasicMaterial({visible:false}),root,0,.018,0);floor.rotation.x=-Math.PI/2;walkSurf.push(floor);
 for(const x of [-15.5,15.5])for(let z=-15;z<16;z+=3){cyl(root,.18,.21,2.4,C.dark,x,-2.2,z,12);cyl(root,.14,.15,1.05,C.cream,x,0,z,12);}
 for(const x of [-15.5,15.5]){B(root,.12,.1,31,C.cream,x,.76,0,.03);B(root,.1,.08,31,C.cream,x,.32,0,.025);}
 for(let x=-15;x<16;x+=3)cyl(root,.13,.15,1,C.cream,x,0,-15.5,12);
 B(root,31,.12,.13,C.cream,0,.76,-15.5,.03);
 // Entrance: rope-wrapped timber, wheel-shaped sign and a sculpted crab.
 const entrance=group(root,-5.3,0,12.7);for(const x of [-.32,.32])cyl(entrance,.19,.22,5,C.dark,x,0,0,12);
 for(let y=.25;y<1.5;y+=.09){const r=mesh(new THREE.TorusGeometry(.35,.032,6,24),'#bbad8d',entrance,0,y,0);r.rotation.x=Math.PI/2;}
 const wheel=group(entrance,0,3.3,.22);mesh(new THREE.CylinderGeometry(1.55,1.55,.16,48),C.cream,wheel).rotation.x=Math.PI/2;
 mesh(new THREE.TorusGeometry(1.59,.12,8,48),C.navy,wheel,0,0,.05);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;stick(wheel,V(Math.sin(a)*1.58,Math.cos(a)*1.58,0),V(Math.sin(a)*1.9,Math.cos(a)*1.9,0),.055,C.navy);}
 sign(wheel,"FISHERMAN'S WHARF",2.68,.40,0,.68,.13,C.cream,C.navy);sign(wheel,'SAN FRANCISCO',2.02,.32,0,-.95,.13,C.cream,C.navy);
 sph(wheel,.40,'#d88b59',0,-.05,.18,1.4,.8,.3);for(const side of [-1,1]){for(let i=0;i<3;i++)stick(wheel,V(side*.4,-.1-i*.1,.17),V(side*(.65+i*.04),-.18-i*.19,.17),.035,'#d88b59');stick(wheel,V(side*.35,.09,.17),V(side*.72,.33,.17),.045,'#d88b59');sph(wheel,.14,'#d88b59',side*.74,.39,.17,1,.85,.32);}mark(entrance,'wharf');
 function lamp(x,z){cyl(root,.055,.08,3.8,C.navy,x,0,z,10);cyl(root,.17,.22,.12,C.navy,x,0,z,12);sph(root,.21,'#fff0bd',x,3.55,z,1,1.4,1,14);cyl(root,.30,.05,.18,C.navy,x,3.84,z,12);}
 for(const [x,z] of [[-13,8],[12,10],[12,-13],[-13,-14]])lamp(x,z);
 function flowerpot(x,z){cyl(root,.37,.25,.50,C.red,x,0,z,14);for(let i=0;i<7;i++){const a=i*2.4;sph(root,.25,'#7b9e79',x+Math.sin(a)*.27,.68,z+Math.cos(a)*.27,1,1.2,1,10);sph(root,.09,i%2?'#f1c2ae':'#f6e2ad',x+Math.sin(a)*.30,.90,z+Math.cos(a)*.30,1,1,1,8);}}
 flowerpot(-12.8,-4.5);flowerpot(-.8,-4.5);flowerpot(10,10);
 // Boudin-inspired open bakery: timber balcony, cream walls, red lettering.
 const shop=group(root,-7,0,-10);B(shop,10.7,4.9,.24,C.cream,0,0,-3.8,.04);B(shop,.25,4.9,7.6,C.cream,-5.35,0,0,.04);B(shop,.25,4.9,7.6,C.cream,5.35,0,0,.04);
 for(let y=.3;y<4.9;y+=.52)B(shop,10.6,.08,.06,'#ddc9a8',0,y,-3.65,.01);
 B(shop,11.5,.28,8.6,C.dark,0,4.6,.2,.04);for(const x of [-5.2,5.2])B(shop,.24,4.65,.24,C.dark,x,0,3.75,.03);
 for(let x=-5.4;x<5.5;x+=.6)B(shop,.07,.75,.08,C.light,x,4.87,4.22,.02);B(shop,11.5,.14,.18,C.light,0,5.58,4.22,.025);
 shop.add(roof);B(roof,11.6,.2,8.8,C.navy,0,5.82,.15,.06);
 sign(shop,'BOUDIN',5.3,.98,0,3.80,4.04,'#efe0bf',C.red);sign(shop,'SOURDOUGH & CHOWDER',4.0,.37,0,3.06,4.06,C.navy,C.cream);
 B(shop,7.5,1.0,1.0,C.dark,0,0,1.15,.06);B(shop,7.8,.14,1.35,C.light,0,1.0,1.15,.055);
 for(const x of [-3,-1.5,0,1.5,3]){cyl(shop,.32,.34,.32,'#c88d53',x,1.15,1.15,18);sph(shop,.30,'#e2af6c',x,1.44,1.15,1,.43,1,18);for(const off of [-.10,.1]){const sl=B(shop,.32,.016,.034,'#f1d1a0',x,1.55,1.15+off,.01);sl.rotation.y=-.3;}}
 for(const side of [-1,1]){B(shop,1.45,2.15,.09,C.navy,side*4.15,.55,-3.60,.03);sign(shop,'BREAD',1.25,.35,side*4.15,2.35,-3.53,C.cream,C.navy);for(let row=0;row<3;row++){B(shop,1.6,.09,.7,C.light,side*4.15,.78+row*.55,-3.35,.025);for(let k=0;k<3;k++)sph(shop,.20,'#d9a66c',side*4.15+(k-1)*.44,1.00+row*.55,-3.3,1,.65,1,14);}}
 sign(shop,'CLAM CHOWDER',2.5,.48,0,2.4,-3.61,C.navy,C.cream);sign(shop,'SOURDOUGH BOWL',2.5,.34,0,1.92,-3.61,C.cream,C.dark);
 // A warm oven and a striped counter towel give the small interior depth.
 B(shop,1.5,1.25,1.3,'#aaa89b',0,0,-2.7,.14);B(shop,1.05,.65,.06,'#694e39',0,.32,-2.01,.08);B(shop,1.5,.06,.72,'#ead5ac',2.3,1.17,1.2,.01);
 for(const x of [-4.4,4.4]){stick(shop,V(x,4.6,3.7),V(x,3.6,3.7),.02,C.dark);cyl(shop,.28,.15,.3,C.wood,x,3.35,3.7,14);for(let j=0;j<5;j++){const a=j*1.26;sph(shop,.17,'#719375',x+Math.sin(a)*.19,3.62,3.7+Math.cos(a)*.18,1,.85,1,12);sph(shop,.085,j%2?'#f2c6a5':'#eedcaf',x+Math.sin(a)*.24,3.69,3.7+Math.cos(a)*.24,1,1,1,10);}}
 const chalk=group(shop,-4.1,0,4.8);B(chalk,1.35,1.6,.13,C.light,0,0,0,.04);sign(chalk,'CHOWDER',1.13,.35,0,1.22,.08,C.navy,C.cream);sign(chalk,'BREAD BOWL',1.13,.28,0,.84,.08,C.navy,C.cream);sign(chalk,'6 COINS',1.13,.33,0,.42,.08,C.navy,C.cream);
 mark(shop,'bakery');
 const house=group(root,7,0,-11);B(house,8.8,4.7,6.6,C.wood,0,0,0,.05);
 for(let y=.2;y<4.8;y+=.36)B(house,8.9,.045,.07,C.dark,0,y,3.33,.01);
 const rise=1.6,half=4.8;for(const side of [-1,1]){const panel=B(house,Math.hypot(half,rise),.17,7.4,C.navy,side*half/2,5.3,0,.03);panel.rotation.z=-side*Math.atan2(rise,half);}
 for(const x of [-2.6,0,2.6]){B(house,1.8,2.05,.12,C.cream,x,.6,3.42,.025);B(house,1.52,1.77,.13,'#aecbd0',x,.74,3.49,.02);B(house,.06,1.75,.04,C.cream,x,.75,3.57,.01);}
 sign(house,'PIER 39',6.5,.92,0,4.18,3.55);sign(house,'BY THE BAY',2.7,.42,0,2.7,3.57,C.cream,C.navy);mark(house,'wharf');
 // Striped awning and hanging flowers on the wooden street.
 for(let i=0;i<9;i++){const a=B(house,.91,.10,1.6,i%2?C.cream:'#849fae',-3.64+i*.91,3.12,4.0,.02);a.rotation.x=.13;}
 const banner=group(root,-11,0,8.5);cyl(banner,.08,.1,4.1,C.navy,0,0,0,10);sign(banner,'PIER 39',2.2,.65,1.12,3.65,0);sign(banner,'SEA LIONS →',2.5,.5,1.27,2.93,0);
 // Outdoor eating table, three individual settings and seats.
 const table=group(root,5.6,0,3.8);B(table,5.5,.13,1.8,C.light,0,.94,0,.09);for(const x of [-2.25,2.25])B(table,.14,.94,1.2,C.navy,x,0,0,.025);
 for(let i=0;i<3;i++){const x=(i-1)*1.6;cyl(table,.46,.43,.12,C.light,x,.41,-1.34,20);if(i>0)cyl(table,.40,.43,i===1?.30:.49,'#adc5cd',x,.53,-1.34,20);for(const dx of [-.25,.25])B(table,.07,.42,.08,C.navy,x+dx,0,-1.34,.02);}
 for(const x of [2.8,8.4])cyl(root,.05,.07,2.8,C.navy,x,0,1.98,10);
 sign(root,'A BOWL BY THE BAY',4.9,.60,5.6,2.5,1.98);mark(table,'chowder');
 // Sea lion viewing deck, separated from the floating docks by water.
 const lookout=group(root,13,0,-3);sign(lookout,'SEA LIONS',3.0,.56,0,2.1,0);for(const x of [-1.4,1.4])cyl(lookout,.045,.045,2.3,C.navy,x,0,0,8);mark(lookout,'seaLions');
 function seaLion(par,x,z,scale,index){const g=group(par,x,.08,z);g.scale.setScalar(scale);g.rotation.y=(index%3-1)*.5;const body=group(g);
  sph(body,.58,index%2?'#a58a72':'#92745c',0,.40,0,1,1.0,1.85,20);sph(body,.36,'#a58a72',0,.87,.56,.80,1.20,.88,18);
  const head=group(body,0,1.24,.67);sph(head,.32,index%2?'#b79a7c':'#9e8269',0,0,0,1,1,.93,18);sph(head,.19,'#ccb69a',0,-.10,.25,1,.63,.54,16);sph(head,.085,'#4d4944',0,-.055,.35,1,.68,.6,12);
  for(const side of [-1,1]){sph(head,.046,'#352f2a',side*.13,.065,.25,1,1,.55,10);sph(head,.062,'#8a715b',side*.30,.02,-.06,.6,1,.7,10);for(let w=0;w<3;w++)stick(head,V(side*.09,-.12,.32),V(side*(.30+w*.025),-.10-w*.047,.32),.007,'#62594e');}
  const flippers=[];for(const side of [-1,1]){const f=group(body,side*.40,.28,.25);const fin=sph(f,.30,'#8f745b',side*.18,0,0,1.65,.20,.65,14);fin.rotation.y=side*.3;flippers.push(f);const tail=sph(body,.23,'#8a715b',side*.18,.18,-.99,.85,.22,1.35,14);tail.rotation.y=-side*.4;}
  const data={root:g,body,head,flippers,base:g.position.clone(),phase:index*1.37,wave:0,index};g.traverse(m=>{if(m.isMesh){m.userData.seaLion=index;picks.push(m);}});lions.push(data);return g;
 }
 for(let i=0;i<3;i++){const dock=group(root,21.3+(i%2)*4.1,-.63,-10.5-Math.floor(i/2)*5.2);boards(dock,3.5,4.2,0,0,0);for(const x of [-1.4,1.4])cyl(dock,.075,.1,.65,C.dark,x,-.6,1.7,10);floats.push(dock);seaLion(dock,-.68,-.4,.78,i*2);seaLion(dock,.68,.65,.72,i*2+1);}
 const swimmer=seaLion(root,19.1,-5.8,.78,6);swimmer.position.y=-.98;const swimRipple=mesh(new THREE.TorusGeometry(.75,.022,6,40),'#d4e6df',root,19.1,-.94,-5.8);swimRipple.rotation.x=Math.PI/2;
 function gull(x,y,z){const g=group(root,x,y,z);sph(g,.16,'#faf3df',0,0,0,1,.8,1.5,12);sph(g,.1,'#faf3df',0,.12,.14,1,1,1,12);const beak=mesh(new THREE.ConeGeometry(.045,.19,10),'#d3a352',g,0,.10,.29);beak.rotation.x=Math.PI/2;sph(g,.02,'#393b3d',.07,.15,.19,1,1,1,8);gulls.push(g);}
 gull(-5.3,5.12,12.7);gull(15.5,1.16,-12);gull(-12,5.85,-6.2);
 function breadBowl(){const g=new THREE.Group();cyl(g,.48,.51,.025,'#c57565',0,0,0,32);cyl(g,.39,.29,.28,'#bb7c43',0,.028,0,28);const rim=mesh(new THREE.TorusGeometry(.335,.08,10,32),'#d4a367',g,0,.31,0);rim.rotation.x=Math.PI/2;
  const soup=cyl(g,.308,.308,.035,'#fff0cb',0,.29,0,32);for(let i=0;i<8;i++){const a=i*2.4,r=.07+(i%3)*.07;B(g,.037,.012,.024,'#75925e',Math.sin(a)*r,.33,Math.cos(a)*r,.006);}
  for(let i=0;i<24;i++){const a=i*2.4,yy=.07+(i%4)*.052;sph(g,.011,i%2?'#e9bc7d':'#dfae6e',Math.sin(a)*(.32+yy*.16),yy,Math.cos(a)*(.32+yy*.16),1,.6,.6,8);}
  const lid=cyl(g,.27,.28,.12,'#d4a267',.55,.06,.07,24);lid.rotation.z=-.30;const crumb=cyl(g,.235,.235,.02,'#f1d5a1',.565,.18,.07,24);crumb.rotation.z=-.30;
  const steam=group(g);for(let i=0;i<3;i++){const puff=sph(steam,.06,new THREE.MeshBasicMaterial({color:'#fffaf0',transparent:true,opacity:.27,depthWrite:false}),-.15+i*.15,.45,0,.6,1.6,.6,10);puff.userData.seed=i;}
  return {root:g,soup,steam};
 }
 function spoon(){const g=new THREE.Group();B(g,.055,.035,.32,'#c3cbd0',0,0,0,.017);sph(g,.10,'#d2d8d8',0,.012,.20,.65,.22,1,14);sph(g,.08,'#fff0cb',0,.031,.20,.64,.22,.82,12);return {root:g,tip:V(0,.035,.24)};}
 function clearMeal(){for(const b of bowls){b.root.removeFromParent();b.root.traverse(m=>{if(m.isMesh){m.geometry.dispose();if(m.material.map===undefined&&m.material.type==='MeshBasicMaterial')m.material.dispose();}});}bowls.length=0;}
 function serve(ids){clearMeal();for(const i of ids){const b=breadBowl();b.root.position.set((i-1)*1.6,1.075,-.65);b.root.scale.setScalar(.82);table.add(b.root);bowls.push({...b,i});}}
 function seat(i){return {point:root.localToWorld(V(5.6+(i-1)*1.6,i===0?.38:i===1?.80:.98,2.46)),yaw:0};}
 function photoScene(){const g=new THREE.Group();boards(g,6.2,2.6,0,0,0);sign(g,'PIER 39',3.3,.68,0,3.75,-.8);for(const x of [-1.7,1.7])cyl(g,.055,.055,3.8,C.navy,x,0,-.8,10);for(const [i,l]of lions.slice(0,3).entries()){const c=l.root.clone(true);c.position.set((i-1)*1.32,.05,-.15);c.rotation.y=0;c.scale.setScalar(.85);g.add(c);}return g;}
 return {root,picks,lions,table,bowls,serve,clearMeal,spoon,seat,photoScene,world:p=>root.localToWorld(p),greet(i){if(lions[i])lions[i].wave=3.2;},update(dt,t,space){roof.visible=space!=='bakery';floats.forEach((f,i)=>{f.position.y=-.63+Math.sin(t*.75+i)*.035;f.rotation.z=Math.sin(t*.6+i)*.008;});lions.forEach(l=>{l.wave=Math.max(0,l.wave-dt);l.head.rotation.x=Math.sin(t*.75+l.phase)*.10;l.head.rotation.y=Math.sin(t*.35+l.phase)*.13;l.body.scale.y=1+Math.sin(t*1.3+l.phase)*.014;l.flippers[1].rotation.z=l.wave?-.5+Math.sin(t*6)*.3:Math.sin(t*.7+l.phase)*.06;});swimmer.position.set(19.1+Math.sin(t*.15)*1.7,-1.04+Math.sin(t*.7)*.10,-5.8+Math.cos(t*.15)*1.7);swimmer.rotation.y=t*.15+Math.PI/2;swimRipple.position.set(swimmer.position.x,-.94,swimmer.position.z);bowls.forEach(b=>b.steam.children.forEach((p,i)=>{p.position.y=.43+((t*.16+i*.2)% .42);p.material.opacity=.3*(1-(p.position.y-.43)/.42);}));}};
}
