// Open-front stationery shop, inspired by references/stationary_store_illustration.jpg.
export function buildStationeryStore(H) {
  const { THREE, JT, B, sph, cyl, stick, mesh, CL, V, canvasTex, signPlane, lsign, glow, nightLight, register } = H;
  const root = new THREE.Group(); root.position.set(40, 0, 2); root.name = 'Bichon stationery'; JT.add(root);
  const cream = '#fff4df', blue = '#9bc4ce', blueDark = '#729daa', wood = '#dbb887', trim = '#bd936d', pink = '#e8b8bc';
  const colors = ['#e8b3bd', '#9cc5dc', '#efd38b', '#b6cdb1', '#c3b2d3', '#ebbc9b'];
  // A permanent cutaway: no disappearing roof or front wall when zooming.
  B(root, 7.05, .13, 5.05, trim, 0, -.03, 0, .05);
  for (let row = 0; row < 13; row++) for (let col = 0; col < 4; col++) {
    const x = -2.62 + col * 1.75;
    B(root, 1.73, .035, .377, (row + col) % 3 ? '#e8ca98' : '#e2bd87', x, .10, -2.30 + row * .387, .008);
  }
  B(root, 7.05, 3.75, .16, cream, 0, .10, -2.46, .035);
  B(root, .16, 3.75, 4.8, cream, -3.45, .10, -.02, .035);
  B(root, .16, 1.02, 4.8, cream, 3.45, .10, -.02, .035);
  B(root, 7.08, .10, .24, trim, 0, 3.78, -2.46, .025);
  B(root, .24, .10, 4.9, trim, -3.45, 3.78, -.02, .025);
  B(root, 6.82, 1.35, .055, '#cfdbd5', 0, .13, -2.345, .005);
  for (let i = 0; i < 33; i++) B(root, .018, 1.35, .016, '#b5c6c3', -3.3 + i * .206, .13, -2.31, .003);
  B(root, 6.9, .055, .095, blueDark, 0, 1.49, -2.30, .014);
  B(root, .05, 1.35, 4.65, '#cfdbd5', -3.34, .13, -.02, .006);
  B(root, .09, .055, 4.66, blueDark, -3.32, 1.49, -.02, .015);
  // Narrow shop sign and fabric edge leave the interior visible from the street.
  for (const x of [-3.42, 3.42]) B(root, .14, 3.35, .14, trim, x, .13, 2.36, .025);
  B(root, 7.1, .13, .55, blue, 0, 3.43, 2.26, .035);
  for (let i = 0; i < 22; i++) B(root, .315, .11, .52, i % 2 ? '#f8efd9' : blue, -3.31 + i * .315, 3.44, 2.31, .022);
  B(root, 2.9, .62, .13, trim, 0, 3.36, 2.54, .09);
  signPlane(root, lsign('statTitle', '#fff3db', '#687f7d', 768, 160, 75), 2.75, .51, 0, 3.67, 2.616, 0, true);
  for (const x of [-2.9, 2.9]) { stick(root, V(x, 3.45, 2.3), V(x, 3.07, 2.3), .015, trim); sph(root, .09, glow('#ffe2a1', .4, 1.7, '#fff2cb'), x, 3.0, 2.3); }

  function book(par, x, y, z, color, height = .38, width = .085) {
    B(par, width, height, .32, color, x, y, z, .01);
    B(par, width * .55, .035, .012, '#fff4e3', x, y + height * .74, z + .166, .003);
  }
  function penCup(par, x, y, z, color, seed = 0) {
    cyl(par, .11, .09, .23, color, x, y, z, 16);
    cyl(par, .084, .084, .015, '#9a8977', x, y + .222, z, 16);
    for (let k = 0; k < 7; k++) {
      const p = new THREE.Group(); p.position.set(x + Math.cos(k * 2.4) * .065, y + .15, z + Math.sin(k * 2.4) * .05); p.rotation.z = (k - 3) * .07; par.add(p);
      cyl(p, .014, .014, .32 + (k % 3) * .035, colors[(k + seed) % 6], 0, 0, 0, 6);
      cyl(p, 0, .014, .065, '#e5c99d', 0, .32 + (k % 3) * .035, 0, 6);
    }
  }
  function tape(par, x, y, z, color) {
    const t = mesh(new THREE.TorusGeometry(.083, .032, 8, 20), color, par, x, y + .035, z); t.rotation.x = Math.PI / 2;
    const core = mesh(new THREE.TorusGeometry(.052, .008, 6, 20), '#fff1d5', par, x, y + .048, z); core.rotation.x = Math.PI / 2;
  }
  function drawers(x, z, width, depth, columns = 3) {
    B(root, width, 1.0, depth, blueDark, x, .15, z, .04);
    for (let row = 0; row < 2; row++) for (let i = 0; i < columns; i++) {
      const xx = x - width / 2 + (i + .5) * width / columns;
      B(root, width / columns - .07, .43, .04, blue, xx, .20 + row * .47, z + depth / 2 + .015, .025);
      B(root, .18, .04, .06, '#f4e9cf', xx, .48 + row * .47, z + depth / 2 + .055, .018);
    }
    B(root, width + .12, .10, depth + .12, wood, x, 1.15, z, .04);
  }
  // Cream shelving with pencil rows, notebooks, paper drawers and washi rolls.
  const shelfX = -2.03, shelfZ = -1.94;
  B(root, 2.34, 2.64, .12, '#dfceb7', shelfX, .14, shelfZ - .20, .025);
  for (const x of [shelfX - 1.15, shelfX + 1.15, shelfX]) B(root, .075, 2.7, .52, cream, x, .14, shelfZ, .015);
  for (const y of [.14, .65, 1.18, 1.72, 2.25, 2.82]) B(root, 2.38, .07, .56, cream, shelfX, y, shelfZ, .018);
  for (let row = 0; row < 4; row++) for (let i = 0; i < 11; i++) book(root, -1.90 + i * .085, .73 + row * .53, -1.92, colors[(i + row * 2) % 6], .34 + (i % 3) * .025, .062);
  for (let row = 0; row < 3; row++) for (let i = 0; i < 4; i++) { B(root, .48, .10, .36, colors[(i + row) % 6], -2.88 + i % 2 * .54, .25 + row * .14, -1.9, .025); }
  for (let i = 0; i < 9; i++) tape(root, -2.92 + (i % 3) * .27, 1.28 + Math.floor(i / 3) * .10, -1.83, colors[i % 6]);
  for (let i = 0; i < 4; i++) penCup(root, -2.89 + i * .25, 1.79, -1.9, colors[(i + 1) % 6], i);
  for (let i = 0; i < 4; i++) B(root, .21, .36, .31, colors[i], -2.9 + i * .26, 2.34, -1.88, .03);
  drawers(1.28, -1.85, 3.92, .85, 4);
  for (let i = 0; i < 6; i++) penCup(root, -.40 + i * .40, 1.25, -1.83, colors[i], i);
  B(root, 1.15, .60, .31, wood, 2.46, 1.25, -1.98, .02);
  B(root, 1.05, .46, .34, '#f5dfc8', 2.46, 1.33, -1.96, .01);
  for (let i = 0; i < 8; i++) book(root, 2.03 + i * .12, 1.35, -1.76, colors[i % 6], .37, .075);

  // Original little poster collection: bichon, cookie, flowers and colored paper.
  function poster(kind) {
    return canvasTex(256, 320, ctx => {
      ctx.fillStyle = ['#fce4d9', '#e8f0e2', '#e9e4f1', '#fff1cc'][kind % 4]; ctx.fillRect(0, 0, 256, 320);
      const dot = (x, y, r, c) => { ctx.fillStyle=c; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); };
      if (kind === 0) {
        for(let i=0;i<9;i++) dot(128+Math.cos(i*.7)*62,145+Math.sin(i*.7)*55,29,'#fffaf0');
        dot(128,153,66,'#fffaf0');dot(91,154,7,'#615c52');dot(163,154,7,'#615c52');dot(127,182,9,'#615c52');
        dot(74,179,12,'#e7b6b0');dot(181,179,12,'#e7b6b0');
        ctx.fillStyle=blue;ctx.fillRect(91,228,74,21);
      } else if(kind===1){
        dot(128,152,78,'#d5a078');for(let i=0;i<7;i++)dot(128+Math.cos(i*2.3)*57,150+Math.sin(i*2.3)*53,10,'#a06c50');
        dot(102,132,12,'#fffcf0');dot(149,132,12,'#fffcf0');dot(104,134,5,'#709b9c');dot(151,134,5,'#709b9c');
        ctx.fillStyle=pink;ctx.beginPath();ctx.arc(128,175,22,0,Math.PI);ctx.fill();
      } else {
        for(let y=0;y<4;y++)for(let x=0;x<3;x++){
          const xx=49+x*80, yy=54+y*70, c=colors[(x+y+kind)%6];
          if(kind===2){for(let i=0;i<5;i++)dot(xx+Math.cos(i*1.257)*13,yy+Math.sin(i*1.257)*13,11,c);dot(xx,yy,8,'#fff2cc');}
          else {ctx.fillStyle=c;ctx.fillRect(xx-25,yy-23,48,48);ctx.strokeStyle='#fff8eb';ctx.strokeRect(xx-18,yy-16,34,34);}
        }
      }
      ctx.fillStyle='#ab8b75';ctx.fillRect(78,284,100,3);ctx.fillRect(103,296,50,3);
    });
  }
  function framed(par, x, y, z, kind, w, h, ry = 0) {
    const f=new THREE.Group();f.position.set(x,y,z);f.rotation.y=ry;par.add(f);
    B(f,w+.07,h+.07,.055,trim,0,-h/2-.035,0,.012);B(f,w+.025,h+.025,.02,cream,0,-h/2-.012,.035,.005);
    signPlane(f,poster(kind),w,h,0,0,.05);return f;
  }
  framed(root,-2.02,3.30,-2.34,1,.60,.70);
  framed(root,-.36,2.85,-2.33,0,.90,1.08);
  framed(root,.80,2.90,-2.33,2,.82,1.01);
  framed(root,2.08,2.92,-2.33,3,1.05,1.15);
  framed(root,-3.345,2.61,-.71,3,.81,1.0,Math.PI/2);
  framed(root,-3.345,2.61,.45,0,.77,.95,Math.PI/2);
  // A blue door, tiny bulletin cards and pegboard charms on the left wall.
  const door=new THREE.Group();door.position.set(-3.345,0,1.61);door.rotation.y=Math.PI/2;root.add(door);
  B(door,.85,2.1,.05,trim,0,.14,0,.02);B(door,.72,1.98,.055,blue,0,.19,.02,.02);
  B(door,.54,.88,.02,'#ecf3e8',0,1.14,.055,.02);framed(door,0,1.58,.075,2,.34,.46);
  sph(door,.034,'#bc9659',.27,1.03,.095);
  for(let i=0;i<4;i++){const note=framed(root,2.85,2.43+i*.29,-2.32,2,.20,.22);note.rotation.z=(i%2-.5)*.13;}

  // Low display island and L-shaped blue checkout, with open notebook cubbies.
  drawers(-1.90, .90, 2.35, .85, 3);
  for(let i=0;i<3;i++)B(root,.65,.035,.61,cream,-2.64+i*.73,1.25,.90,.02);
  B(root,3.10,1.08,.075,blueDark,1.68,.14,.965,.025);
  B(root,3.10,.15,.85,blueDark,1.68,.14,1.35,.025);
  for(const x of[.16,1.19,2.22,3.20])B(root,.07,.95,.85,blueDark,x,.28,1.35,.015);
  B(root,3.24,.11,1.00,wood,1.68,1.22,1.35,.04);
  for(let i=0;i<3;i++){
    const x=.65+i*1.03;B(root,.90,.82,.06,'#dfe4d8',x,.27,1.02,.02);
    B(root,.93,.055,.44,wood,x,.30,1.64,.012);
    for(let k=0;k<7;k++)book(root,x-.36+k*.12,.36,1.65,colors[(i+k)%6],.55+(k%2)*.12,.08);
  }
  drawers(3.01,-.20,.47,2.90,1);
  penCup(root,2.81,1.33,1.43,pink,1);penCup(root,.38,1.33,1.25,cream,3);
  register(root,2.12,1.33,1.39);
  const parcel=new THREE.Group();parcel.position.set(1.14,1.33,1.31);root.add(parcel);parcel.visible=false;
  B(parcel,.53,.40,.30,'#eed6af',0,0,0,.04);B(parcel,.06,.40,.315,blue,0,0,0,.006);
  const handle=mesh(new THREE.TorusGeometry(.11,.017,6,20,Math.PI),trim,parcel,0,.39,0);handle.rotation.z=0;
  for(const x of[-2.40,-1.38]){
    cyl(root,.26,.26,.12,wood,x,.65,2.20,22);
    for(const s of[-1,1])for(const z of[-1,1])stick(root,V(x+s*.13,.65,2.20+z*.13),V(x+s*.20,.12,2.20+z*.20),.028,trim);
    const ring=mesh(new THREE.TorusGeometry(.18,.016,6,20),trim,root,x,.36,2.20);ring.rotation.x=Math.PI/2;
  }
  // Small sticker stand near the entry, with a real freestanding frame.
  const rack=new THREE.Group();rack.position.set(-2.85,0,1.83);root.add(rack);
  for(const x of[-.39,.39])B(rack,.065,1.67,.075,cream,x,.13,0,.015);
  for(let row=0;row<3;row++){
    B(rack,.85,.06,.28,pink,0,.48+row*.45,0,.02);
    for(let k=0;k<3;k++)signPlane(rack,poster((k+row)%4),.21,.29,-.27+k*.27,.68+row*.45,.02);
  }
  // Bichon shopkeeper: rounded clay curls, floppy ears and a blue work apron.
  const dog=new THREE.Group();dog.position.set(1.13,.13,.40);root.add(dog);
  sph(dog,.31,'#f7f0df',0,1.09,0,1.10,1.34,.95);
  B(dog,.52,.59,.09,blue,0,.72,.25,.10);B(dog,.24,.18,.04,'#d5e4dc',0,.80,.313,.04);
  for(const s of[-1,1])stick(dog,V(s*.19,1.42,.10),V(s*.19,1.12,.29),.028,blueDark);
  const head=new THREE.Group();head.position.set(0,1.83,.035);dog.add(head);
  sph(head,.40,'#fff8e9',0,0,0,1.05,.99,.89);
  for(let i=0;i<11;i++){const a=i*Math.PI*2/11;sph(head,.14,'#fff8e9',Math.cos(a)*.31,Math.sin(a)*.30,-.015,1,1,.90,14);}
  for(const s of[-1,1]){
    sph(head,.19,'#e9e2d3',s*.37,-.075,-.015,.8,1.35,.9);
    for(let i=0;i<3;i++)sph(head,.105,'#fff8e9',s*(.37+(i%2)*.035),.04-i*.105,.07,1,1,1,12);
    sph(head,.085,'#fffdf1',s*.083,-.105,.333,1.30,.83,.76);
    sph(head,.035,'#4f4e48',s*.127,.015,.334,1,1.08,.45,14);
    sph(head,.056,'#efc1b7',s*.225,-.094,.275,1,.45,.34,12);
  }
  sph(head,.044,'#56534c',0,-.077,.402,1,.73,.66,14);
  const smile=mesh(new THREE.TorusGeometry(.044,.009,6,14,Math.PI),'#827565',head,0,-.137,.366);smile.rotation.z=Math.PI;
  for(const s of[-1,1])sph(dog,.105,pink,s*.067,1.48,.30,1,.56,.44,14);
  sph(dog,.038,'#d399a4',0,1.48,.335);
  const paws=[];
  for(const s of[-1,1]){
    const arm=new THREE.Group();arm.position.set(s*.27,1.29,.10);dog.add(arm);
    stick(arm,V(0,0,0),V(s*.015,-.12,.23),.083,'#f8f1e2',12);
    sph(arm,.105,'#fff8e9',s*.015,-.12,.26,1,.78,1,14);paws.push(arm);
  }
  const tail=new THREE.Group();tail.position.set(.29,1.0,-.15);dog.add(tail);
  for(let i=0;i<4;i++)sph(tail,.085,'#fff8e9',i*.047,.04+Math.sin(i*.6)*.12,-i*.035,1,1,1,12);
  for(const s of[-1,1])sph(dog,.12,'#f6edde',s*.18,.52,.055,1,.75,1.2);
  const dogPick=[];dog.traverse(o=>{if(o.isMesh)dogPick.push(o);});
  nightLight('#ffddad',4.5,40,2.3,2.0,7);
  let packing=0,greeting=0;
  return {root,dogPick,
    greet(){greeting=2.4;},
    pack(){packing=2.5;parcel.visible=true;},
    update(t,dt){
      packing=Math.max(0,packing-dt);greeting=Math.max(0,greeting-dt);
      const busy=packing>0;
      head.rotation.z=Math.sin(t*1.4)*.045;head.rotation.x=busy?.12+Math.sin(t*5)*.06:Math.sin(t*.8)*.035;
      paws[0].rotation.x=busy?-.10+Math.sin(t*7)*.18:greeting>0?-.9+Math.sin(t*8)*.15:Math.sin(t*1.8)*.055;
      paws[0].rotation.z=greeting>0?.3:0;
      paws[1].rotation.x=busy?Math.sin(t*7+1.4)*.16:Math.sin(t*1.8+1)*.055;
      tail.rotation.y=Math.sin(t*(busy?9:4))*.26;
      parcel.visible=busy;parcel.position.y=1.33+(busy?Math.abs(Math.sin(t*5))*.028:0);
    }
  };
}
