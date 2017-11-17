const fs = require('fs');
const path = require('path');
const natural = require('natural');
//const PorterStemmerFr = require(path.join('..','./node_modules/natural/lib/natural/stemmers/porter_stemmer_fr'));
//const classifier = new natural.BayesClassifier(PorterStemmerFr);

const classifier = new natural.BayesClassifier();

let gustaveSystem = [];
let gustaveModules = [];

exports.init = () => {

    const systems = fs.readdirSync(path.join(__dirname, '..', 'system'));
    systems.forEach((system) => {
	console.log(`loading ${system} ...`);
	var systemPath = path.join(__dirname, '..', 'system', system, 'index.js');
	var systemName = system.split('.')[0];

	try {
	    gustaveSystem[systemName] = require(systemPath);
	} catch (err) {
	    console.error("ERROR: initializing system modules", err);
	}
    });

    const modules = fs.readdirSync(path.join(__dirname, '..', 'gustave_modules'));
    modules.forEach((module) => {
	console.log(`loading ${module} ...`);
	var modulePath = path.join(__dirname, '..', 'gustave_modules', module, 'index.js');
	var moduleName = module.split('.')[0];

	try {
	    gustaveModules[moduleName] = require(modulePath);
	} catch (err) {
	    console.error("ERROR: initializing gustave modules", err);
	}

	// BUILD INTENT CLASSIFIER FOR EACH MODULE
	const phrase = path.join(__dirname, '..', 'gustave_modules', module, 'intent.json');
	const _json = JSON.parse(fs.readFileSync(phrase));
	for (let i=0; i<_json.length; i++) {
	    let text = _json[i].text;
	    let label = _json[i].label;
	    classifier.addDocument(text, label);
	}
	
    });
    classifier.train();
    
    exports.system = gustaveSystem;
    exports.modules = gustaveModules;
}

exports.ask = async (question) => {
    var label = classifier.classify(question).split('-')[0];
    var subLabel = classifier.classify(question).split('-')[1] || null;
    console.log(label, subLabel)
    var res = gustaveModules[label];
    console.log(res)
    const result = await res.start(subLabel, question);
    console.log("RESPONSE : ", result)
    if (result instanceof Object && result.tts) {
	console.log(result.tts)
	gustave.system.speaker.tts(result.tts)
    }
}
