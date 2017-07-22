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

bot.dialog('/', [
  function (session) {
    session.send('小話をしましょう。お題は「' + title + '」。');
    session.send('なんか小話…。');
    builder.Prompts.choice(session, '犯人は誰でしょう？', 'A|B|C', builder.ListStyle.button);
  },
  function (session, results) {
    if (results.response) {
        const answer = results.response.entity;
        session.send('You said' + answer);
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
