import {buildTeaTables} from './tea-models.js?v=20260929-tea4';
const WORDS={zh:{area:'中国城',china:'牌楼街口',lantern:'灯笼小街',tea:'春和茶馆',enter:'走进灯笼街',teaIn:'进茶馆坐坐',back:'回灯笼街',brew:'泡一壶桂花茶',brewing:'茶香慢慢散开…',ready:'桂花茶泡好了，坐一会儿吧。',invite:'叫朋友过来',hint:'绿瓦牌楼、红灯笼，慢慢走进小街。',teaHint:'点茶壶泡茶，也可以转动镜头看看茶馆。',photo:'在这里拍立得'},en:{area:'Chinatown',china:'Gateway',lantern:'Lantern Lane',tea:'Spring Harmony Tea',enter:'Walk down the lane',teaIn:'Visit the tea house',back:'Back to the lane',brew:'Brew osmanthus tea',brewing:'The tea is steeping…',ready:'Your tea is ready. Stay a little while.',invite:'Invite a friend',hint:'Green tiles, red lanterns, a little street to explore.',teaHint:'Tap the teapot to brew; turn the camera to explore.',photo:'Take a Polaroid here'},ja:{area:'チャイナタウン',china:'牌楼の入口',lantern:'ランタン通り',tea:'春和茶館',enter:'通りを歩く',teaIn:'茶館でひと休み',back:'通りに戻る',brew:'キンモクセイ茶を淹れる',brewing:'お茶の香りが広がる…',ready:'お茶が入りました。ゆっくりどうぞ。',invite:'友だちを呼ぶ',hint:'緑の瓦と赤いランタン。路地を歩こう。',teaHint:'急須をタップしてお茶を淹れよう。',photo:'ここでチェキ'}};
export const CHINA_SPACES=['china','lantern','tea','teaPatio'];
export function chinaWords(lang){return WORDS[lang]||WORDS.zh;}
export function buildChinatown(H){
 const {THREE,scene,B,sph,cyl,stick,mesh,CL,V,canvasTex,glow}=H,root=new THREE.Group();root.position.set(-31,0,0);scene.add(root);
 const picks=[],lanterns=[],travelPick=[];
 const colors={green:'#659886',jade:'#94b6a2',dark:'#385e55',red:'#be6158',gold:'#dbb779',stone:'#e5dcd1',wood:'#926b52',cream:'#f2dfbf'};
 function group(parent,x=0,y=0,z=0,ry=0){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;parent.add(g);return g;}
 function label(parent,text,w,h,x,y,z,bg='#42645d',fg='#fae6b4',font=58){const t=canvasTex(512,160,g=>{g.fillStyle=bg;g.fillRect(0,0,512,160);g.strokeStyle=fg;g.lineWidth=5;g.strokeRect(9,9,494,142);g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';g.font=`bold ${font}px "PingFang SC",serif`;g.fillText(text,256,82,460);});return mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,roughness:.85}),parent,x,y,z);}
 function roof(parent,w,d,y){const g=group(parent,0,y,0),n=20,m=8,pos=[],idx=[];
  function point(x,z){return [x,.24+1.0*(1-Math.abs(z)/(d/2))+.32*Math.pow(Math.abs(x)/(w/2),8)+.16*Math.pow(Math.abs(z)/(d/2),8),z];}
  for(let j=0;j<=m;j++)for(let i=0;i<=n;i++)pos.push(...point((i/n-.5)*w,(j/m-.5)*d));
  for(let j=0;j<m;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i;idx.push(a,a+1,a+n+1,a+1,a+n+2,a+n+1);}
  // Close the roof edges down to its support beams so close views never show floating tiles.
  const edge=[];for(let i=0;i<=n;i++)edge.push(point((i/n-.5)*w,-d/2));for(let j=1;j<=m;j++)edge.push(point(w/2,(j/m-.5)*d));for(let i=n-1;i>=0;i--)edge.push(point((i/n-.5)*w,d/2));for(let j=m-1;j>0;j--)edge.push(point(-w/2,(j/m-.5)*d));
  const walls=[];for(let i=0;i<edge.length;i++){const a=edge[i],b=edge[(i+1)%edge.length];walls.push(...a,...b,b[0],0,b[2],...a,b[0],0,b[2],a[0],0,a[2]);}
  const underside=new THREE.BufferGeometry();underside.setAttribute('position',new THREE.Float32BufferAttribute(walls,3));underside.computeVertexNormals();const underMat=CL(colors.dark).clone();underMat.side=THREE.DoubleSide;mesh(underside,underMat,g);
  B(g,w*.9,.12,d*.9,colors.red,0,0,0);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();const mat=CL(colors.green).clone();mat.side=THREE.DoubleSide;mesh(geo,mat,g);
  for(let i=0;i<=Math.ceil(w/.22);i++){const x=-w/2+i*w/Math.ceil(w/.22),pts=[];for(let j=0;j<=m;j++)pts.push(V(...point(x,(j/m-.5)*d)).add(V(0,.04,0)));mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),16,.045,5,false),i%3===0?colors.jade:colors.green,g);}
  for(const z of [-d/2,d/2]){const pts=[];for(let i=0;i<=16;i++)pts.push(V(...point((i/16-.5)*w,z)));mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),16,.08,6),colors.dark,g);}
  stick(g,V(-w/2,1.2,0),V(w/2,1.2,0),.09,colors.jade);
  for(const s of [-1,1]){const pts=[V(s*(w/2-.7),1.23,0),V(s*(w/2-.3),1.4,0),V(s*w/2,1.7,0)];mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),12,.07,6),colors.jade,g);}
  return g;
 }
 function lantern(parent,x,y,z,size=.45){const pivot=group(parent,x,y,z);lanterns.push(pivot);stick(pivot,V(0,.45*size,0),V(0,.8*size,0),.018,'#5c514b');
  sph(pivot,size,glow('#e4a366',.08,.55,colors.red),0,0,0,1,.8,1,20);
  const ribs=[],ri=[];for(let rib=0;rib<8;rib++)for(let k=0;k<=12;k++)for(const side of [-1,1]){const theta=.08+(Math.PI-.16)*k/12,a=rib*Math.PI/4+side*.009,r=Math.sin(theta)*(size+.005);ribs.push(Math.cos(a)*r,Math.cos(theta)*size*.8,Math.sin(a)*r);if(k<12&&side===-1){const n=rib*26+k*2;ri.push(n,n+1,n+2,n+1,n+3,n+2);}}
  const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.Float32BufferAttribute(ribs,3));rg.setIndex(ri);rg.computeVertexNormals();mesh(rg,colors.gold,pivot);
  for(const sy of [-1,1])cyl(pivot,size*.38,size*.38,size*.10,colors.gold,0,sy*size*.78-size*.05,0,12);
  for(let i=0;i<6;i++){const a=i*Math.PI/3;stick(pivot,V(Math.cos(a)*size*.27,-size*.82,Math.sin(a)*size*.27),V(Math.cos(a)*size*.19,-size*1.32,Math.sin(a)*size*.19),.012,colors.gold,4);}
  return pivot;
 }
 function pick(g,space){g.traverse(m=>{if(m.isMesh){m.userData.chinaSpace=space;picks.push(m);}});}
 // Brick paving and inset diamonds run from the gateway down the lantern lane.
 const paving=canvasTex(256,256,g=>{g.fillStyle='#d9bdb0';g.fillRect(0,0,256,256);for(let row=0;row<8;row++)for(let col=-1;col<5;col++){g.fillStyle=(row+col)%3?'#e3cdbd':'#d2b6a6';g.fillRect(col*64+(row%2)*32+2,row*32+2,60,28);}},[4,9]);
 const pavement=new THREE.Mesh(new THREE.PlaneGeometry(21,25),new THREE.MeshStandardMaterial({map:paving,roughness:1}));pavement.rotation.x=-Math.PI/2;pavement.position.set(0,.008,1);root.add(pavement);H.walkSurf.push(pavement);
 B(root,6.1,.065,22,'#efdcc4',0,-.025,0);for(const x of [-3.12,3.12])B(root,.15,.12,22,colors.stone,x,0,0,.02);
 for(let z=-9;z<10;z+=1.3){const tile=B(root,.18,.009,.18,'#bd8b76',0,.05,z);tile.rotation.y=Math.PI/4;}
 const link=new THREE.Mesh(new THREE.PlaneGeometry(10,1.4),CL('#e4cfc0'));link.rotation.x=-Math.PI/2;link.position.set(-16,.01,6.15);scene.add(link);H.walkSurf.push(link);
 const gate=group(root,0,0,9);
 for(const x of [-4.5,-2.45,2.45,4.5]){B(gate,.64,3.65,.76,colors.stone,x,.08,0,.03);B(gate,.8,.2,.94,'#c5baac',x,.04,0,.02);for(let y=.4;y<3.5;y+=.42)B(gate,.653,.024,.78,'#bfb5a7',x,y,0);}
 B(gate,5.55,.35,.6,colors.red,0,3.48,0,.035);B(gate,5.8,.22,.8,colors.gold,0,3.84,0,.025);
 for(let x=-2.4;x<2.7;x+=.52){B(gate,.20,.35,.72,colors.dark,x,3.91,0,.03);B(gate,.38,.15,.84,colors.red,x,4.18,0,.025);}
 roof(gate,6.7,2.4,4.35);for(const x of [-3.5,3.5]){const wing=group(gate,x,0,0);B(wing,2.3,.25,.72,colors.red,0,2.82,0);roof(wing,2.8,1.85,3.0);}
 label(gate,'四 海 一 家',2.65,.64,0,3.55,.45,'#365a69',colors.gold,62);label(gate,'CHINATOWN',2.0,.32,0,3.02,.45,'#963f3e','#f8ddb2',37);
 // Two little stone guardians, with curls, paws and individual noses.
 for(const s of [-1,1]){const lion=group(gate,s*5.22,0,.85);B(lion,.88,.35,.9,'#d0c6b6',0,.02,0,.03);sph(lion,.3,colors.stone,0,.65,0,1,1.1,.8);sph(lion,.32,colors.stone,0,1.1,.1);for(let i=0;i<7;i++)sph(lion,.105,'#d8cdba',Math.cos(i)*.26,1.1+Math.sin(i)*.26,.11);for(const x of [-.13,.13]){sph(lion,.07,colors.dark,x,1.17,.38,1,1,.4);sph(lion,.13,colors.stone,x,.45,.21);}sph(lion,.12,'#b6ad9e',0,1.02,.39,1.3,.7,.7);}
 pick(gate,'china');
 function storefront(x,z,ry,color,name,sub){const g=group(root,x,0,z,ry);g.name='chinatown storefront';B(g,4.2,5.6,3.0,color,0,0,0,.05);B(g,4.35,.18,3.15,colors.cream,0,2.9,0,.02);roof(g,4.6,3.4,5.55);
  for(const wx of [-1.2,0,1.2]){B(g,.78,1.35,.06,colors.dark,wx,3.6,1.52,.03);B(g,.62,1.17,.07,'#c6dccc',wx,3.69,1.56,.02);B(g,.05,1.17,.09,colors.cream,wx,3.69,1.60);B(g,.62,.05,.09,colors.cream,wx,4.24,1.60);}
  B(g,4,.06,.60,colors.dark,0,3.1,1.7);for(let i=0;i<15;i++)B(g,.04,.55,.04,colors.red,-1.92+i*.27,3.16,1.98);B(g,4,.05,.08,colors.red,0,3.68,1.98);
  B(g,3.8,2.25,.04,colors.dark,0,.15,1.52);B(g,3.45,1.35,.04,'#f0d9af',0,.65,1.56);
  for(const xx of [-1.72,0,1.72])B(g,.07,2.05,.06,colors.wood,xx,.25,1.61);label(g,name,3.6,.62,0,2.50,1.63);label(g,sub,2.9,.30,0,.36,1.64,'#ecd8b7','#795c47',34);
  const aw=B(g,4,.12,.95,colors.green,0,2.25,1.9,.03);aw.rotation.x=.18;
  for(const xx of [-1.45,1.45])lantern(g,xx,1.85,2.35,.27);
  for(let i=0;i<6;i++){cyl(g,.14,.12,.22,['#b19a79','#dba779','#a8baa1'][i%3],-1.36+i*.52,.77,1.72,10);sph(g,.14,'#f2d7a9',-1.36+i*.52,1.06,1.72,1,.8,1,10);}
  return g;
 }
 storefront(-6.9,4,Math.PI/2,'#ead6bc','锦 记 杂 货','PANTRY & LITTLE TREASURES');storefront(-6.9,-1.2,Math.PI/2,'#c3d3bb','花 好 月 圆','FLOWERS & GIFTS');storefront(-6.9,-6.7,Math.PI/2,'#e6c6b5','祥 云 点 心','FRESH BUNS · DAILY');
 storefront(6.9,4,-Math.PI/2,'#d9cdb3','福 禄 小 铺','NEIGHBOURHOOD MARKET');storefront(6.9,-7,-Math.PI/2,'#c7d5cd','书 香 阁','BOOKS & POSTCARDS');
 storefront(0,-12.2,0,'#dfcdb6','同 心 会 馆','A LITTLE PLACE TO BELONG');
 // Canopy strings sag between the balconies, each lantern gently swaying.
 for(const z of [6,2,-2,-6,-9]){const pts=[V(-4.55,5.1,z),V(0,4.5,z),V(4.55,5.1,z)];mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),18,.019,4),colors.dark,root);for(let i=0;i<5;i++){if(z===6&&i===2)continue;const x=-3.5+i*1.75,y=4.50+.6*(x/4.55)**2;lantern(root,x,y-.45,z,.35);}}
 for(const x of [-2.5,2.5]){B(root,1.35,.10,.5,colors.wood,x,.50,-8.5,.04);for(const dx of [-.45,.45])B(root,.12,.5,.37,colors.dark,x+dx,0,-8.5);}
 // Open-front tea house. Its roof lifts away for the interior view.
 const tea=group(root,6,0,-1.5,-Math.PI/2);B(tea,5.5,.15,4.5,colors.wood,0,.01,0,.03);B(tea,5.5,3.35,.16,colors.cream,0,.16,-2.18);B(tea,.14,3.35,4.5,colors.cream,2.68,.16,0);
 for(const x of [-2.63,2.63])B(tea,.16,3.45,.16,colors.dark,x,.15,2.15,.02);
 for(const x of [-1.65,0,1.65]){B(tea,1.35,1.5,.06,colors.wood,x,1.4,-2.07);B(tea,1.19,1.34,.07,'#c8dac4',x,1.48,-2.03);for(let k=0;k<4;k++){B(tea,.035,1.34,.07,colors.wood,x-.45+k*.3,1.48,-1.98);B(tea,1.19,.035,.07,colors.wood,x,1.5+k*.43,-1.98);}}
 const teaRoof=roof(tea,6,5,3.65),teaHeader=group(tea);B(teaHeader,5.7,.25,.3,colors.dark,0,3.22,2.2);label(teaHeader,'春 和 茶 馆',2.7,.60,0,2.96,2.38);lantern(teaHeader,-2.2,2.7,2.42,.30);lantern(teaHeader,2.2,2.7,2.42,.30);
 // Shelves of labelled tea tins, a serving counter and hanging scrolls.
 B(tea,4.8,.68,.65,'#ad8465',0,.16,-1.65,.035);B(tea,4.95,.07,.77,'#eed3a5',0,.84,-1.65,.02);
 for(let i=0;i<9;i++){const x=-2.1+i*.52;cyl(tea,.14,.14,.25,['#6e998a','#ddc299','#ca8f7a'][i%3],x,.91,-1.65,12);label(tea,['茶','春','香'][i%3],.15,.17,x,1.02,-1.50,'#f4e5c8','#5e7665',70);}
 for(let i=0;i<17;i++)B(tea,5.3,.005,.012,'#b38c66',0,.163,-2.08+i*.25);
 const rug=mesh(new THREE.CircleGeometry(1.45,40),CL('#a7b9a3'),tea,0,.168,.25);rug.rotation.x=-Math.PI/2;
 const scroll=label(tea,'茶 · 静',.48,1.1,-2.2,2.06,-1.96,'#f8eacb','#717b63',58);
 for(const x of [-2.1,2.1]){cyl(tea,.19,.15,.26,'#bea083',x,.16,1.3,12);for(let j=0;j<5;j++){stick(tea,V(x,.4,1.3),V(x+(j-2)*.08,1.0+j*.1,1.3),.017,'#75a389');sph(tea,.12,'#8db39a',x+(j-2)*.08,1+j*.1,1.3,.4,1,.6,8);}}
 const teaSets=buildTeaTables(H,tea,root);
 // A large doorway hit area is useful from the lane; close-up clicks reach the teapot.
 const hit=new THREE.Mesh(new THREE.BoxGeometry(5.3,3.1,.10),new THREE.MeshBasicMaterial({visible:false}));hit.position.set(0,1.7,2.3);tea.add(hit);hit.userData.chinaSpace='tea';picks.push(hit);
 const gateHit=new THREE.Mesh(new THREE.BoxGeometry(9,4,.2),new THREE.MeshBasicMaterial({visible:false}));gateHit.position.set(0,2,9);root.add(gateHit);gateHit.userData.chinaSpace='lantern';travelPick.push(gateHit);
 const api={root,gate,tea,picks,travelPick,teaSets,update(dt,t,space){teaRoof.visible=teaHeader.visible=space!=='tea';lanterns.forEach((g,i)=>g.rotation.z=Math.sin(t*.8+i)*.035);teaSets.update(dt,t);},photoScene(place){const g=new THREE.Group();if(place==='lantern'){
    const facades=root.children.filter(c=>c.name==='chinatown storefront');for(const [i,s] of [[0,-1],[3,1]]){const c=facades[i].clone(true);c.scale.setScalar(.44);c.position.set(s*2.3,0,-.8);c.rotation.y=-s*.38;g.add(c);}
    for(let i=0;i<3;i++){const lamp=lanterns.find(l=>l.parent===root).clone(true);lamp.position.set((i-1)*1.55,3.0+Math.abs(i-1)*.18,-.6);lamp.scale.setScalar(.85);g.add(lamp);}
    stick(g,V(-2.4,3.5,-.6),V(2.4,3.5,-.6),.013,colors.dark);
  }else{const c=gate.clone(true);c.position.set(0,0,0);c.scale.setScalar(.47);g.add(c);}return g;}};return api;
}
export function createChinatownUI(H,model){
 const bar=document.createElement('section');bar.id='chinaBar';bar.className='panel';document.querySelector('#bottom').prepend(bar);
 const tr=k=>chinaWords(H.lang())[k];
 const patio=()=>H.lang()==='zh'?'灯笼下喝早茶':H.lang()==='ja'?'ランタンの下で飲茶':'Tea under the lanterns';
 function refresh(){const s=H.location();bar.hidden=!['china','lantern'].includes(s.space)||s.mode!=='orbit';if(bar.hidden)return;bar.innerHTML=`<b>${tr(s.space)}</b><p>${tr('hint')}</p><div><button class="pill main" data-china="${s.space==='china'?'lantern':'tea'}">${tr(s.space==='china'?'enter':'teaIn')}</button>${s.space==='lantern'?`<button class="chip" data-china="teaPatio">${patio()}</button>`:''}<button class="chip" data-china="photo">${tr('photo')}</button></div><div class="china-friends"><span>${tr('invite')}</span>${[0,1,2].map(i=>`<button class="chip" data-china="friend:${i}">${H.name(i)}</button>`).join('')}</div>`;}
 bar.addEventListener('click',e=>{const a=e.target.closest('[data-china]')?.dataset.china;if(!a||H.busy())return;if(a==='photo')H.photo();else if(a.startsWith('friend:'))H.invite(+a.slice(7));else H.go(a);});
 function handleRay(ray){if(H.busy())return false;const hit=ray.intersectObjects([...model.travelPick,...model.picks],false)[0];if(hit){H.go(hit.object.userData.chinaSpace);return true;}return false;}
 return {refresh,handleRay};
}
