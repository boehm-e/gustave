# Gustave

## The Project

Gustave is a school project. It aim's to make your life easier.
Im a french student currently in 1st year at ETNA.
I decided to develop a smart assistant which would be able to help everyone in his everyday life.

## How does it work?

Gustave is continuously listening for his keyword 'Gustave' thanks to 'snowboy' library developed by kitt.ai.
When the keyword is detected Gustave launch his continuous speech recognition function :
	After the keyword is detected, Gustave begin to record chunks from microphone, these chunks are sent to a Node.js module that streams the data to the google speech API.
	Doing that, we are able to get what the user say continuously.
Once silence or no speaking for too long is detected, the last sentense recovered from the speech recognition module is sent to our intent detection module:
	Thanks to deep learning, we are able to identify the intent from the user:
	The sentense is sent to the intent module and is classied:
	ex: "who is Roger Waters?" ==> "informations"
	we call the "informations" module with the sentense "who is Roger Waters" in parameters


## Launch

install npm and node on your raspberry pi:
``` bash

sudo apt-get install npm
npm install -g n
n stable
```
then run the app:
`sudo node app.js`

## What is a module?

A Gustave module is like a node module but with specific code organization:
every module give to Gustave a new feature.
The modules are located in epic_modules/custom.
In order to give the possibility to everyone to develop his own module, we had to create a custom code organization:

every module is inside his directory ex:
```
|epic_modules
|__custom
	|__news
		|___news.js
		|___intent.json
```

#### news
the name of the directory has to be the same as the name of the Node.JS file

#### intent.json
```
[
    {"text":"give me the news of the times","label":"news-times"},
    {"text":"give me the news of the world","label":"news-world"}
]
```

every module has a 'intent.json', this contains examples sentenses that can call the module.
Thanks to the deep learning module we are using (natural), we are able to identify the right module with a given sentense even if this sentense is not in our intent.json
in this example, if we say "whate are the times news" Gustave will understand and the intent module will return "news" ('news-times'.split('-')[0]).
The `second part of the label` (times) will be sent to the `start` function of the module "news/news.js".


#### news.js
this is the intelligence of the program, this is the place where you have to develop your program feature(s)
When the intent module call the module, it always calls the `start` function with the `second part of the label` :
	if we take the same sentense as before the second part of the label will be "times"
	so if your module is made to handle multiple questions, you just have to make a simple switch case.


## How to create a module?
noting is more simple:
example: we will create a module name say:
1. create the directory
	create the directory inside epic_modules/custom/
	`cd epic_modules/custom`
	`mkdir say`

2. create say.js and intent.json
	`touch say.js intent.json`

3. edit intent.json
```javascript
[
    {"text":"say hello","label":"say-hello"},
    {"text":"please say hi","label":"say-hello"},
    {"text":"please say good bye","label":"say-bye"},
    {"text":"say bye","label":"say-bye"}
]
```

4. edit say.js
```javascript
var thisModule = 'say';

// module needed
var fs = require('fs');
var natural = require('natural');
var classifier = new natural.BayesClassifier();

// init function called by Gustave at launch, used to determine the module to call
function init() {
    var _json = JSON.parse(fs.readFileSync(__path.modulePath+thisModule+"/intent.json"));
    for (i=0; i<_json.length; i++) {
        var text = _json[i].text;
        var label = _json[i].label;
		classifier.addDocument(text, label);
    }
    classifier.train();
}

var start = function(string) {
	// label is the second part of the label, here it can be : "bye" or "hello"
    var label = classifier.classify(string).split('-')[1];
    var result = "";

    switch(label) {
    case "hello":
        result = "hello world";
	break;
    case "bye":
		result = "bye bye";
    break;
    }

    // return is a string, it will be used by tts engine
    return result;
}

init();
exports.start = start;
```

Thats it, you created your first Gustave module, congratulations!
