var news = require('./lib/news.js')
exports.start = (label, phrase) => {
    return new Promise((resolve, reject) => {
	news.get(string, label).then((data) => {
//	    gustave.system.speaker.tts(data);
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
