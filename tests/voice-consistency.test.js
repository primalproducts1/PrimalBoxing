const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const c=fs.readFileSync(path.join(root,'coach.js'),'utf8');
const r=fs.readFileSync(path.join(root,'recorder.js'),'utf8');
const a=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('no hay síntesis del sistema en la sesión normal',()=>{
 assert.doesNotMatch(c,/SpeechSynthesisUtterance|speechSynthesis/);
 assert.match(c,/window\.PrimalVoiceBank/);
 assert.match(c,/s\.start\(at,offset\+\.006,length\)/);
 assert.match(r,/source\.start\(at,start\+0\.006,length\)/);
});
test('una fuente de audio del grabador llega al altavoz y al video',()=>{
 assert.match(r,/coachOutput\.connect\(speakerGain\)\.connect\(ctx\.destination\)/);
 assert.match(r,/coachOutput\.connect\(mixer\)/);
 assert.match(a,/PrimalRecorder\.say\(text,end\)/);
 assert.match(a,/PrimalVoice\.say\(text,end\)/);
});
test('el selector de voz no promete la voz del dispositivo',()=>{
 assert.match(html,/Voz PRIMAL sincronizada/);
 assert.match(html,/id="voiceTuning" hidden/);
 assert.doesNotMatch(html,/Voz del dispositivo/);
});
