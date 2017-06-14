const gustave = global.gustave = require('./core/gustave');

console.log("HERE");
// Initializing gustave system modules
gustave.init();
// Starting speech recognition module
gustave.system.speech_recognition.start();

gustave.system.speech_recognition.speaking.on('end', function(intent) {
  gustave.ask(intent)
})


// gustave.system.led.anim.loading.start()
//gustave.ask("qui est Michel Sardou?")
// gustave.modules.music()
