export const TOY_COLORS=['#d9a568','#ed8d92','#e8bb7c'];
export function buildToy(H,variant=0){
 const {THREE,sph,P,CL}=H,g=new THREE.Group();
 const ball=(r,m,x,y,z,sx=1,sy=1,sz=1)=>sph(g,r,m,x,y,z,sx,sy,sz,20);
 const shapeMesh=(shape,color,depth=.18)=>{const m=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.025,bevelThickness:.025,curveSegments:18}),P(color));m.position.z=-depth/2;m.castShadow=true;m.receiveShadow=true;g.add(m);return m;};
 if(variant===0){
  ball(.29,P('#c58d53'),0,.30,0,1,1,.38);ball(.275,P('#e7bb7c'),0,.305,.055,1,1,.28);
  for(const [x,y,r,angle] of [[-.16,.45,.034,.4],[.14,.44,.042,-.5],[-.20,.28,.04,.2],[.01,.33,.044,.8],[.18,.25,.033,-.3],[-.11,.12,.039,-.7],[.07,.10,.03,.1]]){const chip=ball(r,CL('#815943'),x,y,.128,.95,.8,.35);chip.rotation.z=angle;}
  for(const [x,y] of [[-.09,.48],[.02,.43],[-.12,.32],[.09,.26],[-.02,.20],[.19,.35]])ball(.009,P('#bc8c56'),x,y,.136,1,.75,.3);
 }else if(variant===1){
  const s=new THREE.Shape();s.moveTo(0,.035);s.bezierCurveTo(-.12,.08,-.30,.29,-.265,.43);s.bezierCurveTo(-.24,.59,-.08,.61,0,.55);s.bezierCurveTo(.08,.61,.24,.59,.265,.43);s.bezierCurveTo(.30,.29,.12,.08,0,.035);shapeMesh(s,'#eb858b',.19);
  for(const [x,y] of [[-.15,.43],[.03,.42],[.17,.4],[-.19,.30],[-.03,.29],[.13,.27],[-.09,.18],[.04,.13]])ball(.017,CL('#f7d69a'),x,y,.122,.6,1.45,.25).rotation.z=-x*2;
  for(const [x,a] of [[-.13,.9],[0,0],[.13,-.9]]){const leaf=ball(.10,P('#8bab74'),x,.565,-.015,.45,1.2,.24);leaf.rotation.z=a;}
 }else{
  const loaf=()=>{const s=new THREE.Shape();s.moveTo(-.24,.05);s.quadraticCurveTo(-.26,.02,-.26,.09);s.lineTo(-.26,.40);s.bezierCurveTo(-.36,.49,-.24,.65,-.08,.62);s.quadraticCurveTo(0,.66,.08,.62);s.bezierCurveTo(.24,.65,.36,.49,.26,.40);s.lineTo(.26,.09);s.quadraticCurveTo(.26,.02,.22,.05);s.closePath();return s;};
  shapeMesh(loaf(),'#c89661',.19);const crumb=shapeMesh(loaf(),'#fff0cb',.03);crumb.scale.set(.81,.80,1);crumb.position.set(0,.058,.108);
  for(const [x,y] of [[-.13,.20],[.12,.28],[-.10,.43],[.06,.50],[.04,.16]])ball(.012,P('#e0c69d'),x,y,.159,1,.75,.24);
 }
 // Eyes sit directly on the food, with no separate head, mouth, arms or legs.
 const eyeY=variant===2?.635:.59;
 for(const side of [-1,1]){ball(.086,CL('#fffaf0'),side*.085,eyeY,.095,1,1.12,.73);ball(.031,CL('#423a3d'),side*.085+.008,eyeY+.002,.154,1,1.13,.45);ball(.008,CL('#fffdf3'),side*.085+.001,eyeY+.016,.169,1,1,.4);}
 g.name=['Cookie Crumb plush','Strawberry Sprout plush','Toastie plush'][variant];return g;
}
export function toyIcon(index){
 const foods=[
 '<circle cx="35" cy="39" r="25" fill="#c99258"/><circle cx="35" cy="37" r="23" fill="#e8bb7c"/><g fill="#815943"><path d="m19 33 7-3 3 7-6 2z"/><path d="m41 31 7 3-3 6-6-3z"/><path d="m29 47 7-3 4 7-8 3z"/><circle cx="48" cy="48" r="3"/></g>',
 '<path d="M35 65C21 57 6 32 14 23c7-10 16-8 21-4 5-4 14-6 21 4 8 9-7 34-21 42" fill="#ed8d92"/><path d="m35 24-16-8 13 1 3-10 4 10 12-1z" fill="#8bab74"/><g fill="#ffe1a6"><ellipse cx="23" cy="35" rx="2" ry="3"/><ellipse cx="44" cy="36" rx="2" ry="3"/><ellipse cx="32" cy="43" rx="2" ry="3"/><ellipse cx="38" cy="54" rx="2" ry="3"/></g>',
 '<path d="M13 61V35C3 22 17 11 30 16c4-3 7-3 11 0 13-5 27 6 16 19v26z" fill="#c89661"/><path d="M19 55V32c-8-10 3-15 12-11 3-3 5-3 9 0 9-4 20 1 12 11v23z" fill="#fff0cb"/><g fill="#e0c69d"><circle cx="26" cy="42" r="2"/><circle cx="42" cy="34" r="2"/><circle cx="40" cy="50" r="1.5"/></g>'
 ];
 return `<svg viewBox="0 0 70 72" aria-hidden="true">${foods[index]}<ellipse cx="27" cy="18" rx="8" ry="9" fill="#fffaf0"/><ellipse cx="43" cy="18" rx="8" ry="9" fill="#fffaf0"/><g fill="#423a3d"><ellipse cx="29" cy="19" rx="3" ry="4"/><ellipse cx="45" cy="19" rx="3" ry="4"/></g></svg>`;
}
