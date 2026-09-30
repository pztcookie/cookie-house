// A little tea counter inspired by references/matcha_shop_illustration.jpg.
// Desserts and the rabbit belong to the same clay world as the other shops.
export const MATCHA_MENU = [
  { id: 'cake', price: 5, names: ['抹茶千层蛋糕', 'Matcha layer cake', '抹茶ミルクレープ'] },
  { id: 'latte', price: 4, names: ['抹茶拿铁', 'Matcha latte', '抹茶ラテ'] },
  { id: 'taiyaki', price: 6, names: ['抹茶鲷鱼烧雪糕', 'Taiyaki soft serve', 'たい焼き抹茶ソフト'] },
];

export function buildMatchaShop(H) {
  const { THREE, JT, B, sph, cyl, stick, mesh, CL, V, signTex, signPlane, lsign, glow } = H;
  const g = new THREE.Group(); g.position.set(25.25, 0, 2); JT.add(g);
  const teaLabel = signTex('葉', '#f3eacb', '#597958', 128, 128, 78);
  const cream = '#fff3d6', tea = '#91b277', deep = '#597958', wood = '#c69a6b', pale = '#cbdcba';
  const line = (p, pts, r, c) => mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(q => V(...q))), 24, r, 6, false), CL(c), p);
  function dessert(id) {
    const d = new THREE.Group(), portions = [];
    if (id === 'cake') {
      // Three actual slices disappear one at a time as the guest eats.
      for (let i = 0; i < 3; i++) {
        const s = new THREE.Group(); s.position.x = (i - 1) * .14; d.add(s); portions.push(s);
        for (let k = 0; k < 7; k++) B(s, .134, .047, .36, k % 2 ? '#f6eac8' : tea, 0, k * .047, 0, .006);
        for (let k = 0; k < 3; k++) sph(s, .034, '#f9efd5', 0, .345, -.1 + k * .1, 1, .75, 1, 10);
      }
      const leaf = sph(d, .07, deep, .04, .393, -.04, 1.3, .15, .6, 12); leaf.rotation.y = .6; d.userData.garnish = leaf;
    } else if (id === 'latte') {
      cyl(d, .15, .12, .42, '#f3eacb', 0, 0, 0, 28);
      const liquid = cyl(d, .146, .125, .25, tea, 0, .025, 0, 28); portions.push(liquid);
      cyl(d, .16, .16, .04, '#fff7df', 0, .415, 0, 28);
      cyl(d, .148, .148, .013, pale, 0, .454, 0, 28);
      const leaf = sph(d, .053, deep, 0, .469, 0, .55, .08, 1.4, 12); leaf.rotation.y = -.6;
      const h = mesh(new THREE.TorusGeometry(.10, .026, 8, 20), cream, d, .16, .23, 0); h.scale.y = 1.1;
      signPlane(d, teaLabel, .12, .12, 0, .30, .149);
    } else {
      // Golden fish cup, waffle scales, little eye, and a matcha spiral.
      sph(d, .20, '#dbac66', 0, .24, 0, .86, 1.15, .54);
      const tail = mesh(new THREE.ConeGeometry(.14, .19, 3), '#e7bb78', d, 0, .015, 0); tail.rotation.z = Math.PI;
      for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) {
        const a = mesh(new THREE.TorusGeometry(.034, .006, 5, 10, Math.PI), '#b8874e', d, (col - 1) * .075, .10 + row * .067, .101); a.rotation.z = -.2;
      }
      sph(d, .018, '#705039', .087, .36, .093, 1, 1, .35, 10);
      for (let k = 0; k < 3; k++) {
        const pts = Array.from({ length: 25 }, (_, n) => { const a = n / 24 * Math.PI * 2, r = .145 - k * .041 - n / 24 * .022; return [Math.cos(a) * r, .44 + k * .09 + n / 24 * .085, Math.sin(a) * r]; });
        portions.push(line(d, pts, .058 - k * .008, k % 2 ? '#b3cc8e' : tea));
      }
      d.userData.garnish = sph(d, .04, tea, .017, .755, 0, .7, 1.2, .7, 10);
    }
    d.userData.portions = portions;
    return d;
  }
  function setBites(d, n) {
    const ps = d.userData.portions; if (d.userData.garnish) d.userData.garnish.visible = n === 0;
    if (ps.length === 1) ps[0].scale.y = Math.max(.06, 1 - n / 3);
    else ps.forEach((p, i) => p.visible = i < 3 - n);
    // Cream garnish goes with the last bite, but cups remain on the table.
    if (ps.length > 1 && n === 3) d.visible = false;
  }
  function plate(id) {
    const p = new THREE.Group();
    cyl(p, .37, .34, .055, '#f5eed7', 0, 0, 0, 32);
    const rim = mesh(new THREE.TorusGeometry(.33, .014, 8, 32), tea, p, 0, .059, 0); rim.rotation.x = Math.PI / 2;
    const food = dessert(id); food.position.y = .065; p.add(food);
    if (id === 'taiyaki') food.rotation.z = .15;
    return { root: p, food };
  }
  function handheld(id) {
    const p = new THREE.Group();
    let tip, food = null;
    if (id === 'cake') {
      stick(p, V(0, -.15, 0), V(0, .07, 0), .014, '#d9c9aa');
      for (const x of [-.028, 0, .028]) stick(p, V(x, .025, 0), V(x, .10, 0), .006, '#dfd1b7');
      B(p, .09, .065, .075, tea, 0, .06, 0, .006); B(p, .09, .012, .078, cream, 0, .081, 0, .003);
      tip = V(0, .10, 0);
    } else {
      const f = dessert(id); food = f; f.scale.setScalar(id === 'latte' ? .62 : .58); p.add(f);
      tip = V(0, id === 'latte' ? .285 : .44, .02);
    }
    return { root: p, tip, food };
  }

  // Open shopfront: cream plaster, pale blue door and timber display counter.
  B(g, 6.6, .16, 5.2, wood, 0, .01, .05, .04);
  for (let k = 0; k < 18; k++) B(g, .02, .008, 5.1, '#b18763', -3.13 + k * .37, .177, .05, .001);
  B(g, 6.4, 3.5, .15, cream, 0, .16, -2.30, .03);
  B(g, .13, 3.5, 4.6, cream, -3.17, .16, 0, .02);
  B(g, .13, 1.2, 4.6, cream, 3.17, .16, 0, .02);
  B(g, 1.25, 2.60, .16, '#bad8d8', -2.40, .2, -2.18, .025);
  B(g, 1.0, 1.64, .04, '#e1eee3', -2.40, 1.02, -2.07, .015);
  B(g, .60, .085, .10, wood, -2.40, .83, -2.04, .012);
  cyl(g, .04, .04, .22, '#b99766', -1.98, 1.03, -2, 10);
  signPlane(g, signTex('OPEN', cream, deep, 256, 128, 70), .53, .26, -2.40, 1.63, -2.027);
  // Upper facade and striped canvas canopy, left intact when zooming.
  B(g, 6.6, .20, 4.95, pale, 0, 3.65, 0, .04);
  const awning = new THREE.Group(); awning.position.set(0, 3.37, 1.24); awning.rotation.x = .18; g.add(awning);
  for (let i = 0; i < 18; i++) {
    const x = -3.23 + i * .38;
    B(awning, .38, .075, 2.7, i % 2 ? '#dce3b1' : '#a7c784', x, 0, 0, .012);
    B(awning, .035, .086, 2.69, '#e8cf91', x - .18, .008, 0, .006);
    B(awning, .38, .28, .065, i % 2 ? '#dce3b1' : '#a7c784', x, -.24, 1.32, .04);
  }
  B(g, 3.2, .83, .18, wood, .4, 3.74, .86, .035);
  signPlane(g, lsign('sign_conv', '#e3e7ba', deep, 768, 192, 106), 2.98, .74, .4, 4.15, .96);
  signPlane(g, signTex('M A T C H A', '#dce3b1', deep, 768, 128, 65), 2.3, .39, .25, 3.23, 2.64);
  // Tea jars, little flags, whisk station and warm bulbs.
  for (const y of [1.17, 1.96]) {
    B(g, 4.1, .085, .48, wood, .76, y, -1.91, .02);
    for (let j = 0; j < 8; j++) {
      const x = -.87 + j * .48;
      cyl(g, .125, .125, .30, j % 2 ? pale : '#e9dfba', x, y + .085, -1.90, 16);
      cyl(g, .131, .131, .03, deep, x, y + .385, -1.90, 16);
      signPlane(g, signTex('茶', '#f8efd2', deep, 64, 64, 40), .15, .15, x, y + .25, -1.765);
    }
  }
  for (const [j, text] of ['葉', '抹茶', 'LATTE'].entries()) {
    B(g, .63, .68, .032, j === 1 ? pale : cream, -.85 + j * .92, 2.54, -.22, .022);
    signPlane(g, signTex(text, j === 1 ? pale : cream, deep, 256, 256, text.length > 2 ? 48 : 92), .52, .52, -.85 + j * .92, 2.90, -.199);
  }
  B(g, 5.58, 1.02, .94, wood, .28, .18, 1.33, .035);
  for (let i = 0; i < 18; i++) B(g, .028, .91, .035, '#e0b782', -2.37 + i * .307, .25, 1.81, .007);
  B(g, 5.80, .11, 1.18, '#e5bf89', .28, 1.20, 1.35, .03);
  const glass = new THREE.MeshStandardMaterial({ color: '#d9eee0', transparent: true, opacity: .12, roughness: .13, depthWrite: false });
  const productPick = [];
  for (const x of [-1.50, 1.54]) {
    B(g, 2.05, .08, .82, cream, x, 1.32, 1.31, .025);
    B(g, 2.05, .06, .80, '#e1e8d9', x, 1.89, 1.31, .016);
    for (const s of [-1, 1]) B(g, .045, .56, .80, '#b4c8ae', x + s * .99, 1.39, 1.31, .009);
    const front = B(g, 1.99, .50, .025, glass, x, 1.39, 1.715, .006); front.castShadow = false;
    B(g, 1.96, .025, .74, '#e5e9d7', x, 1.64, 1.31, .006);
  }
  [['cake', -2.15, 1.41], ['cake', -1.45, 1.41], ['cake', -.82, 1.68], ['latte', .89, 1.40], ['latte', 1.50, 1.40], ['taiyaki', 2.10, 1.41]].forEach(([id, x, y]) => {
    const p = plate(id); p.root.scale.setScalar(.60); p.root.position.set(x, y, 1.34); g.add(p.root);
    p.root.traverse(m => { if (m.isMesh) { m.userData.matcha = id; productPick.push(m); } });
  });
  MATCHA_MENU.forEach((it, i) => signPlane(g, signTex(`${it.id === 'cake' ? 'CAKE' : it.id === 'latte' ? 'LATTE' : 'TAIYAKI'}  ${it.price}`, cream, deep, 256, 96, 38), .70, .24, -1.70 + i * 1.65, 1.01, 1.835));
  // Menu board, stools and clusters of leaves around the entrance.
  const menu = new THREE.Group(); menu.position.set(-2.91, .2, 2.40); menu.rotation.y = .13; menu.rotation.x = -.12; g.add(menu);
  B(menu, .86, 1.24, .10, wood, 0, 0, 0, .025);
  B(menu, .73, 1.09, .014, cream, 0, .075, .059, .01);
  ['MATCHA', 'CAKE · LATTE', 'TAIYAKI'].forEach((text, i) => signPlane(menu, signTex(text, cream, deep, 384, 128, 64), .69, .23, 0, .96 - i * .28, .073));
  for (const x of [-1.28, 0, 1.28]) {
    cyl(g, .31, .31, .10, pale, x, .67, 3.35, 28);
    for (const s of [-1, 1]) for (const z of [-1, 1]) stick(g, V(x + s * .17, .67, 3.35 + z * .17), V(x + s * .25, .18, 3.35 + z * .25), .029, '#eee4cc');
    const rim = mesh(new THREE.TorusGeometry(.225, .021, 6, 24), '#e6d8b7', g, x, .38, 3.35); rim.rotation.x = Math.PI / 2;
  }
  function plant(x, z, sz) {
    cyl(g, .23 * sz, .17 * sz, .39 * sz, '#d9a480', x, .17, z, 18);
    for (let i = 0; i < 10; i++) {
      const a = i * 2.4, r = .14 * sz;
      const leaf = sph(g, .12 * sz, i % 2 ? deep : tea, x + Math.cos(a) * r, .55 * sz + (i % 4) * .10, z + Math.sin(a) * r, .58, 1.65, .6, 12); leaf.rotation.z = Math.sin(a) * .55;
    }
  }
  plant(2.93, 2.40, 1); plant(2.90, 3.24, .66); plant(-2.96, 1.53, .6);
  const light = new THREE.PointLight('#fff0c8', 4.5, 8); light.position.set(0, 2.6, 1.50); g.add(light);
  for (const x of [-2, 0, 2]) { stick(g, V(x, 3.3, .60), V(x, 2.80, .60), .012, wood); sph(g, .07, glow('#fff0c9', .6, 2, '#fff4d9'), x, 2.76, .60); }

  // Aproned rabbit; limbs are whole groups so whisking never detaches a paw.
  const rabbit = new THREE.Group(); rabbit.position.set(.03, 0, .48); g.add(rabbit);
  sph(rabbit, .32, cream, 0, 1.25, 0, 1.05, 1.42, .82);
  B(rabbit, .52, .55, .065, tea, 0, .92, .275, .12);
  for (const s of [-1, 1]) stick(rabbit, V(s * .19, 1.55, .12), V(s * .19, 1.24, .29), .025, pale);
  B(rabbit, .23, .16, .025, '#c6d6a6', 0, 1.04, .316, .04);
  const head = new THREE.Group(); head.position.set(0, 1.91, .03); rabbit.add(head);
  sph(head, .35, '#fff0d9', 0, 0, 0, 1.05, .92, .86);
  for (const s of [-1, 1]) {
    const ear = new THREE.Group(); ear.position.set(s * .17, .30, 0); ear.rotation.z = -s * .15; head.add(ear);
    sph(ear, .125, '#fff0d9', 0, .19, 0, .76, 2.55, .61);
    sph(ear, .093, '#ebc0b3', 0, .19, .060, .60, 2.56, .18);
    sph(head, .029, '#655246', s * .111, .015, .284, 1, 1.15, .4, 12);
    sph(head, .046, '#eab5a5', s * .208, -.077, .239, 1, .53, .25, 12);
    line(head, [[s * .007, -.10, .31], [s * .06, -.145, .302], [s * .10, -.115, .29]], .009, '#9d7666');
  }
  sph(head, .03, '#d69d94', 0, -.076, .317, 1, .65, .4, 12);
  const bow = new THREE.Group(); bow.position.set(.28, .24, .04); head.add(bow);
  for (const s of [-1, 1]) sph(bow, .075, tea, s * .05, 0, 0, 1, .65, .45, 12);
  const arms = [-1, 1].map(s => {
    const a = new THREE.Group(); a.position.set(s * .25, 1.49, .02); rabbit.add(a);
    stick(a, V(0, 0, 0), V(s * .015, -.18, .24), .078, cream);
    sph(a, .09, cream, s * .015, -.18, .24, 1, .85, 1, 12); return a;
  });
  cyl(rabbit, .20, .12, .14, '#cad9b6', .09, 1.31, .63, 20);
  cyl(rabbit, .178, .178, .014, deep, .09, 1.445, .63, 20);
  for (let i = 0; i < 6; i++) stick(arms[1], V(0, -.14, .22), V((i - 2.5) * .012, -.36, .38), .006, '#cba373');
  const rabbitPick = []; rabbit.traverse(m => { if (m.isMesh) rabbitPick.push(m); });
  return {
    root: g, productPick, rabbitPick, plate, handheld, setBites,
    update(t, preparing) {
      head.rotation.z = Math.sin(t * 1.1) * .045;
      arms[1].rotation.x = -.12 + Math.sin(t * (preparing ? 9 : 1.8)) * (preparing ? .17 : .04);
      arms[1].rotation.y = Math.cos(t * (preparing ? 9 : 1.8)) * (preparing ? .14 : .025);
      arms[0].rotation.z = Math.sin(t * 1.9) * .08;
    }
  };
}
