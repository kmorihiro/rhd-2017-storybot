"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
  appId: process.env['MicrosoftAppId'],
  appPassword: process.env['MicrosoftAppPassword'],
  stateEndpoint: process.env['BotStateEndpoint'],
  openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

var title = '和尚の蜂蜜';
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
var names = characters.map(character => character.name);

bot.dialog('/', [
  function (session) {
    session.send('小話をしましょう。お題は「' + title + '」。');
    session.send('なんか小話…。');
    builder.Prompts.choice(session, '犯人は誰でしょう？', names, builder.ListStyle.button);
  },
  function (session, results) {
    if (results.response) {
      const answer = results.response.entity;
      const answerCharacter = characters.filter((item, index) => item.name == answer);
      const correctCharacter = characters.filter((item, index) => item.answer == true)[0];
      if (answerCharacter[0] && answerCharacter[0].answer) {
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
