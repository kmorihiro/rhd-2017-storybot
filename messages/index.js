"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
const sprintf = require("sprintf-js").sprintf;

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
  appId: process.env['MicrosoftAppId'],
  appPassword: process.env['MicrosoftAppPassword'],
  stateEndpoint: process.env['BotStateEndpoint'],
  openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));



function Character(_id, _name, _target_flag, _comment_type, _ref_id) {
  this.id = _id;
  this.name = _name;
  this.targetFlag = _target_flag;
  this.commentType = _comment_type;
  this.refId = _ref_id;
};

const stories = ["honey1","murder1","murder2"];
const names = ["太郎", "花子", "次郎", "朋", "佑介", "恭平"];
const commentTypes = ["target", "together"];
const storyTitles = {
  "honey1" : "和尚の小話",
  "murder1" : "殺人事件１",
  "murder2" : "殺人事件２"
};

const storyText = {
  "honey1": {
    "intro": "昔々、あるところに和尚のなんたら…和尚は小僧たちにききました。",
    "target": "%(chara[i].name)sは言いました。「%(refId)sが犯人です。」",
    "together": "",
    "ending": ""
  }
}


var story;
var charas = [];
var charaNames = [];



function initStory() {
  const charaNum = 3;
  const answerId = Math.floor(Math.random() * charaNum);
  let tempNames = [].concat(names);

  // set story title
  story = stories[Math.floor(Math.random()*stories.length)];

  // set characters
  let i = 0;
  for (i = 0; i < 3; i++) {
    if (i === answerId) {
      let charaIds = Array.from(Array(charaNum).keys());
      do {
        let target = charaIds.pop()
      } while (target !== i)
      charas[i] = new Character(i, tempNames.pop(), true, "target", target)
    } else {
      let commentType = commentTypes(Math.fllor(Math.random() * commenTypes.length));
      switch (commentType) {
        case "target":
          charas[i] = new Character(i, tempNames.pop(), false, commentType, answerId);
          break;
        case "together":
          let charaIds = Array.from(Array(charaNum).keys());
          do {
            let target = charaIds.pop()
          } while (target !== i && target !== answerId)
          charas[i] = new Character(i, tempNames.pop(), false, commentType, answerId);
          break;
      }
    }
  }
  charaNames = charas.map(character => character.name);
}


var characters = [
  {
    id: 1,
    name : 'A',
    answer: true
  },
  {
    id: 2,
    name : 'B',
    answer: false
  },
  {
    id: 3,
    name : 'C',
    answer: false
  }
];

bot.dialog('/', [
  function (session) {
    initStory();
    session.send("ok1");
    session.send('小話をしましょう。お題は「' + storyTitles[story] + '」。');
    session.send('なんか小話…。');
    builder.Prompts.choice(session, '犯人は誰でしょう？', charaNames, builder.ListStyle.button);
  },
  function (session, results) {
    if (results.response) {
      const answer = results.response.entity;
      const answerCharacter = charas.filter((item, index) => item.name == answer);
      const correctCharacter = charas.filter((item, index) => item.answer == true)[0];
      if (answerCharacter[0] && answerCharacter[0].targetFlag) {
        session.send('犯人は' + correctCharacter.name + 'です。正解！');
      } else {
        session.send('犯人は' + correctCharacter.name + 'です。不正解！');
      }
    }
  }
]);

if (useEmulator) {
  var restify = require('restify');
  var server = restify.createServer();
  server.listen(3978, function() {
    console.log('test bot endpont at http://localhost:3978/api/messages');
  });
  server.post('/api/messages', connector.listen());    
} else {
  module.exports = { default: connector.listen() }
}
