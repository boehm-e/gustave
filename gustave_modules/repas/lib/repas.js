var request = require("request");
var cheerio = require("cheerio");

let begin = ["je peux vous proposer ", "Vous pouriez manger ", ""]
var random = (max) => {
  return (Math.random() * max).toString().split('.')[0]
}

function ceSoir() {
  return new Promise((resolve, reject) => {
    var html = "http://www.unjourunerecette.fr/que-manger-ce-soir";
    var res = request(html, (error, response, body) => {
      if (error)
      return reject(error);

      var array = [];
      var $ = cheerio.load(body);
      $(".titrecal a").each(function() {
        array.push($(this).text());
      });
      $($(".titrecal a")[0]).text()

      var result = array[random(4)]
      result = result.trim().split('\n')[0].split('est noté')[0]
      return resolve(begin[random(begin.length)] + result);
    });
  });
}

function ceMidi() {
  return new Promise((resolve, reject) => {
    var html = "http://www.unjourunerecette.fr/que-manger-ce-midi";
    var res = request(html, (error, response, body) => {
      if (error)
      return reject(error);

      var array = [];
      var $ = cheerio.load(body);
      $(".titrecal a").each(function() {
        array.push($(this).text());
      });
      $($(".titrecal a")[0]).text()

      var result = array[random(4)];
      result = result.trim().split('\n')[0].split('est noté')[0]
      return resolve(begin[random(begin.length)] + result);
    });
  });
}

var get = function(label) {
  return new Promise((resolve, reject) => {
    switch (label) {
      case "midi":
      return ceMidi().then((data) => {
        resolve(data);
      });
      break;
      case "soir":
      return ceSoir().then((data) => {
        resolve(data);
      });
      default:
      var date = new Date()
      var hour = date.getHours()
      var result = "";
      if (hour > 14) {
        return ceSoir().then((data) => {
          resolve(data);
        });
      } else {
        return ceMidi().then((data) => {
          resolve(data);
        });
      }
      break;
    }
  });
}
exports. get = get;
