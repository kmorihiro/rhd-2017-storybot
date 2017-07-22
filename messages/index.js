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

// const stories = ["honey1","murder1","murder2"];
const stories = ["honey1"];
const names = ["太郎", "花子", "次郎", "朋", "佑介", "恭平"];
const commentTypes = ["target", "together"];
const storyTitles = {
  "honey1" : "和尚の小話",
  "murder1" : "殺人事件１",
  "murder2" : "殺人事件２"
};

const storyText = {
  "honey1": {
    "intro": "ある日の事。\n和尚(おしょう)さんが、村人に水アメをもらいました。\n \nそれを欲しそうな目で見ていたお寺の小僧たちに、和尚さんが怖い顔で言いました。\n「小僧たちよ。これはな、大人が食べると薬じゃが、子どもが食べるとたちまち死んでしまうと言う、恐ろしい毒の水アメじゃ。決して食べてはいかんぞ」\n \nすると小僧たちは、ニッコリ笑って、\n「はい、絶対に食べません」\nと、言いました。\n「そうか、そうか」\n和尚さんはそれを聞いて、安心して用事に出かけました。\n \n和尚さんがいなくなった事を知った小僧のうちの一人は、\n「えっへへへ。子どもが食べると毒だなんて、よく言うよ。水アメを一人占めしようだなんて、そうはいかないよ」\nと、さっそく水アメを全て食べてしまったのです。\n「ああ、おいしかった」\n \n水アメを食べた小僧は誰でしょうか。",
    "target": "小僧%(me.name)sは言いました。「%(target.name)sが食べているのを見たよ。」",
    "together": "小僧%(me.name)sは言いました。「私はずっと%(target.name)sと一緒に掃除をしていました。」",
    "ending": ""
  },
  "murder1": {
    "intro": "むかしむかし、ある村に、心のやさしい浦島太郎(うらしまたろう)という若者がいました。\n浦島さんが海辺を通りかかると、子どもたちが大きなカメを捕まえていました。\nそばによって見てみると、子どもたちがみんなでカメをいじめています。\n「おやおや、かわいそうに、逃がしておやりよ」\n「いやだよ。おらたちが、やっと捕まえたんだもの。どうしようと、おらたちの勝手だろ」\n見るとカメは涙をハラハラとこぼしながら、浦島さんを見つめています。\n浦島さんはお金を取り出すと、子どもたちに差し出して言いました。\n「それでは、このお金をあげるから、おじさんにカメを売っておくれ」\n「うん、それならいいよ」\nこうして浦島さんは、子どもたちからカメを受け取ると、\n「大丈夫かい？もう、捕まるんじゃないよ」\nと、カメをそっと、海の中へ逃がしてやりました。\n \nさて、それから二、三日たったある日の事、浦島さんが海に出かけて魚を釣っていると、カメは涙をハラハラとこぼしながら、浦島さんを見つめています。\n「また捕まっていじめられたのです」\n \nいじめていた子どもは誰でしょうか。",
    "target": "%sは言いました。「%sがいじめてたんだ！」",
    "together": "%sは言いました。「今日は、%sと一緒にいたよ。」",
    "ending": ""
  },
  "snowwhite": {
    "intro": "むかしむかし、とっても美しいけれど、心のみにくいお妃さまがいました。\nお妃さまは魔法のカガミを持っていて、いつも魔法のカガミにたずねます。\n「カガミよカガミよ、この世で一番美しいのは誰？」\nお妃さまは、カガミがいつもの様に、\n「あなたが、一番美しいです」\nと、答えるのを待ちました。しかしカガミは、\n「あなたの娘、白雪姫(しらゆきひめ)です」\nと、答えたのです。\n \nお妃さまに殺されそうになった白雪姫は、森に住む七人の小人たちと隠れて暮らす事になりました。\nそして小人たちが山に働きに行っている間、掃除や洗濯や針仕事をしたり、ごはんを作ったりして毎日を楽しく過ごしました。\n「白雪姫、わたしたちが仕事に行っている間、誰も家に入れちゃいけないよ。あの怖いおきさきに、ここが知られてしまうからね」\nと、いつも小人たちは言うのでした。\n \nところがある日、小人たちが山から戻って来ると、白雪姫はバタリと倒れていて、二度と目を開きませんでした。\n \n裏切ったのはどの小人でしょうか。",
    "target": "%sは言いました。「%sがお妃さまにしゃべっちゃったんだ！」",
    "together": "%sは言いました。「今日は、%sと仕事を一緒にしていたよ。」",
    "ending": ""
  },
}




var story;
var charas = [];
var charaNames = [];



function initStory() {
  const charaNum = 3;
  const answerId = Math.floor(Math.random() * charaNum);
  let tempNames = [].concat(names);
  tempNames = tempNames.map(a => (
    {
      "weight": Math.random(),
       "value": a
    })).sort((a, b) => a.weight - b.weight)
    .map(a => a.value);

  // set story title
  story = stories[Math.floor(Math.random()*stories.length)];

  // set characters
  let i = 0;
  let target;
  for (i = 0; i < 3; i++) {
    if (i === answerId) {
      let charaIds = Array.from(Array(charaNum).keys());
      do {
        target = charaIds.pop()
      } while (target !== i)
      charas[i] = new Character(i, tempNames.pop(), true, "target", target)
    } else {
      let commentType = commentTypes[Math.floor(Math.random() * commentTypes.length)];
      switch (commentType) {
        case "target":
          charas[i] = new Character(i, tempNames.pop(), false, commentType, answerId);
          break;
        case "together":
          let charaIds = Array.from(Array(charaNum).keys());
          do {
            target = charaIds.pop()
          } while (target !== i && target !== answerId)
          charas[i] = new Character(i, tempNames.pop(), false, commentType, answerId);
          break;
      }
    }
  }
  charaNames = charas.map(character => character.name);
}


bot.dialog('/', [
  function (session) {
    initStory();
    session.send('小話をしましょう。お題は「' + storyTitles[story] + '」。');
    session.send(storyText[story].intro);
    let i = 0;
    for (i; i < charas.length; i++) {
      let me = charas[i];
      let target = charas.filter(chara => chara.id === me.refId)[0];
      session.send(sprintf(storyText[story][me.commentType], {me: me, target: target}));
    }
    builder.Prompts.choice(session, '犯人は誰でしょう？', charaNames, builder.ListStyle.button);
  },
  function (session, results) {
    if (results.response) {
      const answer = results.response.entity;
      const answerCharacter = charas.filter((item, index) => item.name == answer);
      const correctCharacter = charas.filter((item, index) => item.targetFlag == true)[0];
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
