var fs = require('fs');
var request = require('request');

var getFirstProp = (obj) => {
  for (var i in obj) {
    try {
      var all = obj[i].extract;
      var ret = all.replace(/{.*?}/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/<.*?>/g, "")
      .replace(/\(.*?\)/g, "");
      return ret.split('.')[0]
    } catch (ex) {
      return "aucune idée";
    }
  }
}

var info = (string) =>  {
  return new Promise((resolve, reject) => {
    string = ' '+string+' ';
    var toRemove = ["?", "!", ".", "qui est" ,"qu'est ce", "qu'un ", " qu'une ", " des ", " une "," que ", " de ", " la ", " un ", " le ", "l'"];
    for (var i=0; i<toRemove.length; i++) {
      string = string.replace(toRemove[i], "");
    }
    string = string.replace(/\s+/g, ' ').trim();
    while (string.indexOf(" ") != -1) {
      string = string.replace(" ", "%20");
    }
    request('https://fr.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='+string, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body)["query"]["pages"];
        string = getFirstProp(result);
        console.log(string);
        return resolve(string);
      } else {
        return reject();
      }
    })
  })
}

var whoIs = (string) => {
  return new Promise((resolve, reject) => {
    resolve(info(string));
  });
}

exports.whoIs = whoIs;
