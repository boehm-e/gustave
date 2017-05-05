phrase = "amine viens manger"
var url = "http://voice2.reverso.net/RestPronunciation.svc/v1/output=json/GetVoiceStream/voiceName=Claire22k?inputText="+new Buffer(phrase.toString()).toString('base64')+"&voiceSpeed=95&mp3BitRate=128";


var request = require("request");
var lame = require('lame');
var Speaker = require('speaker');
var fs = require('fs');
var audioOptions = {channels: 1, bitDepth: 16, sampleRate: 44100};
var decoder = lame.Decoder();

let queue = [];

const play = (url) => {
    return new Promise(function(resolve, reject) {
	var stream = request(url).pipe(decoder).on("format", function (format) {
	    console.log(format)
	    if (format.channels == 1) {
		format.channels = 2
		format.sampleRate = format.sampleRate / 2
	    }
	    var currentSpeaker = new Speaker(format);
	    currentSpeaker.on('finish', function(){
		console.log("FNISEHDKJF")
	    });
	    this.pipe(currentSpeaker)
	})
    });
}

exports.tts = (phrase) => {
    play(phrase)
}
