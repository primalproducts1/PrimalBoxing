const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const recorder=fs.readFileSync(path.join(__dirname,'../recorder.js'),'utf8');

test('la grabación conecta el mismo audio al altavoz y al video',()=>{
  assert.match(recorder,/speakerGain\.gain\.value\s*=\s*0\.98/);
  assert.match(recorder,/coachOutput\.connect\(speakerGain\)\.connect\(ctx\.destination\)/);
  assert.match(recorder,/coachOutput\.connect\(mixer\)/);
  assert.match(recorder,/combinedStream=new MediaStream\(\[\.\.\.canvasStream\.getVideoTracks\(\),\.\.\.mixer\.stream\.getAudioTracks\(\)\]\)/);
});
test('las instrucciones grabadas provienen de una sola pista local',()=>{
  assert.match(app,/if\(window\.PrimalRecorder\?\.active\)\{\s*window\.PrimalRecorder\.say\(text,end\);\s*return;/);
  assert.doesNotMatch(app,/window\.PrimalRecorder\.say\(text,\(\)=>\{\}\)/);
});
test('la pantalla mantiene salida alternativa para Safari',()=>{
  assert.match(recorder,/monitorFallbackMode=!monitorFallbackMode/);
  assert.match(recorder,/createNativeMonitor\(voiceData\.url\)/);
  assert.match(recorder,/if\(monitorFallbackMode\)playNativeMonitor\(clips,token\)/);
});
