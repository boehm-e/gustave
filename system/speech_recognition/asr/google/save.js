'use strict';
const KEY = 'AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw';

var events = require('events'),
    util = require('util'),
    google = function () {

        events.EventEmitter.call(this);

        this.contentType = null;
        this.crypto = null;
        this.down = null;
        this.http = null;
        this.https =  null;
        this.language = null;
        this.pair =  null;
        this.up = null;
        this.wss =  null;

        /**
         * Initialize the Google object's variables
         * @public
         */
        this.initialize =  function () {
            this.crypto = require('crypto');
            this.events = require('events');
            this.http = require('http');
            this.https = require('https');
        };

        /**
         * Create a key pair for the Google authentication
         */
        this.authorization =  function () {
            this.pair = this.crypto.randomBytes(8).toString('hex');
            this.start();
        };

        /**
         * Start the audio stream throw a HTTP request
         * @public
         */
        this.start =  function () {
            this._initDown();
            this._initUp();
        };

        /**
         * Send a audio stream throw a HTTP request
         * @param data
         * @public
         */
        this.stream =  function (data) {
            this.up.write(data);
        };

        /**
         * Stop the audio stream
         * @public
         */
        this.stop =  function () {
            this.up.end();
            this.down.end();
        };

        /**
         * Setter for the contentType variable
         * @param contentType
         * @public
         */
        this.setContentType = function (contentType) {
            this.contentType = contentType;
        };

        /**
         * Setter for the lang variable
         * @param language
         * @public
         */
        this.setLanguage = function (language) {
            this.language = language;
        };

        /**
         * Initialise the the POST HTTP request to send audio
         * @private
         */
        this._initUp = function () {
            var options = {
                hostname: 'www.google.com',
                path: '/speech-api/full-duplex/v1/up?lm=dictation&client=chromium&lang=' + this.language + '&pair=' + this.pair + '&key=' + KEY + '&interim&final',
//                path: '/speech-api/full-duplex/v1/up?lm=dictation&client=chromium&lang=' + this.language + '&pair=' + this.pair + '&key=' + KEY + '&interim&hypotheses&utterance&confidence',
                method: 'POST',
                headers: {
                    'Transfer-Encoding': 'chunked',
                    'Content-Type': this.contentType
                }
            };

	    console.log(options.headers)

            this.up = this.https.request(options);
            this.up.on('error', function (error) {
                throw new Error(error);
            });
        };

        /**
         * Initialise the GET HTTP request to receive text
         * @private
         */
        this._initDown = function () {
            var options = {
                hostname: 'www.google.com',
                path: '/speech-api/full-duplex/v1/down?pair=' + this.pair,
                method: 'GET'
            };

            this.down = this.https.get(options);
            this.down.on('response', function (response) {
                response.setEncoding('utf-8');
                response.on('data', function (data) {
		    console.log("SERVER : "+data);
		    try {
			console.log("SERVER : "+JSON.parse(data).result[0].alternative[0].transcript);
		    } catch(e) {

		    }
                    this._data(data);
                }.bind(this));
            }.bind(this));
            this.down.on('error', function (error) {
//		try {
//                    throw new Error(error);
//		} catch(e) {
//		    console.log("ERROR (1) : "+e);
//		}
            }.bind(this));
        };

        /**
         * Received data from the Google HTTP request
         * Emit a custom event with the data
         * @param data
         * @private
         */
        this._data = function (data) {
            var json = JSON.parse(data);
	    this.emit('data', {message: json});
	}
    };

/**
 * Received an error from a Google HTTP request
 * Emit a custom event with the error
 * @param error
 * @private
 */
this._error = function (error) {
    this.emit('error', error);
};
//    };
util.inherits(google, events.EventEmitter);
module.exports = new google();
