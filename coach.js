 'use strict';
/* PRIMAL VOZ SINCRONIZADA — versión 2
   La misma biblioteca MP3 se reproduce en la sesión normal y en la grabación.
   Durante la grabación, el grabador envía una ÚNICA pista al altavoz + MediaRecorder.
   Esta versión prioriza identidad de voz frente a la voz nativa del dispositivo:
   Web Speech no expone su señal digital a MediaRecorder. */
(() => {
  const I=window.PrimalI18n, $=id=>document.getElementById(id);
  const Ctor=window.AudioContext||window.webkitAudioContext;
  let ctx=null, gain=null, currentKey='', currentBuffer=null;
  let inflight=new Map(), activeSources=[], serial=0, watchdog=null;
  const normalise=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/^[¡¿]|[.!?¡¿]+$/g,'').replace(/\s+/g,' ');
  const bankId=()=>I.lang+'-'+$('stance').value;
  function update(){
    const sel=$('voices');if(!sel)return;
    sel.replaceChildren(new Option(I.lang==='en'?'PRIMAL · same voice in your video':'PRIMAL · misma voz en el video','primal'));
    sel.value='primal';sel.disabled=true;
    const note=$('audioNote');if(note)note.textContent=I.lang==='en'?
      'This same prerecorded voice plays in the workout and in the exported video. A more natural voice will need new licensed recordings.':
      'La misma voz pregrabada suena durante el entrenamiento y en el video. Para lograr una voz más natural necesitaremos nuevas grabaciones.';
  }
  function stop(){
    serial++;
    if(watchdog)clearTimeout(watchdog);watchdog=null;
    activeSources.forEach(s=>{try{s.stop()}catch{}});
    activeSources=[];
  }
  async function ensureReady(id){
    if(!Ctor)throw new Error('Web Audio no disponible');
    if(!ctx){ctx=new Ctor();gain=ctx.createGain();gain.gain.value=.95;gain.connect(ctx.destination);}
    // Resume immediately when say() was initiated via user interaction.
    const resume=ctx.resume();
    const data=window.PrimalVoiceBank?.[id];
    if(!data)throw new Error('No se encontró la voz '+id);
    if(currentKey!==id){
      if(!inflight.has(id)){
        inflight.set(id,(async()=>{
          const r=await fetch(data.url);
          if(!r.ok)throw new Error('No se pudo cargar '+data.url);
          return ctx.decodeAudioData(await r.arrayBuffer());
        })());
      }
      currentBuffer=await inflight.get(id);
      currentKey=id;
    }
    await resume;
    if(ctx.state!=='running')throw new Error('Sonido bloqueado por el navegador');
    return {data,buffer:currentBuffer};
  }
  function say(text,done=()=>{}){
    stop();const ticket=serial;
    const id=bankId();
    let finished=false;
    const complete=()=>{if(finished||ticket!==serial)return;finished=true;
      if(watchdog)clearTimeout(watchdog);watchdog=null;activeSources=[];done();};
    // Start context setup while the app is handling the user's play gesture.
    void ensureReady(id).then(({data,buffer})=>{
      if(ticket!==serial)return;
      const parts=String(text).split(/\.\s*/).map(normalise).filter(Boolean);
      const clips=parts.map(p=>data.phrases[p]);
      if(!clips.length||clips.some(c=>!c)){
        console.warn('PRIMAL: audio no disponible para',parts.filter((p,i)=>!clips[i]));
        complete();return;
      }
      let at=ctx.currentTime+.045;
      clips.forEach(([offset,duration],i)=>{
        const s=ctx.createBufferSource();s.buffer=buffer;s.connect(gain);
        const length=Math.max(.05,duration-.015);
        s.start(at,offset+.006,length);
        at+=length+.14;
        activeSources.push(s);
        if(i===clips.length-1)s.onended=complete;
      });
      watchdog=setTimeout(complete,Math.ceil((at-ctx.currentTime+2)*1000));
    }).catch(e=>{
      console.warn('PRIMAL: voz compartida no disponible',e);
      const n=$('audioNote');if(n)n.textContent=I.lang==='en'?'Coach audio unavailable. Check coach-audio files.':'No se pudo reproducir la voz. Comprueba la carpeta coach-audio.';
      complete();
    });
  }
  document.addEventListener('tyson-language-change',()=>{stop();update();});
  $('stance')?.addEventListener('change',stop);
  window.PrimalVoice={say,stop,update,get available(){return Boolean(Ctor)}};
  update();
})();
