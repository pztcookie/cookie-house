export const TEAS=[
 {id:'osmanthusTea',names:['桂花茶','Osmanthus tea','キンモクセイ茶'],color:'#c6a758'},
 {id:'jasmineTea',names:['茉莉花茶','Jasmine tea','ジャスミン茶'],color:'#b5b379'},
 {id:'puerTea',names:['普洱茶','Pu’er tea','プーアル茶'],color:'#986e4d'},
];
export const DIM_SUM=[
 {id:'osmanthus',price:3,names:['桂花糕','Osmanthus cake','キンモクセイ糕']},
 {id:'redbean',price:3,names:['红豆糕','Red bean cake','あずき糕']},
 {id:'almond',price:3,names:['杏仁豆腐','Almond pudding','杏仁豆腐']},
 {id:'tart',price:4,names:['酥皮蛋挞','Egg tarts','エッグタルト']},
 {id:'bun',price:4,names:['流沙包','Custard buns','カスタードまん']},
 {id:'dumpling',price:5,names:['水晶虾饺','Shrimp dumplings','海老蒸し餃子']},
];
export const teaName=(item,lang)=>item.names[lang==='zh'?0:lang==='ja'?2:1];
export function teaBill(ids){return DIM_SUM.filter(it=>ids.includes(it.id)).reduce((n,it)=>n+it.price,0);}
export function payTeaTable(store,{ids,guests,ready,busy},save){
 if(busy)return {ok:false,reason:'busy'};
 if(!ready)return {ok:false,reason:'brew'};
 if(!Array.isArray(guests)||!guests.length||guests.some(i=>![0,1,2].includes(i)))return {ok:false,reason:'guests'};
 if(!Array.isArray(ids)||ids.length>3||new Set(ids).size!==ids.length||ids.some(id=>!DIM_SUM.some(it=>it.id===id)))return {ok:false,reason:'menu'};
 const total=teaBill(ids);if(store.coins<total)return {ok:false,reason:'short',short:total-store.coins};
 const before=store.coins;store.coins-=total;
 if(total){try{if(!save()){store.coins=before;return {ok:false,reason:'save'};}}catch{store.coins=before;return {ok:false,reason:'save'};}}
 return {ok:true,total,ids:[...ids],guests:[...new Set(guests)]};
}
