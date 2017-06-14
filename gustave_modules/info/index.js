var path = require('path');
var info = require(path.join(__dirname,'lib/info'));
exports.start = (label, phrase) => {
    return new Promise((resolve, reject) => {
	info.whoIs(phrase)
	    .then(result => {
		// launch tts
		resolve({
		    tts: result
		});
	    })
	    .catch(() => {
		reject();
	    });
    })

}
