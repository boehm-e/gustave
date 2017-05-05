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

const map = (val, in_min, in_max, out_min, out_max) => {
    return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const handleSpeechChunck = (chunk) => {
    if (speechRec) {
	googleSpeech.strm(chunk);
    }
};

micInputStream.on('data', handleSpeechChunck);

googleSpeech.speaking.on('end', (message) => {
    if (speechRec) {
	console.log("END SPEAKING : " + message);
	speechRec = false;
	ledRing.anim.loading.stop();
    }
})

hotWordDetector.on('hotword', function (index) {
    if (speechRec) {
	
    } else {
	console.log(`mpg123 ${__dirname}/resources/detected.mp3`);
	console.log('==========================');
	console.log('/////////// hotword', index);
	console.log('==========================');
	
	exec(`mplayer ${__dirname}/resources/detected.mp3`);

	setTimeout(function(){
	    // start speech recognition
	    googleSpeech.reset();
	    googleSpeech.begin();
	    speechRec = true;
	    ledRing.anim.loading.start();
	}, 400)
    }
});



exports.start = start = () => {
    micInput.start()
    micInputStream.pipe(hotWordDetector);
}

