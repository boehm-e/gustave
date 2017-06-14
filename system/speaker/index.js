const ObservableArray = require('observable-array');
const request = require("request");
const lame = require('lame');
const Speaker = require('speaker');
const fs = require('fs');
const audioOptions = {channels: 1, bitDepth: 16, sampleRate: 44100};

const queue = ObservableArray();
let isPlaying = false;

const playQueue = () => {
    if (queue.length > 0 && isPlaying == false) {

	isPlaying = true;

	const decoder = lame.Decoder();
	const url = queue[0]
	const stream = request(url);

	stream.pipe(decoder).on("format", function (format) {
	    if (format.channels == 1) {
		format.channels = 2
		format.sampleRate = format.sampleRate / 2
	    }
	    let currentSpeaker = new Speaker(format);
	    this.pipe(currentSpeaker)
	    currentSpeaker.on('finish', function(){
		// remove first item of queue (the one that finished plaing here)
		queue.shift();
		console.log("Finished playing", queue)
		// play the new queue
		playQueue()
		
		isPlaying = false;
	    });
	})
    }
}

queue.on('change', (event) => {

  switch (event.type) {
    case "push":
    playQueue();
    break;
  }

});

const play = exports.play = (url) => {
  queue.push(url);
}

exports.tts = (phrase) => {
  console.log("TTS PHRASE: ", phrase);
  var url = "http://voice2.reverso.net/RestPronunciation.svc/v1/output=json/GetVoiceStream/voiceName=Claire22k?inputText="+new Buffer(phrase.toString()).toString('base64')+"&voiceSpeed=100&mp3BitRate=128";
  queue.push(url);
}
