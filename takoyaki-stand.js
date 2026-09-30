// Reference: references/takoyaki_stand.jpg. All parts live in the same 3D world.
export function buildTakoyakiStand(H) {
  const { THREE, JT, B, sph, cyl, stick, mesh, CL, V, canvasTex, signTex, signPlane, glow, nightLight, register } = H;
  const g = new THREE.Group(); g.name = 'Neko takoyaki kitchen'; g.position.set(19, 0, 3); JT.add(g);
  const wood = '#cf9d70', darkWood = '#9e674a', cream = '#fff1d3', coral = '#df7866', blue = '#719fca';
  const line = (par, pts, radius, color) => mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => V(...p))), 24, radius, 6, false), CL(color), par);
  function octopus(parent, x, y, z, size = 1) {
    const o = new THREE.Group(); o.position.set(x, y, z); o.scale.setScalar(size); parent.add(o);
    sph(o, .22, '#ed9aa0', 0, .21, 0, 1, 1.12, .9);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; sph(o, .085, '#e98591', Math.cos(a) * .2, .025, Math.sin(a) * .18, 1, .7, 1.6, 12); }
    for (const s of [-1, 1]) { sph(o, .024, '#573b3c', s * .07, .25, .187); sph(o, .035, '#f7b7b0', s * .12, .17, .18, 1, .55, .2); }
    mesh(new THREE.TorusGeometry(.034, .012, 8, 16), '#b65d68', o, 0, .15, .21);
    return o;
  }
  function ball(parent, x, y, z, r, face = false) {
    const q = new THREE.Group(); q.position.set(x, y, z); parent.add(q);
    sph(q, r, CL('#efc37a'), 0, 0, 0, 1, .95, 1);
    sph(q, r, CL('#a56746'), 0, r * .63, 0, .94, .35, .9);
    for (let k = 0; k < 3; k++) {
      const xx = (k - 1) * r * .5;
      line(q, [[xx - r * .2, r * .76, -r * .55], [xx + r * .1, r * .93, 0], [xx - r * .05, r * .75, r * .58]], r * .04, '#fff5cf');
      const leaf = sph(q, r * .11, '#78a761', xx, r * .98, (k % 2 ? 1 : -1) * r * .25, 1.8, .25, .7, 10); leaf.rotation.y = k;
    }
    if (face) {
      for (const s of [-1, 1]) { sph(q, r * .075, '#71483b', s * r * .32, -.06 * r, r * .91, 1, 1.15, .35, 12); sph(q, r * .14, '#ee997e', s * r * .56, -r * .28, r * .81, 1, .6, .22, 12); }
      const smile = mesh(new THREE.TorusGeometry(r * .15, r * .028, 6, 18, Math.PI), '#975344', q, 0, -r * .22, r * .96); smile.rotation.z = Math.PI;
    }
    return q;
  }
  // Timber shell: the front stays open, so the entire roof can stay visible.
  B(g, 4.3, .13, 3.5, wood, 0, .01, 0, .045);
  B(g, 4.05, 2.72, .14, cream, 0, .12, -1.42, .025);
  B(g, .14, 2.72, 2.85, cream, 2, .12, -.05, .025);
  B(g, .14, 1.05, 2.8, cream, -2, .12, -.08, .025);
  for (let i = 0; i < 14; i++) B(g, .07, 1.06, .05, wood, -1.88 + i * .29, .14, -1.31, .008);
  for (const x of [-2, 2]) for (const z of [-1.4, 1.45]) B(g, .18, 2.94, .18, wood, x, .08, z, .025);
  for (const x of [-2.1, 2.1]) {
    for (let i = 0; i < 7; i++) B(g, .04, 1.08, .045, darkWood, x, .4, -.92 + i * .27, .008);
    for (let i = 0; i < 4; i++) B(g, .045, .045, 1.7, darkWood, x, .5 + i * .26, -.11, .008);
  }
  B(g, 4.12, 1.05, .84, cream, 0, .14, 1.17, .04);
  for (let i = 0; i < 16; i++) B(g, .06, .94, .03, wood, -1.96 + i * .26, .18, 1.606, .006);
  B(g, 4.42, .12, 1.02, coral, 0, 1.18, 1.22, .04);
  B(g, 4.33, .04, .09, '#f4b4a0', 0, 1.30, 1.73, .012);
  const plaque = signTex('ねこの たこ焼き', cream, '#754c43', 768, 160, 86);
  signPlane(g, plaque, 2.05, .43, -.3, .76, 1.642);
  for (const [i, txt] of ['焼きたて', '6こ入り'].entries()) signPlane(g, signTex(txt, '#fff8e4', '#815449', 128, 512, 64, true), .24, .92, 1.25 + i * .3, .7, 1.65);
  // Separate roof slopes with raised tile seams and wooden eaves.
  const roof = new THREE.Group(); g.add(roof);
  for (const side of [-1, 1]) {
    const slope = new THREE.Group(); slope.position.set(0, 3.25, side * .87); slope.rotation.x = side * .42; roof.add(slope);
    B(slope, 4.7, .13, 1.96, coral, 0, -.065, 0, .03);
    for (let row = 0; row < 4; row++) for (let col = 0; col < 12; col++) B(slope, .35, .035, .44, (row + col) % 3 ? '#e98b76' : '#efa18b', -2.12 + col * .385, .072, -.72 + row * .48, .02);
    for (let col = 0; col < 13; col++) B(slope, .035, .055, 1.95, '#f5bd97', -2.3 + col * .385, .10, 0, .009);
    for (const x of [-2.36, 2.36]) B(slope, .13, .18, 2.08, darkWood, x, -.07, 0, .025);
    B(slope, 4.9, .16, .13, wood, 0, -.05, side * .98, .025);
  }
  B(roof, 4.96, .20, .20, wood, 0, 3.66, 0, .04);
  for (const x of [-2.06, 2.06]) {
    stick(roof, V(x, 2.83, -1.72), V(x, 3.68, 0), .045, wood);
    stick(roof, V(x, 3.68, 0), V(x, 2.83, 1.72), .045, wood);
  }
  // Three smiling rooftop takoyaki, sauce, mayonnaise, leaves and a tiny octopus pick.
  B(roof, 3.7, .18, .72, darkWood, 0, 3.58, .48, .045);
  [-1.05, 0, 1.05].forEach((x, i) => { const q = ball(roof, x, 4.09 + (i === 1 ? .09 : 0), .54, .52, true); q.rotation.z = (i - 1) * -.10; });
  stick(roof, V(-1.15, 4.42, .4), V(-1.3, 5.09, .4), .022, '#cc9e65'); octopus(roof, -1.3, 5.03, .4, .65);
  // Blue split noren, with stitched cream borders.
  const curtains = [];
  ['た', 'こ', '焼', 'き'].forEach((text, i) => {
    const c = new THREE.Group(); c.position.set(-1.52 + i * 1.015, 2.83, 1.81); g.add(c); curtains.push(c);
    B(c, .96, .42, .035, blue, 0, -.42, 0, .028);
    signPlane(c, signTex(text, blue, '#fff1d3', 256, 256, 166), .33, .33, 0, -.19, .022);
    B(c, .85, .025, .042, '#f9e8c7', 0, -.39, .012, .008);
  });
  // Flag, octopus lantern and stools from the reference.
  cyl(g, .035, .035, 3.6, wood, -2.65, .08, 1.22, 10);
  const flagTex = signTex('たこ焼き', blue, '#fff0d3', 192, 768, 105, true);
  const flag = signPlane(g, flagTex, .57, 2.10, -2.31, 2.4, 1.23); flag.material.side = THREE.DoubleSide;
  octopus(g, -2.31, 3.42, 1.25, .48);
  const lantern = new THREE.Group(); lantern.position.set(2.23, 2.09, 1.62); g.add(lantern);
  const lm = glow('#ffcb89', .18, 1.25, '#eea773');
  sph(lantern, .30, lm, 0, 0, 0, 1, 1.2, 1);
  for (let i = -3; i <= 3; i++) { const y = i * .085, r = .299 * Math.sqrt(Math.max(.12, 1 - (y / .36) ** 2)); const t = mesh(new THREE.TorusGeometry(r, .009, 6, 24), '#d38259', lantern, 0, y, 0); t.rotation.x = Math.PI / 2; }
  cyl(lantern, .12, .12, .07, darkWood, 0, .34, 0); cyl(lantern, .12, .12, .06, darkWood, 0, -.40, 0);
  stick(g, V(2.23, 2.48, 1.62), V(2.23, 2.86, 1.62), .017, darkWood);
  for (const s of [-1, 1]) sph(lantern, .035, '#6a4440', s * .085, .04, .292, 1, 1, .3, 10);
  for (let i = 0; i < 7; i++) stick(lantern, V((i - 3) * .033, -.4, 0), V((i - 3) * .055, -.82, .01), .018, i % 2 ? '#df7c66' : '#ef9971');
  const stoolXs = [-1.32, 0, 1.32];
  stoolXs.forEach(x => {
    cyl(g, .31, .31, .13, '#f5d884', x, .63, 2.35, 28);
    cyl(g, .075, .09, .59, '#8b9baf', x, .08, 2.35, 12);
    const ring = mesh(new THREE.TorusGeometry(.21, .02, 7, 20), '#94a8b5', g, x, .25, 2.35); ring.rotation.x = Math.PI / 2;
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; stick(g, V(x, .4, 2.35), V(x + Math.cos(a) * .25, .06, 2.35 + Math.sin(a) * .25), .026, '#94a8b5'); }
    for (const s of [-1, 1]) sph(g, .025, '#9e764f', x + s * .1, .765, 2.49, 1, .25, 1, 8);
  });
  // Back shelves, bowls, ingredients, sauce bottles and hand tools.
  for (const y of [1.35, 2.03]) {
    B(g, 3.65, .08, .38, wood, 0, y, -1.12, .018);
    for (let i = 0; i < 6; i++) { cyl(g, .095, .09, .22, ['#b8d8c8', '#f0c295', '#f9e8c8'][i % 3], -1.35 + i * .48, y + .08, -1.12, 14); cyl(g, .099, .099, .04, darkWood, -1.35 + i * .48, y + .30, -1.12, 14); }
  }
  B(g, 1.78, .10, .72, '#525d6d', -.69, 1.31, 1.13, .045);
  const grillBalls = [];
  for (let z = 0; z < 3; z++) for (let x = 0; x < 6; x++) {
    const xx = -1.39 + x * .275, zz = .89 + z * .24;
    cyl(g, .108, .11, .025, '#323c4c', xx, 1.413, zz, 12);
    grillBalls.push(ball(g, xx, 1.474, zz, .088));
  }
  for (const [i, c] of ['#aa6c48', '#fff0c6'].entries()) { cyl(g, .09, .09, .27, c, .47 + i * .24, 1.3, 1.1, 16); cyl(g, .035, .08, .15, '#f6e2bf', .47 + i * .24, 1.57, 1.1, 14); }
  cyl(g, .18, .11, .18, '#afc8dc', -1.5, 1.3, .47, 20);
  sph(g, .155, '#f9e6c3', -1.5, 1.47, .47, 1, .14, 1);
  cyl(g, .105, .09, .20, '#e8ca9b', .99, 1.3, .6, 16);
  for (let i = 0; i < 5; i++) stick(g, V(.95 + i * .021, 1.45, .6), V(.90 + i * .045, 1.83, .62), .007, darkWood, 6);
  register(g, 1.52, 1.31, 1.06);
  // Warm bulbs under the eaves.
  const bulbMat = glow('#ffe4ac', .5, 2.3, '#fff5d9');
  for (const x of [-1.4, 0, 1.4]) { stick(g, V(x, 2.92, .8), V(x, 2.63, .8), .012, darkWood); sph(g, .07, bulbMat, x, 2.58, .8); }
  nightLight('#ffd49a', 4, 19, 2.15, 4.1, 6);

  // Cream-and-ginger cat chef, blue headband and apron, with a real turning pick.
  const cat = new THREE.Group(); cat.position.set(-1.0, 0, .72); g.add(cat);
  sph(cat, .35, '#f9e3be', 0, 1.20, 0, 1.02, 1.45, .85);
  B(cat, .54, .60, .055, blue, 0, .82, .28, .11);
  B(cat, .28, .19, .07, '#bcd6e8', 0, .94, .32, .04);
  for (const s of [-1, 1]) stick(cat, V(s * .2, 1.50, .18), V(s * .2, 1.18, .3), .023, '#c2dcef');
  const head = new THREE.Group(); head.position.set(0, 1.78, .05); cat.add(head);
  sph(head, .39, '#fff0d4', 0, 0, 0, 1.07, .94, .92);
  sph(head, .25, '#dfae7d', -.20, .12, -.12, .8, .85, .8);
  for (const s of [-1, 1]) {
    const ear = cyl(head, 0, .17, .36, '#f6dfb7', s * .27, .19, 0, 3); ear.rotation.z = -s * .22;
    const inner = cyl(head, 0, .10, .23, '#eebaa9', s * .27, .24, .055, 3); inner.rotation.z = -s * .22;
    sph(head, .035, '#65504b', s * .125, .015, .34, 1, 1.2, .38);
    sph(head, .057, '#f0b3a3', s * .23, -.09, .29, 1, .55, .28);
    line(head, [[s * .035, -.11, .369], [s * .085, -.14, .35], [s * .12, -.11, .338]], .010, '#977263');
    for (const yy of [-.025, .025]) stick(head, V(s * .24, -.10 + yy, .30), V(s * .43, -.12 + yy * 1.6, .29), .007, '#c1a58b');
  }
  sph(head, .033, '#d39689', 0, -.08, .373, 1, .7, .4);
  const band = mesh(new THREE.TorusGeometry(.36, .045, 8, 36), blue, head, 0, .17, 0); band.rotation.x = Math.PI / 2; band.scale.z = .82;
  for (const s of [-1, 1]) sph(head, .11, blue, .36 + s * .045, .15 + s * .055, -.11, 1, .48, .6);
  const paw = new THREE.Group(); paw.position.set(-.24, 1.46, .12); cat.add(paw);
  capsuleArm(paw, -.02, -.12, .18); stick(paw, V(0, -.10, .32), V(.34, -.25, .46), .014, darkWood);
  const otherPaw = new THREE.Group(); otherPaw.position.set(.26, 1.36, .16); cat.add(otherPaw); capsuleArm(otherPaw, 0, -.06, .16);
  function capsuleArm(parent, x, y, z) { sph(parent, .12, '#f6e6ca', x, y, z, .85, 1.05, 1.45); }
  const tail = line(cat, [[.2, 1, -.12], [.58, 1.1, -.2], [.63, 1.4, -.1]], .065, '#deae7f');
  const catPick = []; cat.traverse(m => { if (m.isMesh) catPick.push(m); });
  const steamTex = canvasTex(64, 64, (ctx, w, h) => { const gr = ctx.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h); });
  const steam = Array.from({ length: 7 }, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: .25, depthWrite: false })); g.add(s); return s; });
  return {
    root: g, roof, cat, catPick, ball,
    update(t, cooking = false) {
      const pace = cooking ? 5.2 : 2;
      paw.rotation.x = -.23 + Math.sin(t * pace) * .23; paw.rotation.z = Math.sin(t * pace * .65) * .28;
      head.rotation.z = Math.sin(t * 1.3) * .045; head.rotation.x = -.03 + Math.sin(t * .9) * .045;
      otherPaw.rotation.x = Math.sin(t * pace + 1) * .14; tail.rotation.y = Math.sin(t * 1.7) * .08;
      curtains.forEach((c, i) => c.rotation.x = Math.sin(t * 1.4 + i * .5) * .025);
      grillBalls.forEach((b, i) => { b.rotation.x = cooking ? Math.sin(t * 5 + i * .6) * .4 : 0; });
      steam.forEach((s, i) => { const p = (t * .32 + i / steam.length) % 1; s.position.set(-1.15 + (i % 4) * .31 + Math.sin(t + i) * .06, 1.6 + p * .7, 1.12); s.scale.setScalar(.10 + p * .32); s.material.opacity = Math.sin(p * Math.PI) * .28; });
    }
  };
}
