const EventEmitter = require('events');
const record = require('node-record-lpcm16');
const speaking = new EventEmitter();

var asr;
var lastMsg = "";
var lastDate;
var beginDate;

// NEW MESSAGE LISTNER FROM GOOGLE SPEECH API
const onData = function (data) {
    try {
	lastMsg = data.message.result[0].alternative[0].transcript;
	newLastDate = Date.now();
	let diff = newLastDate - lastDate;
	let timeFromBegining = newLastDate - beginDate;
	if (diff > 500 && timeFromBegining > 1500) {
	    speaking.emit('end', lastMsg);
	}
	
	lastDate = newLastDate;
    } catch(e) {
    }
}


// ERROR LISTNER FROM GOOGLE SPEECH API
const onError = function (error) {
	console.log(error);
}

// START SPEECH RECOGNITION FUNCTION
const begin = () => {
    lastDate = beginDate = Date.now();
    if (asr) {
	asr.removeListener('data', onData);
	asr.removeListener('error', onError);
    }

    asr = require('./asr/google/');
    asr.setLanguage('fr-FR');
    asr.setContentType('audio/l16;rate=16000');
    asr.initialize();
    asr.authorization();

    asr.on('data', onData);
    asr.on('error', onError);

}



// STREAM DATA TO SPEECH RECOGNITION API FUNCITON
const strm = (data) => {
    if ( !(typeof data === 'string' && data.indexOf('start') !== -1))
	asr.stream(data);
}

const stop = () => {

}

exports.strm = strm;
exports.begin = begin;
exports.stop = stop;
exports.speaking = speaking;
