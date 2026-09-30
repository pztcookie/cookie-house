import {FOODS,foodById,groceryState,foodCount,groceryTotal,addGrocery,payGroceries,storeGroceries} from './grocery-ledger.js';
import {buildGroceryModels} from './grocery-models.js';

const TEXT={
 zh:{title:'小日子食品馆',enter:'进一楼逛逛',drinks:'牛奶与果汁',deli:'便当与甜点',fresh:'蔬菜与鲜食',floor2:'二楼 · 家居玩偶',aisle:'走近一排货架看看',basket:'看看购物篮',back:'继续逛货架',pay:'结账',count:n=>`购物篮 ${n} 件`,total:n=>`合计 ${n} 金币`,add:'放入购物篮',price:n=>`${n} 金币`,empty:'篮子还是空的，去挑些喜欢的吧。',receipt:'购物小票',receipts:'小票夹',noReceipt:'还没有购物小票',paid:'已付款',qty:'数量',sum:'小计',home:'带回厨房',homeGoods:'回小屋看看',homeToys:'去玩偶收纳箱',close:'收好',download:'保存小票',kitchen:'厨房收纳',open:'打开冰箱',shut:'关上冰箱',put:'放进冰箱',putAll:'全部收进冰箱',bag:'购物袋',fridge:'冰箱里的食物',stored:n=>`已收好 ${n} 件食物，下次做饭就能找到。`,noBag:'购物袋已经收空了。',noFood:'冰箱还空着，去挑些食物吧。',shop:'去食品馆',short:n=>`还差 ${n} 金币，先放回一些或去捡金币吧。`,saveError:'保存没有成功，请留在这里再试一次。',hint:'点击货架走近 · 挑选后看购物篮',remove:'放回',limit:'每种食物最多选 9 件',milk:'牧场牛奶',juice:'橙子果汁',onigiri:'海苔饭团',sandwich:'蔬菜三明治',roll:'奶油蛋糕卷',pudding:'焦糖布丁',tomato:'番茄',leek:'小葱',salmon:'三文鱼',eggs:'鸡蛋',receiptNote:'谢谢光临，把喜欢的小日子带回家。'},
 en:{title:'Little Day Food Hall',enter:'Explore the food hall',drinks:'Milk & juice',deli:'Deli & sweets',fresh:'Fresh ingredients',floor2:'Upstairs · home & toys',aisle:'Choose an aisle to take a closer look',basket:'View my basket',back:'Keep browsing',pay:'Pay',count:n=>`Basket · ${n} items`,total:n=>`Total · ${n} coins`,add:'Add to basket',price:n=>`${n} coins`,empty:'Your basket is empty. Pick something lovely.',receipt:'Shopping receipt',receipts:'Receipt folder',noReceipt:'No receipts yet',paid:'PAID',qty:'Qty',sum:'Subtotal',home:'Take home to the kitchen',homeGoods:'Back home',homeToys:'Visit the toy chest',close:'Keep it',download:'Save receipt',kitchen:'Kitchen groceries',open:'Open fridge',shut:'Close fridge',put:'Put in fridge',putAll:'Put everything in fridge',bag:'Shopping bag',fridge:'In the fridge',stored:n=>`${n} items stored for your next cooking day.`,noBag:'Everything is unpacked.',noFood:'The fridge is empty. Let’s pick some groceries.',shop:'Visit the food hall',short:n=>`You need ${n} more coins. Return an item or collect coins.`,saveError:'Could not save. Please stay here and try again.',hint:'Tap a shelf to approach · choose food to see it in the basket',remove:'Return',limit:'Up to 9 of each item',milk:'Meadow milk',juice:'Orange juice',onigiri:'Rice ball',sandwich:'Veggie sandwich',roll:'Cream cake roll',pudding:'Caramel pudding',tomato:'Tomatoes',leek:'Spring onions',salmon:'Salmon',eggs:'Eggs',receiptNote:'Thank you for bringing a little lovely day home.'},
 ja:{title:'小さな日々の食品館',enter:'1階の食品館へ',drinks:'ミルクとジュース',deli:'お弁当とおやつ',fresh:'野菜と生鮮食品',floor2:'2階 · 雑貨とぬいぐるみ',aisle:'棚を選んで近くで見てみよう',basket:'かごを見る',back:'お買い物を続ける',pay:'お会計',count:n=>`かご ${n}点`,total:n=>`合計 ${n}コイン`,add:'かごに入れる',price:n=>`${n}コイン`,empty:'かごは空っぽ。お気に入りを選ぼう。',receipt:'お買い物レシート',receipts:'レシート帳',noReceipt:'レシートはまだないよ',paid:'支払済',qty:'数量',sum:'小計',home:'キッチンへ持ち帰る',homeGoods:'おうちへ',homeToys:'ぬいぐるみ箱へ',close:'しまう',download:'レシートを保存',kitchen:'キッチンの食材',open:'冷蔵庫を開ける',shut:'冷蔵庫を閉める',put:'冷蔵庫に入れる',putAll:'全部冷蔵庫に入れる',bag:'お買い物袋',fridge:'冷蔵庫の中',stored:n=>`${n}点を収納したよ。次のお料理に使おう。`,noBag:'全部しまったよ。',noFood:'冷蔵庫はまだ空っぽ。食材を買いに行こう。',shop:'食品館へ',short:n=>`あと${n}コイン必要。商品を戻すかコインを集めよう。`,saveError:'保存できませんでした。もう一度試してね。',hint:'棚をタップして近づく · 食品を選んでかごを見る',remove:'戻す',limit:'各食品は9点まで',milk:'牧場のミルク',juice:'オレンジジュース',onigiri:'おにぎり',sandwich:'野菜サンド',roll:'ロールケーキ',pudding:'カラメルプリン',tomato:'トマト',leek:'ねぎ',salmon:'サーモン',eggs:'たまご',receiptNote:'ご来店ありがとう。小さな幸せをおうちへ。'},
};
const emoji={milk:'🥛',juice:'🍊',onigiri:'🍙',sandwich:'🥪',roll:'🍰',pudding:'🍮',tomato:'🍅',leek:'🌿',salmon:'🐟',eggs:'🥚'};

