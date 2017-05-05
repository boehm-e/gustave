const Gustave = require('./core/gustave');

(async () => {

    await Gustave.init();
    Gustave.system.speech_recognition.start();

})()
