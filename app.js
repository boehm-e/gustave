const gustave = global.gustave = require('./core/gustave');

// Initializing gustave system modules
gustave.init();
// Starting speech recognition module
gustave.system.speech_recognition.start();


gustave.system.speech_recognition.speaking.on('end', function(intent) {
    console.log("END FROM APP..JS")
    gustave.ask(intent)
})


// gustave.system.led.anim.loading.start()
//gustave.ask("qui est Michel Sardou?")
// gustave.modules.music()
