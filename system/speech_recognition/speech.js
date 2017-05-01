const mic = require('mic');
const path = require('path');
const SnowboyDetect = require('snowboy-detect');
const googleSpeech = require('./googleSpeech');

var speechRec = false;
var googleSpeechBegin = false;

const hotWordDetector = new SnowboyDetect({
    resource: path.join(__dirname, "resources", "common.res"),
    model: path.join(__dirname, "resources", "gustave.pmdl"),
    sensitivity: "0.6",
    audioGain: 2.0
});


var micInput = mic({ 'rate': '16000', 'channels': '1', 'debug': false});
var micInputStream = micInput.getAudioStream();

const handleSpeechChunck = (data) => {
    if (speechRec) {
	console.log("streaming");
	googleSpeech.strm(data);
    }
};

micInputStream.on('data', handleSpeechChunck);

googleSpeech.speaking.on('end', (message) => {
    if (speechRec) {
	console.log("END SPEAKING : " + message);
	speechRec = false;
    }
})

hotWordDetector.on('hotword', function (index) {
    if (speechRec) {
	
    } else {
	console.log('==========================');
	console.log('/////////// hotword', index);
	console.log('==========================');

	// start speech recognition
	googleSpeech.begin();
	speechRec = true;
    }
});



exports.start = start = () => {
    micInput.start()
    micInputStream.pipe(hotWordDetector);
}


start()
