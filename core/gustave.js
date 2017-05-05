const fs = require('fs');
const path = require('path');

exports.init = () => {
    let gustaveSystem = [];
    return new Promise(function(resolve, reject) {
	fs.readdir(path.join(__dirname, '..', 'system'), (err, systems) => {
	    if (err)
		return reject(err);

	    systems.forEach((system) => {
		console.log(`loading ${system} ...`);
		var systemPath = path.join(__dirname, '..', 'system', system, 'index.js');
		var systemName = system.split('.')[0];

		try {
		    gustaveSystem[systemName] = require(systemPath);
		} catch (err) {
		    console.error("ERROR: initializing system modules");
		    return reject(err);
		}
	    });
	    exports.system = gustaveSystem;
	    return resolve();
	})
    })
}
