var repas = require('./lib/repas.js')
exports.start = (label, phrase) => {
	return new Promise((resolve, reject) => {
		repas.get(label).then((data) => {
			gustave.system.speaker.tts(data);
			return resolve(data);
		})
		.catch((err) => {
			return reject(err);
		})
	})
}

// exports.render = () {
// 	return {
// 		"html"
// 	}
// }
