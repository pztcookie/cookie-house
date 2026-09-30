// Keep station indices stable: existing souvenir tickets store these numbers.
export const STATIONS = [
 {id:'home',key:'st_home',stop:0,open:true},
 {id:'jt',key:'st_jt',stop:1,open:true},
 {id:'wharf',key:'st_wharf',stop:4,open:true},
 {id:'gg',key:'st_gg',stop:2,open:true},
 {id:'china',key:'st_china',stop:3,open:true},
];
export const FARE=2;
export const STOPS=[
 {x:2,y:0,z:-11.65,car:[2,-.6,-15.5],exit:[2,0,-10.4],plat:[.25,3.75,-14.1,-8],space:'tramHome',station:0,yaw:0},
 {x:26,y:0,z:-11.65,car:[26,-.6,-15.5],exit:[26,0,-10.4],plat:[24.25,27.75,-14.1,-8],space:'tramJt',station:1,yaw:0},
 {x:-62.7,y:6.94,z:-49.1,car:[-62.7,6.34,-45.25],exit:[-62.7,6.94,-50.2],plat:[-64.45,-60.95,-52.4,-46.6],space:'tramGg',station:3,yaw:Math.PI},
 {x:-43,y:0,z:-11.65,car:[-43,-.6,-15.5],exit:[-43,0,-10.4],plat:[-44.75,-41.25,-14.1,-8],space:'tramChina',station:4,yaw:0},
 {x:62,y:0,z:-40,car:[62,-.6,-36.15],exit:[62,0,-41.2],plat:[60.25,63.75,-42.8,-37.2],space:'tramWharf',station:2,yaw:Math.PI},
];
export const LINE_ORDER=[4,1,0,3,2];
export const WHARF_TRACK=[[26,-.6,-15.5],[45,-.6,-15.5],[56,-.6,-18],[69,-.6,-22],[74,-.6,-30],[70,-.6,-36.15],[62,-.6,-36.15]];
export const COAST_TRACK=[[-43,-.6,-15.5],[-49,-.6,-15.5],[-53,.2,-19],[-54,1.8,-26],[-54,3.4,-33],[-54.5,5,-40],[-57,6.34,-44.5],[-62.7,6.34,-45.25]];
export function nextStop(stop,direction=1){let at=LINE_ORDER.indexOf(stop),dir=direction;if(at+dir<0||at+dir>=LINE_ORDER.length)dir=-dir;return {stop:LINE_ORDER[at+dir],direction:dir};}
export function closestStation(point){let found=0,best=Infinity;STOPS.forEach(s=>{const d=Math.hypot(point.x-s.car[0],point.y-s.car[1],point.z-s.car[2]);if(d<best){best=d;found=s.station;}});return found;}
export function payTicket(store,{from,to,pass,busy=false},save){
 if(busy)return {ok:false,reason:'busy'};
 if(!STATIONS[from]?.open||!STATIONS[to]?.open||from===to)return {ok:false,reason:'route'};
 if(!Array.isArray(pass)||!pass.length||pass.some(i=>![0,1,2].includes(i)))return {ok:false,reason:'passengers'};
 const passengers=[...new Set(pass)].sort(),total=passengers.length*FARE;
 if(store.coins<total)return {ok:false,reason:'short',short:total-store.coins};
 const before=store.coins;store.coins-=total;
 try{if(!save()){store.coins=before;return {ok:false,reason:'save'};}}catch{store.coins=before;return {ok:false,reason:'save'};}
 return {ok:true,total,passengers};
}