export function createGroceryExperience(H){
  const model=buildGroceryModels(H),$=s=>document.querySelector(s);
  const tr=(k,...a)=>{const v=(TEXT[H.lang()]||TEXT.zh)[k];return typeof v==='function'?v(...a):v;};
  H.store.groceries=groceryState(H.store.groceries);
  let view='overview',fridgeOpen=false,lastReceipt=null,receiptMode=false;
  const bar=document.createElement('section');bar.id='groceryBar';bar.className='panel';bar.hidden=true;$('#bottom').prepend(bar);
  const kitchen=document.createElement('section');kitchen.id='fridgeBar';kitchen.className='panel';kitchen.hidden=true;$('#bottom').prepend(kitchen);
  const receipt=document.createElement('div');receipt.id='receiptSheet';receipt.hidden=true;receipt.setAttribute('role','dialog');receipt.setAttribute('aria-modal','true');receipt.setAttribute('aria-label',tr('receipt'));document.body.append(receipt);
  const state=()=>H.store.groceries;
  function save(){const okay=H.save();if(!okay)H.toast(tr('saveError'));return okay;}
  const btn=(action,label,cls='chip',disabled=false)=>`<button class="${cls}" data-grocery="${action}" ${disabled?'disabled':''}>${label}</button>`;
  const foodName=id=>tr(id)||H.itemName?.(id)||id;
  const row=(id,n,action)=>`<div class="food-row"><span class="food-mini" aria-hidden="true">${emoji[id]||'✧'}</span><b>${foodName(id)}</b><span>× ${n}</span>${action?btn(action,tr(action.startsWith('put:')?'put':'remove')):''}</div>`;
  function refresh(){
    const location=H.location(),inDept=location.mode==='orbit'&&location.space==='dept',inKitchen=location.mode==='orbit'&&location.space==='kitchen';
    bar.hidden=!inDept;kitchen.hidden=!inKitchen;
    if(!inKitchen&&fridgeOpen){fridgeOpen=false;model.setOpen(false);}
    const s=state(),n=foodCount(s.basket),total=groceryTotal(s.basket);
    if(inDept){
      let body='';
      if(view==='overview')body=`<p>${tr('hint')}</p><div class="gro-actions">${btn('enter',tr('enter'),'pill main')}${btn('floor2',tr('floor2'))}</div>`;
      else if(view==='basket')body=`<div class="food-list">${n?FOODS.filter(f=>s.basket[f.id]).map(f=>row(f.id,s.basket[f.id],'remove:'+f.id)).join(''):`<p>${tr('empty')}</p>`}</div><div class="gro-actions">${btn('aisles',tr('back'))}${btn('pay',tr('pay')+' · '+tr('total',total),'pill main',!n)}</div>`;
      else if(view==='floor2')body=`<div class="goods-options">${(H.goods?.()||[]).map(it=>`<button class="chip${it.selected?' on':''}" data-grocery="goods:${it.id}" aria-pressed="${it.selected}" ${it.owned?'disabled':''}>${it.name} · ${tr('price',it.price)}${it.owned?' ✓':''}</button>`).join('')}</div><div class="gro-actions">${btn('enter',tr('enter'))}${btn('basket',tr('basket'))}</div>`;
      else{
        body=`<div class="gro-aisles">${['drinks','deli','fresh'].map(a=>btn(a,tr(a),'chip'+(view===a?' on':''))).join('')}</div>`;
        if(view==='aisles')body+=`<p>${tr('aisle')}</p>`;
        else body+=`<div class="food-options">${FOODS.filter(f=>f.aisle===view).map(f=>`<button class="food-option" data-grocery="add:${f.id}" aria-label="${tr(f.id)} · ${tr('price',f.price)} · ${tr('add')}"><span aria-hidden="true">${emoji[f.id]}</span><b>${tr(f.id)}</b><small>${tr('price',f.price)}</small></button>`).join('')}</div>`;
        body+=`<div class="gro-actions">${btn('basket',tr('basket')+' · '+n,'pill main')}${btn('floor2',tr('floor2'))}</div>`;
      }
      bar.innerHTML=`<div class="gro-head"><b>${tr(view==='basket'?'basket':view==='floor2'?'floor2':'title')}</b>${btn('receipts',tr('receipts'))}</div>${body}`;
    }
    if(inKitchen){
      kitchen.innerHTML=`<div class="gro-head"><b>${tr('kitchen')}</b>${btn('receipts',tr('receipts'))}</div>${fridgeOpen?`<div class="fridge-columns"><div><b>${tr('bag')}</b><div class="food-list">${foodCount(s.bag)?FOODS.filter(f=>s.bag[f.id]).map(f=>row(f.id,s.bag[f.id],'put:'+f.id)).join(''):`<p>${tr('noBag')}</p>`}</div></div><div><b>${tr('fridge')}</b><div class="food-list">${foodCount(s.fridge)?FOODS.filter(f=>s.fridge[f.id]).map(f=>row(f.id,s.fridge[f.id])).join(''):`<p>${tr('noFood')}</p>`}</div></div></div>`:`<p>${tr('bag')} · ${foodCount(s.bag)}　${tr('fridge')} · ${foodCount(s.fridge)}</p>`}<div class="gro-actions">${btn(fridgeOpen?'shut':'open',tr(fridgeOpen?'shut':'open'),'pill')}${fridgeOpen?btn('putAll',tr('putAll'),'pill main',!foodCount(s.bag)):''}${btn('shop',tr('shop'))}</div>`;
    }
    if(receiptMode)renderReceipt(lastReceipt);
  }
  function updateModels(){model.setBasket(state().basket);model.setFridge(state().fridge);}
  function look(next){view=next;H.enter('dept');H.fly(model.view(next,H.portrait()));refresh();}
  function add(id){
    if((state().basket[id]||0)>=9){H.toast(tr('limit'));return;}
    addGrocery(state(),id,1);save();model.setBasket(state().basket);H.chime();look('basket');
  }
  function pay(){
    const result=payGroceries(state(),H.store.coins);
    if(!result.ok){H.toast(result.reason==='short'?tr('short',result.short):tr('empty'));return;}
    const old=state(),coins=H.store.coins;H.store.groceries=result.state;H.store.coins=result.coins;
    if(!save()){H.store.groceries=old;H.store.coins=coins;return;}
    model.setBasket({});H.refreshWallet();H.chime();refresh();showReceipt(result.receipt);
  }
  function dateText(date){const d=new Date(date);return Number.isNaN(+d)?'':d.toLocaleString(H.lang()==='zh'?'zh-CN':H.lang()==='ja'?'ja-JP':'en-US',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});}
  function renderReceipt(r){
    receipt.setAttribute('aria-label',tr('receipt'));
    receipt.innerHTML=`<article class="receipt-paper"><div class="receipt-heading"><span>COOKIE HOUSE</span><h2>${tr(r?'receipt':'receipts')}</h2></div>${r?`<p class="receipt-meta">${dateText(r.date)}<br>${r.id}</p><div class="receipt-lines">${r.lines.map(l=>`<div><span>${foodName(l.id)}<small>${tr('price',l.price)} × ${l.qty}</small></span><b>${l.price*l.qty}</b></div>`).join('')}</div><div class="receipt-total"><b>${tr('total',r.total)}</b><span>${tr('paid')}</span></div><p class="receipt-note">${tr('receiptNote')}</p><div class="receipt-barcode" aria-hidden="true"></div><div class="gro-actions">${btn('download',tr('download'))}${btn('home',tr(r.lines.every(l=>l.source==='goods')?r.lines.some(l=>l.id.startsWith('plush'))?'homeToys':'homeGoods':'home'),'pill main')}</div>`:`<div class="receipt-history">${state().receipts.length?state().receipts.slice().reverse().map(r=>btn('receipt:'+r.id,dateText(r.date)+' · '+tr('total',r.total))).join(''):`<p>${tr('noReceipt')}</p>`}</div>`}<div class="gro-actions">${r?btn('receipts',tr('receipts')):''}${btn('close',tr('close'))}</div></article>`;
  }
  function showReceipt(r){lastReceipt=r||null;receiptMode=true;receipt.hidden=false;renderReceipt(lastReceipt);receipt.querySelector('button')?.focus();}
  function hideReceipt(){receiptMode=false;receipt.hidden=true;}
  function openFridge(){H.enter('kitchen');fridgeOpen=true;model.setOpen(true);H.fly(model.view('fridge',H.portrait()));refresh();}
  function put(id){const before=JSON.stringify(state()),n=storeGroceries(state(),id);if(!n)return;if(!save()){H.store.groceries=JSON.parse(before);return;}model.setFridge(state().fridge);H.chime();H.toast(tr('stored',n));refresh();}
  function downloadReceipt(){
    if(!lastReceipt)return;const r=lastReceipt,c=document.createElement('canvas');c.width=760;c.height=540+r.lines.length*77;const q=c.getContext('2d');q.fillStyle='#fff6df';q.fillRect(0,0,c.width,c.height);q.fillStyle='#635749';q.textAlign='center';q.font='bold 32px sans-serif';q.fillText('COOKIE HOUSE',380,68);q.font='27px sans-serif';q.fillText(tr('receipt'),380,114);q.font='18px sans-serif';q.fillText(dateText(r.date),380,155);q.fillText(r.id,380,185);q.textAlign='left';r.lines.forEach((l,i)=>{q.font='24px sans-serif';q.fillText(foodName(l.id)+' × '+l.qty,48,250+i*77);q.font='18px sans-serif';q.fillText(tr('price',l.price),48,279+i*77);q.textAlign='right';q.fillText(String(l.price*l.qty),712,254+i*77);q.textAlign='left';});const y=290+r.lines.length*77;q.font='bold 27px sans-serif';q.fillText(tr('total',r.total),48,y);q.font='20px sans-serif';q.fillText(tr('paid'),48,y+48);q.fillText(tr('receiptNote'),48,y+120);const a=document.createElement('a');a.download=r.id+'.png';a.href=c.toDataURL('image/png');document.body.append(a);a.click();a.remove();
  }
  function action(e){
    const b=e.target.closest('[data-grocery]');if(!b||b.disabled)return;const a=b.dataset.grocery;
    if(a.startsWith('add:'))return add(a.slice(4));
    if(a.startsWith('goods:')){H.selectGoods?.(a.slice(6));refresh();return;}
    if(a.startsWith('remove:')){addGrocery(state(),a.slice(7),-1);save();model.setBasket(state().basket);refresh();return;}
    if(a.startsWith('put:'))return put(a.slice(4));
    if(a.startsWith('receipt:'))return showReceipt(state().receipts.find(r=>r.id===a.slice(8)));
    if(a==='enter'||a==='aisles')return look('aisles');
    if(['drinks','deli','fresh','basket','floor2'].includes(a))return look(a);
    if(a==='pay')return pay();if(a==='receipts')return showReceipt(null);if(a==='close')return hideReceipt();if(a==='download')return downloadReceipt();
    if(a==='home'){const goods=lastReceipt?.lines.every(l=>l.source==='goods'),toys=lastReceipt?.lines.some(l=>l.id.startsWith('plush'));hideReceipt();H.navigate(goods?toys?'bed':'all':'kitchen');return;}
    if(a==='open')return openFridge();if(a==='shut'){fridgeOpen=false;model.setOpen(false);refresh();return;}
    if(a==='putAll')return put(null);if(a==='shop'){H.navigate('dept');look('aisles');}
  }
  [bar,kitchen,receipt].forEach(el=>el.addEventListener('click',action));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&receiptMode)hideReceipt();});
  updateModels();
  return {refresh,update:dt=>model.update(dt),
    leave(id){if(id!=='dept')view='overview';if(id!=='kitchen'){fridgeOpen=false;model.setOpen(false);}hideReceipt();},
    minDistance(){return H.location().space==='dept'&&view!=='overview'?1.25:fridgeOpen?1.0:null;},
    handleRay(ray){
      if(H.busy())return false;
      const f=ray.intersectObjects(model.fridgePick,false)[0];if(f){openFridge();return true;}
      if(H.location().space==='dept'&&view==='floor2')return false;
      const hits=ray.intersectObjects(model.hits,false);if(!hits.length)return false;
      if(view==='drinks'||view==='deli'||view==='fresh'){const item=hits.find(h=>h.object.userData.grocery);if(item){add(item.object.userData.grocery);return true;}}
      const hit=hits[0].object.userData;if(hit.groceryCheckout)pay();else if(hit.groceryBasket)look('basket');else look(hit.aisle||foodById(hit.grocery)?.aisle||'aisles');return true;
    },
    recordGoods(list,total){const now=new Date(),r={id:`CH-${now.getTime().toString(36).toUpperCase()}`,date:now.toISOString(),lines:list.map(it=>({id:it.id,qty:1,price:it.price,source:'goods'})),total};state().receipts.push(r);save();refresh();showReceipt(r);},
    debug(){return {view,fridgeOpen,...groceryState(state())};}
  };
}
