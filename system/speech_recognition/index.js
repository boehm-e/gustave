const mic = require('mic');
const path = require('path');
const SnowboyDetect = require('snowboy-detect');
const googleSpeech = require('./googleSpeech');
const exec = require('child_process').exec
const ledRing = require('../led/index');

var speechRec = false;
var googleSpeechBegin = false;

const hotWordDetector = new SnowboyDetect({
  resource: path.join(__dirname, "resources", "common.res"),
  model: path.join(__dirname, "resources", "gustave.pmdl"),
  sensitivity: "0.45",
  audioGain: 2.0
});

var micInput = mic({ 'rate': '16000', 'channels': '1', 'debug': false});
var micInputStream = micInput.getAudioStream();

const map = (val, in_min, in_max, out_min, out_max) => (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

const handleSpeechChunck = (chunk) => speechRec ? googleSpeech.strm(chunk) : null

micInputStream.on('data', handleSpeechChunck);

googleSpeech.speaking.on('end', (message) => {
  if (speechRec) {
    console.log("END SPEAKING : " + message);
    speechRec = false;
    ledRing.anim.loading.stop();
  }
})

hotWordDetector.on('hotword', index => {
  if (!speechRec) {
    console.log('==========================');
    console.log('/////////// hotword', index);
    console.log('==========================');

    exec(`mplayer ${__dirname}/resources/detected.mp3`);

    setTimeout(() => {
      // start speech recognition
      googleSpeech.reset();
      googleSpeech.begin();
      speechRec = true;
      ledRing.anim.loading.start();
    }, 400)
  }
});


exports.start = () => {
  micInput.start();
  micInputStream.pipe(hotWordDetector);
}

exports.stop = () => {
  micInput.stop();
  speechRec = false;
  ledRing.anim.loading.stop();
}

exports.speaking = googleSpeech.speaking;
