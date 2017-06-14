var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");

function futurasciences() {
  return new Promise((resolve, reject) => {
    var html = "http://www.futura-sciences.com/";
    var res = request(html, (error, response, body) => {
      var array = [];
      var $ = cheerio.load(body);
      $(".latest-copy").each(function() {
        array.push($(this).text());
      });
      var result = array.splice(0, 2);
      var phrase = "";
      for (var i=0; i<result.length; i++) {
        phrase += result[i]+". ";
      }
      resolve(phrase);
    });
  });
}

function vingtsmin() {
  return new Promise((resolve, reject) => {
    var html = "http://www.20minutes.fr/";
    var res = request(html, (error, response, body) => {
      var array = [];
      var $ = cheerio.load(body);
      $(".teaser-title a").each(function() {
        array.push($(this).text());
      });
      var result = array.splice(0, 2);
      var phrase = "";
      for (var i=0; i<result.length; i++) {
        phrase += result[i]+". ";
      }
      resolve(phrase);
    });
  });
}


function bfm() {
  return new Promise((resolve, reject) => {
    var html = "http://www.bfmtv.com/";
    var res = request(html, (error, response, body) => {
      var array = [];
      var $ = cheerio.load(body);
      $(".title-xl a").each(function() {
        array.push($(this).text());
      });
      var result = array.splice(0, 2);
      var phrase = "";
      for (var i=0; i<result.length; i++) {
        phrase += result[i]+". ";
      }
      resolve(phrase);
    });
  });
}

var news = function(string) {
  string = string.toLowerCase();
  if (string.indexOf("futura science") != -1 || string.indexOf("futura-sciences") != -1)
  var phrase = futurasciences();
  else if (string.indexOf("20 minutes") != -1)
  var phrase = vingtsmin();
  else if (string.indexOf("bfm") != -1)
  var phrase = bfm();

  try {
    phrase = phrase.replace(/\s+/g, ' ').trim();
  } catch(e) {
    console.log("ERROR NEWS : "+e);
  }
  return phrase;
}

var get = (string, label) => {
  return new Promise((resolve, reject) => {
    switch(label) {
      case "futurasciences":
      return resolve(futurasciences());
      break;
      case "bfm":
      return resolve(bfm());
      break;
      case "20minutes":
      return resolve(vingtsmin());
      break;
      default :
      return resolve(vingtsmin());
      break;
    }
  });
}

exports.get = get;
