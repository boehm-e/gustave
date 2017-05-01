'use strict';
const AUTHORIZATION_HOST = 'stream.watsonplatform.net',
      AUTHORIZATION_PATH = '/authorization/api/v1/token?url=https://stream.watsonplatform.net/speech-to-text/api',
      AUTHORIZATION_KEY = 'Basic OWVhYTZiYWItOGQ1Yi00ZjlkLTg2ZDctZGEzNDMxZTFlMzRiOmtaeDJVaUVIT3JvZw==',
      WEBSOCKET_URL = 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=';

var events = require('events'),
    util = require('util'),
    ibm = function () {

        events.EventEmitter.call(this);

        this.contentType = null;
        this.https =  null;
        this.language = null;
        this.token =  null;
        this.wss =  null;

        /**
         * Initialize the IBM object's variables
         * @public
         */
        this.initialize =  function () {
            this.events = require('events');
            this.https = require('https');
            this.token = '';
        };

        /**
         * Request an authorization to use IBM throw a HTTP request
         * Store a token
         * Create a WebSocket between RogerVoice and IBM
         * @public
         */
        this.authorization =  function () {
            var options = {
                    host: AUTHORIZATION_HOST,
                    path: AUTHORIZATION_PATH,
                    headers: {
                        'Authorization': AUTHORIZATION_KEY
                    }
                },
                request,
                WebSocket = require('ws');

            this.token = '';
            request = this.https.request(options, function (response) {
                if (response.statusCode !== 200)
                    return this._error();
                response.on('data', function (chunk) {
                    this.token += chunk;
                }.bind(this));
                response.on('end', function () {
                    this.wss = new WebSocket(WEBSOCKET_URL + this.token + '&model=' + this.language);
                    this.wss.onopen = this.start.bind(this);
                    this.wss.onmessage = this._data.bind(this);
                    this.wss.onerror = this._error.bind(this);
                }.bind(this));
            }.bind(this));
            request.on('error', function () {
                this._error();
            }.bind(this));
            request.end();
        };

        /**
         * Start the audio stream throw a WebSocket
         * @public
         */
        this.start =  function () {
            if (this.wss && this.wss.readyState === 1)
                this.wss.send(JSON.stringify({
                    'action': 'start',
                    'content-type': this.contentType,
                    'continuous': true,
                    'max_alternatives': 1,
                    'interim_results': true,
                    'word_confidence': false,
                    'timestamps': false,
                    'inactivity_timeout': -1
                }));
        };

        /**
         * Send a audio stream throw a WebSocket
         * @param data
         * @public
         */
        this.stream =  function (data) {
            if (this.wss && this.wss.readyState === 1)
                this.wss.send(data);
        };

        /**
         * Stop the audio stream
         * @public
         */
        this.stop =  function () {
            if (this.wss && this.wss.readyState === 1) {
                this.wss.send(JSON.stringify({
                    'action': 'stop'
                }));
                this.wss = null;
            }
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
         * Received data from the IBM's WebSocket
         * Emit a custom event with the data
         * @param data
         * @private
         */
        this._data = function (data) {
            var json = JSON.parse(data.data);
            if (json.results && json.results[0] && json.results[0].alternatives[0])
                this.emit('data', {message: json.results[0].alternatives[0].transcript, final: json.results[0].final});
        };

        /**
         * Received an error from the IBM's WebSocket or HTTP request
         * Emit a custom event with the error
         * @param error
         * @private
         */
        this._error = function (error) {
            this.emit('error', error);
        };
};
util.inherits(ibm, events.EventEmitter);
module.exports = new ibm();