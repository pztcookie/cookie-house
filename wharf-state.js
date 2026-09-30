export const CHOWDER_PRICE=6;
export const WHARF_ORIGIN=[62,0,-58];
export function orderChowder(store,guests,save,busy=false){
 if(busy)return {ok:false,reason:'busy'};
 if(!Array.isArray(guests)||!guests.length||guests.some(i=>![0,1,2].includes(i)))return {ok:false,reason:'guests'};
 const pass=[...new Set(guests)].sort(),total=pass.length*CHOWDER_PRICE;
 if(store.coins<total)return {ok:false,reason:'short',short:total-store.coins};
 const before=store.coins;store.coins-=total;
 try{if(!save())throw Error('save');}catch{store.coins=before;return {ok:false,reason:'save'};}
 return {ok:true,pass,total};
}
export function wharfGround(x,z){
 const lx=x-62,lz=z+58;
 const deck=lx>=-16&&lx<=16&&lz>=-16&&lz<=16;
 const entrance=lx>=-4&&lx<=4&&lz>=15&&lz<=21;
 const shop=lx>-12.4&&lx<-1.6&&lz>-14&&lz<-5.2;
 const pier=lx>2.4&&lx<11.6&&lz>-14.6&&lz<-7.4;
 const table=lx>2.3&&lx<8.9&&lz>1.7&&lz<5.2;
 return (deck||entrance)&&!shop&&!pier&&!table?0:null;
}
