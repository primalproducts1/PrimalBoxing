'use strict';
/* One music player and one persistent audio graph for speakers AND saved video. */
(()=>{
 const $=id=>document.getElementById(id),T=(es,en)=>window.PrimalI18n.lang==='en'?en:es;
 const audio=$('backgroundMusic'),toggle=$('musicToggle'),stageToggle=$('recordStageMusic'),status=$('musicStatus'),volumeInput=$('musicVolume');
 let context=null,source=null,output=null,mixer=null,userPaused=false,priming=false,blocked=false;
 const inRound=()=>['prepare','work'].includes(document.body.dataset.state);
 function render(){const playing=!audio.paused&&!audio.ended&&inRound()&&!priming;const label=blocked?T('▶ Activar audio','▶ Enable audio'):userPaused?T('♫ Activar música','♫ Enable music'):T('♫ Desactivar música','♫ Disable music');for(const b of [toggle,stageToggle])if(b){b.textContent=label;b.setAttribute('aria-pressed',String(!userPaused));}status.textContent=audio.error?T('No se pudo cargar la música.','Music could not load.'):blocked?T('Toca Activar audio para habilitar el sonido.','Tap Enable audio to allow sound.'):userPaused?T('Música desactivada.','Music disabled.'):playing?T('Música de entrenamiento · volumen bajo','Workout music · low volume'):T('Automática desde la preparación y durante los rounds. Se detiene al descansar, pausar o terminar.','Automatic from preparation and during rounds. Stops during rests, pauses and at the end.');}
 function setVolume(){const level=Math.max(0,Math.min(1,(Number(volumeInput.value)||0)/100));if(output){audio.volume=1;output.gain.value=level;}else audio.volume=level;}
 function getContext(){
  if(!context){const C=window.AudioContext||window.webkitAudioContext;if(!C)throw Error('Web Audio unavailable');context=new C();source=context.createMediaElementSource(audio);output=context.createGain();source.connect(output);output.connect(context.destination);setVolume();}
  return context;
 }
 function unlock(){try{const c=getContext();if(c.state!=='running')void c.resume().catch(()=>{blocked=true;render();});}catch{}}
 function stopAudio(){audio.pause();}
 function play(){if(!inRound()||userPaused||priming)return;unlock();try{const p=audio.play();if(p?.catch)p.catch(()=>{if(inRound()&&!userPaused){blocked=true;render();}});render();}catch{blocked=true;render();}}
 function reconcile(){if(!inRound()||userPaused){if(!priming)stopAudio();}else if(audio.paused&&!priming&&!blocked)play();render();}
 function prime(){if(userPaused||priming)return;blocked=false;unlock();if(inRound()){play();return;}priming=true;audio.muted=true;const finish=()=>{stopAudio();audio.muted=false;priming=false;reconcile();};try{Promise.resolve(audio.play()).then(finish,finish);}catch{finish();}}
 function toggleMusic(){if(blocked){blocked=false;userPaused=false;prime();return;}userPaused=!userPaused;if(userPaused){stopAudio();render();}else prime();}
 function attachRecorder(ctx,destination){detachRecorder();if(ctx!==getContext())throw Error('Recording must use the shared audio context');mixer=destination;output.connect(mixer);return true;}
 function detachRecorder(){if(output&&mixer){try{output.disconnect(mixer);}catch{}}mixer=null;}
 function recover(){blocked=false;unlock();reconcile();}
 toggle.addEventListener('click',toggleMusic);stageToggle?.addEventListener('click',toggleMusic);volumeInput.addEventListener('input',setVolume);
 audio.addEventListener('play',()=>{if(!priming&&(!inRound()||userPaused))stopAudio();render();});audio.addEventListener('pause',render);audio.addEventListener('error',render);audio.addEventListener('canplay',render);
 $('start').addEventListener('click',()=>{if(document.body.dataset.state==='prepare')prime();else{unlock();reconcile();}});$('recordStart').addEventListener('click',()=>{unlock();prime();});
 new MutationObserver(reconcile).observe(document.body,{attributes:true,attributeFilter:['data-state']});document.addEventListener('tyson-language-change',render);
 window.PrimalMusic={voiceStart(){},voiceEnd(){},tryStart:reconcile,getContext,unlock,recover,attachRecorder,detachRecorder,syncRecorder:reconcile,get isPlaying(){return !audio.paused;},get source(){return audio.currentSrc||audio.src;}};
 setVolume();render();
})();
