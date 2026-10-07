const WORDS={
 zh:{title:'和平塔下的拍立得',open:'拍张拍立得',album:'我的拍立得',who:'谁来一起拍？',camera:'打开摄像头合照',cameraOff:'关闭摄像头',take:'咔嚓 · 拍一张',retake:'重新拍',caption:'写下今天想说的话',placeholder:'今天的小事，也值得记住。',save:'收进相册',saved:'已收进相册',download:'下载照片',close:'回去逛逛',left:'贴纸放左边',right:'贴纸放右边',size:'贴纸大小',ready:'选好角色，就可以拍啦。',choose:'至少选一个角色一起拍吧。',denied:'摄像头没有打开。可以检查浏览器权限，或直接和角色拍照。',noCamera:'这里暂时不能使用摄像头，仍然可以拍角色合照。',empty:'第一张回忆，还等着你来拍。',back:'继续拍照',saveError:'相册暂时无法保存，请先下载照片留存。',saving:'正在保存…',hint:'选一个或多个角色，留下今天的合照。'},
 en:{title:'A Polaroid at the Peace Pagoda',open:'Take a Polaroid',album:'My Polaroids',who:'Who is in the picture?',camera:'Camera together',cameraOff:'Turn camera off',take:'Click · take a photo',retake:'Take another',caption:'A little note for today',placeholder:'Even little moments are worth keeping.',save:'Keep in album',saved:'Saved to album',download:'Download photo',close:'Keep exploring',left:'Stickers on the left',right:'Stickers on the right',size:'Sticker size',ready:'Choose your friends and take a photo.',choose:'Choose at least one friend.',denied:'The camera did not open. Check browser permissions, or take a character photo.',noCamera:'Camera is unavailable here. You can still take a character photo.',empty:'Your first little memory is waiting.',back:'Back to camera',saveError:'The album could not save. Please download the photo instead.',saving:'Saving…',hint:'Choose one or more friends for today’s photo.'},
 ja:{title:'平和の塔でチェキ',open:'チェキを撮る',album:'チェキアルバム',who:'だれと一緒に撮る？',camera:'カメラで一緒に',cameraOff:'カメラを閉じる',take:'カシャッ · 撮影',retake:'もう一度撮る',caption:'今日のひとこと',placeholder:'小さなできごとも、思い出に。',save:'アルバムに保存',saved:'保存できたよ',download:'写真をダウンロード',close:'おさんぽに戻る',left:'シールを左へ',right:'シールを右へ',size:'シールの大きさ',ready:'友だちを選んで撮ろう。',choose:'ひとり以上選んでね。',denied:'カメラを開けなかったよ。権限を確認するか、キャラだけで撮ろう。',noCamera:'ここではカメラを使えません。キャラの写真は撮れるよ。',empty:'最初の思い出を撮ろう。',back:'撮影に戻る',saveError:'保存できませんでした。写真をダウンロードしてね。',saving:'保存中…',hint:'ひとりでもみんなでも、今日の記念写真を。'},
};
function photoDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open('cookieHouse.photos',1);req.onupgradeneeded=()=>req.result.createObjectStore('photos',{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function dbRead(){const db=await photoDB();return new Promise((resolve,reject)=>{const tx=db.transaction('photos','readonly'),r=tx.objectStore('photos').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
async function dbSave(record){const db=await photoDB();return new Promise((resolve,reject)=>{const tx=db.transaction('photos','readwrite');tx.objectStore('photos').put(record);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}

export function createPolaroid(H){
  const {THREE}=H,$=s=>document.querySelector(s),tr=k=>(WORDS[H.lang()]||WORDS.zh)[k];
  let active=false,stream=null,streamRequest=0,raf=0,renderer=null,shot=null,shotDate=null,shotId=null,saving=false,side='right',size=.74;
  let cameraScene,camera,models,pagodaBackdrop,chinaBackdrop,laneBackdrop,bridgeBackdrop,wharfBackdrop,photoPlace='plaza',selection=new Set([0]),photoRecords=[],urls=[];
  const video=document.createElement('video');video.playsInline=true;video.muted=true;
  const bar=document.createElement('section');bar.id='photoBar';bar.className='panel';bar.hidden=true;$('#bottom').prepend(bar);
  const modal=document.createElement('section');modal.id='photoBooth';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');document.body.append(modal);
  modal.innerHTML=`<div class="photo-shell"><div class="photo-top"><b id="photoTitle"></b><button class="xbtn" data-photo="close">×</button></div><div class="photo-layout"><div class="polaroid-preview"><canvas id="photoCanvas" width="900" height="1110"></canvas></div><div class="photo-controls"><b id="photoWho"></b><div id="photoGuests"></div><p id="photoStatus" role="status" aria-live="polite"></p><button class="pill" data-photo="camera" id="photoCamera"></button><div class="photo-adjust"><button class="chip" data-photo="left" id="photoLeft"></button><button class="chip" data-photo="right" id="photoRight"></button><label><span id="photoSizeLabel"></span><input id="photoSize" type="range" min="50" max="95" value="74"></label></div><button class="pill main" data-photo="take" id="photoTake"></button><label class="photo-caption"><span id="photoCaptionLabel"></span><textarea id="photoCaption" maxlength="60" rows="2"></textarea></label><div class="photo-save"><button class="pill main" data-photo="save" id="photoSave" disabled></button><button class="pill" data-photo="download" id="photoDownload" disabled></button></div><button class="chip" data-photo="album" id="photoAlbum"></button></div></div><div id="photoAlbumGrid" hidden></div></div>`;
  const canvas=$('#photoCanvas'),ctx=canvas.getContext('2d'),base=document.createElement('canvas');base.width=820;base.height=860;const bg=base.getContext('2d');
  const name=i=>H.characterName(i);
  const photoTitle=()=>photoPlace==='wharf'?({zh:'渔人码头的拍立得',en:'A Fisherman’s Wharf Polaroid',ja:'ワーフでチェキ'}[H.lang()]):photoPlace==='gg'?({zh:'金门大桥的拍立得',en:'A Golden Gate Polaroid',ja:'金門橋でチェキ'}[H.lang()]||'Golden Gate'):photoPlace!=='plaza'?({zh:'中国城里的拍立得',en:'A Polaroid in Chinatown',ja:'チャイナタウンでチェキ'}[H.lang()]||'Chinatown'):tr('title');
  function labels(){
    modal.setAttribute('aria-label',photoTitle());$('#photoTitle').textContent=photoTitle();modal.querySelector('[data-photo="close"]').setAttribute('aria-label',tr('close'));
    $('#photoWho').textContent=tr('who');$('#photoGuests').innerHTML=H.characterMakers.map((_,i)=>`<button class="chip ${selection.has(i)?'on':''}" role="checkbox" aria-checked="${selection.has(i)}" data-photo="guest:${i}">${name(i)}</button>`).join('');
    const map={photoCamera:stream?'cameraOff':'camera',photoLeft:'left',photoRight:'right',photoSizeLabel:'size',photoTake:shot?'retake':'take',photoCaptionLabel:'caption',photoSave:'save',photoDownload:'download',photoAlbum:'album'};
    Object.entries(map).forEach(([id,key])=>$('#'+id).textContent=tr(key));$('#photoCaption').placeholder=tr('placeholder');
    $('#photoTake').disabled=!selection.size;$('#photoSave').disabled=!shot||saving;$('#photoDownload').disabled=!shot;
    $('#photoLeft').classList.toggle('on',side==='left');$('#photoRight').classList.toggle('on',side==='right');
    for(const id of ['photoLeft','photoRight','photoSize'])$('#'+id).disabled=!!shot;
  }
  function refresh(){const s=H.location();bar.hidden=!(s.space==='plaza'&&s.mode==='orbit');bar.innerHTML=`<b>${tr('title')}</b><span>${tr('hint')}</span><div><button class="pill main" data-photo="open">${tr('open')}</button><button class="chip" data-photo="album">${tr('album')}</button></div>`;if(active)labels();}
  function setup(){
    if(renderer)return;
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(820,860);renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.NeutralToneMapping;
    cameraScene=new THREE.Scene();cameraScene.add(new THREE.HemisphereLight('#fff8ec','#b8cee1',2.4));
    const light=new THREE.DirectionalLight('#fff4df',3.1);light.position.set(-3,7,8);cameraScene.add(light);
    camera=new THREE.OrthographicCamera(-2.8,2.8,2.94,-2.94,.1,40);camera.position.set(0,4.1,11);camera.lookAt(0,1.85,0);
    const tower=new THREE.Group(),clone=H.pagoda.clone(true);clone.position.set(-20.5,0,5.4);tower.add(clone);tower.scale.setScalar(.43);tower.position.set(.20,.06,-.35);cameraScene.add(tower);pagodaBackdrop=tower;chinaBackdrop=H.chinaScene?.('china');laneBackdrop=H.chinaScene?.('lantern');if(chinaBackdrop)cameraScene.add(chinaBackdrop);if(laneBackdrop)cameraScene.add(laneBackdrop);bridgeBackdrop=H.bridgeScene?.();if(bridgeBackdrop)cameraScene.add(bridgeBackdrop);wharfBackdrop=H.wharfScene?.();if(wharfBackdrop)cameraScene.add(wharfBackdrop);
    models=H.characterMakers.map(fn=>fn());models.forEach(m=>cameraScene.add(m.root));arrange();
  }
  function arrange(){
    if(!models)return;const ids=[...selection],wide=ids.some(i=>i>=3),widths=[1.9,1.65,1.35,2.85,3.5];
    const total=ids.reduce((sum,i)=>sum+widths[i],0)+Math.max(0,ids.length-1)*.14,scale=wide?Math.min(.79,4.75/total):.79;let cursor=-total*scale/2;
    models.forEach((m,i)=>{m.root.visible=selection.has(i);m.root.scale.setScalar(scale);m.root.rotation.y=i===2?-.15:0;});
    ids.forEach((i,j)=>{const x=wide?cursor+widths[i]*scale/2:(j-(ids.length-1)/2)*1.13;models[i].root.position.set(x,.05,1.05);cursor+=(widths[i]+.14)*scale;});
  }
  function stopCamera(){streamRequest++;stream?.getTracks().forEach(track=>track.stop());stream=null;video.srcObject=null;if(active)labels();}
  async function enableCamera(){
    if(stream){stopCamera();return;}if(!navigator.mediaDevices?.getUserMedia){$('#photoStatus').textContent=tr('noCamera');return;}
    const token=++streamRequest;$('#photoCamera').disabled=true;
    try{const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:1280}},audio:false});
      if(!active||token!==streamRequest){next.getTracks().forEach(t=>t.stop());return;}stream=next;video.srcObject=stream;await video.play();shot=null;labels();$('#photoStatus').textContent=tr('ready');
    }catch(e){if(token===streamRequest&&active){stopCamera();$('#photoStatus').textContent=tr('denied');}}
    finally{if(active)$('#photoCamera').disabled=false;}
  }
  function localDate(d){return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;}
  function compose(){
    ctx.fillStyle='#fff8e9';ctx.fillRect(0,0,900,1110);ctx.drawImage(shot||base,40,40,820,860);
    ctx.fillStyle='#877a69';ctx.font='600 25px Nunito,sans-serif';ctx.textAlign='left';ctx.fillText(localDate(shotDate||new Date()),48,949);
    ctx.textAlign='right';ctx.font='20px Nunito,sans-serif';ctx.fillText(photoPlace==='wharf'?"FISHERMAN'S WHARF":photoPlace==='gg'?'GOLDEN GATE':photoPlace!=='plaza'?'CHINATOWN':'PEACE PAGODA',851,949);ctx.textAlign='left';ctx.fillStyle='#665b55';ctx.font='29px "PingFang SC",Nunito,sans-serif';
    const text=$('#photoCaption').value.slice(0,60);let line='',row=0;for(const char of text){if(char==='\n'||ctx.measureText(line+char).width>790){ctx.fillText(line,48,1004+row*41);line='';row++;if(row>=2)break;if(char==='\n')continue;}line+=char;}if(row<2)ctx.fillText(line,48,1004+row*41);
    ctx.fillStyle='#bdcfc6';ctx.beginPath();ctx.arc(844,1070,7,0,7);ctx.fill();
  }
  function draw(t=0){
    if(!active)return;
    if(!shot){
      const live=stream&&video.readyState>=2;
      if(live){const scale=Math.max(820/video.videoWidth,860/video.videoHeight),w=video.videoWidth*scale,h=video.videoHeight*scale;bg.save();bg.translate(820,0);bg.scale(-1,1);bg.drawImage(video,(820-w)/2,(860-h)/2,w,h);bg.restore();}
      else {const gr=bg.createLinearGradient(0,0,0,860);gr.addColorStop(0,'#dcebec');gr.addColorStop(.65,'#eef3e0');gr.addColorStop(1,'#e8d9c5');bg.fillStyle=gr;bg.fillRect(0,0,820,860);bg.fillStyle='#faf7e9';for(const[x,y,r]of[[100,140,70],[170,120,85],[710,220,90]]){bg.beginPath();bg.arc(x,y,r,0,7);bg.fill();}}
      models.forEach(m=>m.anim({phase:0,amp:0},t/1000));renderer.render(cameraScene,camera);
      if(live){const w=820*size,h=860*size,x=side==='left'?-12:820-w+12,y=860-h;bg.save();bg.shadowColor='#fff8e9';bg.shadowBlur=14;bg.drawImage(renderer.domElement,x,y,w,h);bg.restore();}
      else bg.drawImage(renderer.domElement,0,0,820,860);
    }
    compose();raf=requestAnimationFrame(draw);
  }
  function open(){if(active)return;setup();photoPlace=['wharf','bakery','chowder','seaLions','tramWharf'].includes(H.location().space)?'wharf':['gg','bike','ice'].includes(H.location().space)?'gg':['china','lantern'].includes(H.location().space)?H.location().space:'plaza';pagodaBackdrop.visible=photoPlace==='plaza';if(chinaBackdrop)chinaBackdrop.visible=photoPlace==='china';if(laneBackdrop)laneBackdrop.visible=photoPlace==='lantern';if(bridgeBackdrop)bridgeBackdrop.visible=photoPlace==='gg';if(wharfBackdrop)wharfBackdrop.visible=photoPlace==='wharf';active=true;shot=null;shotDate=null;shotId=null;modal.hidden=false;$('.photo-layout').hidden=false;$('#photoAlbumGrid').hidden=true;$('#photoCaption').value='';$('#photoStatus').textContent=tr('ready');labels();draw();$('#photoTake').focus();}
  function close(){active=false;cancelAnimationFrame(raf);stopCamera();modal.hidden=true;urls.forEach(URL.revokeObjectURL);urls=[];$('#photoAlbumGrid').innerHTML='';}
  function take(){if(shot){shot=null;shotDate=null;shotId=null;labels();return;}if(!selection.size)return;shot=document.createElement('canvas');shot.width=820;shot.height=860;shot.getContext('2d').drawImage(base,0,0);shotDate=new Date();shotId='photo-'+shotDate.getTime();stopCamera();labels();H.chime();}
  function blob(){compose();return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('photo export failed')),'image/png'));}
  async function save(){if(!shot||saving)return;saving=true;labels();$('#photoSave').textContent=tr('saving');try{await dbSave({id:shotId,date:shotDate.toISOString(),caption:$('#photoCaption').value.slice(0,60),characters:[...selection],place:photoPlace,blob:await blob()});$('#photoStatus').textContent=tr('saved');}catch(e){$('#photoStatus').textContent=tr('saveError');}finally{saving=false;labels();}}
  function dataURL(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);});}
  function download(url,filename){const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();}
  async function album(){
    open();stopCamera();$('.photo-layout').hidden=true;const grid=$('#photoAlbumGrid');grid.hidden=false;grid.replaceChildren();
    const back=document.createElement('button');back.className='pill';back.dataset.photo='back';back.textContent=tr('back');grid.append(back);
    try{photoRecords=(await dbRead()).sort((a,b)=>b.date.localeCompare(a.date));if(!active||grid.hidden)return;urls.forEach(URL.revokeObjectURL);urls=[];
      if(!photoRecords.length){const p=document.createElement('p');p.textContent=tr('empty');grid.append(p);}
      for(const p of photoRecords){p.exportURL=await dataURL(p.blob);if(!active||grid.hidden)return;const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption'),button=document.createElement('a');const url=URL.createObjectURL(p.blob);urls.push(url);img.src=url;img.alt=localDate(new Date(p.date))+' '+p.caption;caption.textContent=p.caption;button.className='chip';button.textContent=tr('download');button.href=p.exportURL;button.download=`Cookie-House-${localDate(new Date(p.date))}.png`;button.setAttribute('role','button');figure.append(img,caption,button);grid.append(figure);}
    }catch(e){const p=document.createElement('p');p.textContent=tr('saveError');grid.append(p);}
  }
  async function action(e){const b=e.target.closest('[data-photo]');if(!b||b.disabled)return;const a=b.dataset.photo;
    if(a==='open')return open();if(a==='close')return close();if(a==='camera')return enableCamera();if(a==='take')return take();if(a==='save')return save();if(a==='album')return album();
    if(a==='back'){$('.photo-layout').hidden=false;$('#photoAlbumGrid').hidden=true;return;}
    if(a==='download'&&shot){try{compose();download(canvas.toDataURL('image/png'),`Cookie-House-${localDate(shotDate)}.png`);}catch(e){$('#photoStatus').textContent=tr('saveError');}return;}
    if(a.startsWith('download:')){const p=photoRecords.find(p=>p.id===a.slice(9));if(p)download(p.exportURL,`Cookie-House-${localDate(new Date(p.date))}.png`);return;}
    if(a==='left'||a==='right'){side=a;labels();return;}
    if(a.startsWith('guest:')){const i=+a.slice(6);if(selection.has(i))selection.delete(i);else selection.add(i);shot=null;arrange();labels();$('#photoStatus').textContent=tr(selection.size?'ready':'choose');}
  }
  bar.addEventListener('click',action);modal.addEventListener('click',action);$('#photoSize').addEventListener('input',e=>size=+e.target.value/100);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active)close();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCamera();});window.addEventListener('pagehide',stopCamera);
  return {refresh,close,open};
}
