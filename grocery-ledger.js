export const FOODS = [
  {id:'milk',price:2,aisle:'drinks',color:'#a9d2df'}, {id:'juice',price:3,aisle:'drinks',color:'#efbe71'},
  {id:'onigiri',price:3,aisle:'deli',color:'#a4c6aa'}, {id:'sandwich',price:4,aisle:'deli',color:'#edbd9d'},
  {id:'roll',price:3,aisle:'deli',color:'#e0b37f'}, {id:'pudding',price:3,aisle:'deli',color:'#eed291'},
  {id:'tomato',price:2,aisle:'fresh',color:'#e99284'}, {id:'leek',price:2,aisle:'fresh',color:'#abc698'},
  {id:'salmon',price:5,aisle:'fresh',color:'#e6a095'}, {id:'eggs',price:3,aisle:'fresh',color:'#d9c7a8'},
];
export const foodById = id => FOODS.find(it => it.id === id);
const receiptItem = l => foodById(l.id) || (l.source === 'goods' && ['wagashi','neko','plush','plushMint','plushLilac','pillow','mug','onigiri','pudding','milk','ramune','tako','washi','notebook','pencils','stickers','stamps','letterset'].includes(l.id));
const cleanCounts = input => Object.fromEntries(FOODS.flatMap(({id}) => {
  const n=Number(input?.[id]);return Number.isSafeInteger(n)&&n>0?[[id,n]]:[];
}));
export function groceryState(saved) {
  return {basket:cleanCounts(saved?.basket),bag:cleanCounts(saved?.bag),fridge:cleanCounts(saved?.fridge),
    receipts:Array.isArray(saved?.receipts)?saved.receipts.filter(r=>r&&typeof r.id==='string'&&Number.isFinite(r.total)&&Array.isArray(r.lines)&&r.lines.every(l=>receiptItem(l)&&Number.isSafeInteger(l.qty)&&l.qty>0&&Number.isFinite(l.price))):[]};
}
export const foodCount = counts => Object.values(counts).reduce((a,n)=>a+n,0);
export const groceryTotal = counts => FOODS.reduce((a,it)=>a+(counts[it.id]||0)*it.price,0);
export function addGrocery(state,id,delta=1) {
  if(!foodById(id))return false;
  const n=Math.max(0,Math.min(9,(state.basket[id]||0)+delta));
  if(n)state.basket[id]=n;else delete state.basket[id];return true;
}
export function payGroceries(state,coins,now=new Date()) {
  const total=groceryTotal(state.basket);
  if(!total)return {ok:false,reason:'empty'};
  if(coins<total)return {ok:false,reason:'short',short:total-coins};
  const lines=FOODS.filter(it=>state.basket[it.id]).map(it=>({id:it.id,qty:state.basket[it.id],price:it.price}));
  const receipt={id:`CH-${now.getTime().toString(36).toUpperCase()}`,date:now.toISOString(),lines,total};
  const next=groceryState(state);next.basket={};lines.forEach(l=>next.bag[l.id]=(next.bag[l.id]||0)+l.qty);
  next.receipts=[...next.receipts,receipt];
  return {ok:true,coins:coins-total,state:next,receipt};
}
export function storeGroceries(state,id=null) {
  const ids=id?[id]:FOODS.map(it=>it.id);let moved=0;
  ids.forEach(key=>{if(!foodById(key))return;const qty=state.bag[key]||0;if(!qty)return;state.fridge[key]=(state.fridge[key]||0)+qty;delete state.bag[key];moved+=qty;});
  return moved;
}
