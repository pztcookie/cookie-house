export const ICE_MENU=[{id:'vanilla',price:4,color:'#fff0cf'},{id:'berry',price:5,color:'#f0aaba'},{id:'cocoa',price:5,color:'#a97f67'}];
export function buyIce(store,id,save,busy=false){const item=ICE_MENU.find(i=>i.id===id);if(!item||busy)return {ok:false,reason:'busy'};if(store.coins<item.price)return {ok:false,reason:'short',short:item.price-store.coins};store.coins-=item.price;if(!save()){store.coins+=item.price;return {ok:false,reason:'save'};}return {ok:true,item};}
// Rounded turns on the bridge promenade, all at the existing deck height.
export const CYCLE_ROUTE=[[-71,6.94,-63],[-71,6.94,-67.7],[-65,6.94,-68.6],[-48,6.94,-68.6],[-31,6.94,-68.6],[-20,6.94,-68.6],[-18,6.94,-67.6],[-20,6.94,-66.7],[-40,6.94,-66.7],[-60,6.94,-66.7],[-71,6.94,-65],[-71,6.94,-63]];
