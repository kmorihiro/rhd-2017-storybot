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

const stories = ["honey","urashima","snowwhite", "3okuen"];
const names = ["太郎", "花子", "次郎", "朋", "佑介", "恭平"];
const commentTypes = ["target", "together"];
const storyTitles = {
  "honey" : "和尚の小話",
  "urashima" : "浦島太郎",
  "snowwhite" : "白雪姫",
  "3okuen": "3億円事件"
};

const storyText = {
  "honey": {
    "intro": "ある日の事。\n和尚(おしょう)さんが、村人に水アメをもらいました。\n\nそれを欲しそうな目で見ていたお寺の小僧たちに、和尚さんが怖い顔で言いました。\n「小僧たちよ。これはな、大人が食べると薬じゃが、子どもが食べるとたちまち死んでしまうと言う、恐ろしい毒の水アメじゃ。決して食べてはいかんぞ」\n\nすると小僧たちは、ニッコリ笑って、\n「はい、絶対に食べません」\nと、言いました。\n「そうか、そうか」\n和尚さんはそれを聞いて、安心して用事に出かけました。\n\n和尚さんがいなくなった事を知った小僧のうちの一人は、\n「えっへへへ。子どもが食べると毒だなんて、よく言うよ。水アメを一人占めしようだなんて、そうはいかないよ」\nと、さっそく水アメを全て食べてしまったのです。\n「ああ、おいしかった」\n\n帰って来た和尚さんはとっても怒って、小僧たちに誰が食べたのか尋ねました。",
    "target": "小僧%(me.name)sは言いました。「%(target.name)sが食べているのを見たよ。」",
    "together": "小僧%(me.name)sは言いました。「私はずっと%(target.name)sと一緒に掃除をしていました。」",
    "ending": "水アメを食べた小僧は誰でしょうか。",
    "image": "http://hukumusume.com/douwa/new/jap_gazou/03_19a.gif",
    "fileName": "test.jpg"
  },
  "urashima": {
    "intro": "むかしむかし、ある村に、心のやさしい浦島太郎(うらしまたろう)という若者がいました。\n浦島さんが海辺を通りかかると、子どもたちが大きなカメを捕まえていました。\nそばによって見てみると、子どもたちがみんなでカメをいじめています。\n「おやおや、かわいそうに、逃がしておやりよ」\n「いやだよ。おらたちが、やっと捕まえたんだもの。どうしようと、おらたちの勝手だろ」\n見るとカメは涙をハラハラとこぼしながら、浦島さんを見つめています。\n浦島さんはお金を取り出すと、子どもたちに差し出して言いました。\n「それでは、このお金をあげるから、おじさんにカメを売っておくれ」\n「うん、それならいいよ」\nこうして浦島さんは、子どもたちからカメを受け取ると、\n「大丈夫かい？もう、捕まるんじゃないよ」\nと、カメをそっと、海の中へ逃がしてやりました。\n\nさて、それから二、三日たったある日の事、浦島さんが海に出かけて魚を釣っていると、カメは涙をハラハラとこぼしながら、浦島さんを見つめています。\n「また捕まっていじめられたのです」\n\n浦島さんは海辺にいた子どもたちに誰がいじめていたか聞きました。",
    "target": "%(me.name)sは言いました。「%(target.name)sがいじめてたんだ！」",
    "together": "%(me.name)sは言いました。「おらは、%(target.name)sと一緒にうちの手伝いをしていただよ。」",
    "ending": "いじめていた子どもは誰でしょうか。",
    "image": "http://hukumusume.com/douwa/gazou/i_gazou/jap/AC_12ILAV05.JPG",
    "fileName": "test.jpg"
  },
  "snowwhite": {
    "intro": "むかしむかし、とっても美しいけれど、心のみにくいお妃さまがいました。\nお妃さまは魔法のカガミを持っていて、いつも魔法のカガミにたずねます。\n「カガミよカガミよ、この世で一番美しいのは誰？」\nお妃さまは、カガミがいつもの様に、\n「あなたが、一番美しいです」\nと、答えるのを待ちました。しかしカガミは、\n「あなたの娘、白雪姫(しらゆきひめ)です」\nと、答えたのです。\n\nお妃さまに殺されそうになった白雪姫は、森に住む七人の小人たちと隠れて暮らす事になりました。\nそして小人たちが山に働きに行っている間、掃除や洗濯や針仕事をしたり、ごはんを作ったりして毎日を楽しく過ごしました。\n「白雪姫、わたしたちが仕事に行っている間、誰も家に入れちゃいけないよ。あの怖いおきさきに、ここが知られてしまうからね」\nと、いつも小人たちは言うのでした。\n\nところがある日、小人たちが山から戻って来ると、白雪姫はバタリと倒れていて、二度と目を開きませんでした。\n\n白雪姫のことが好きだった王子さまは、小人たちに犯人は誰か尋ねました。",
    "target": "%(me.name)sは言いました。「%(target.name)sがお妃さまにしゃべっちゃったんだ！」",
    "together": "%(me.name)sは言いました。「今日僕は、%(target.name)sと仕事をしていたよ。」",
    "ending": "裏切ったのはどの小人でしょうか。",
    "image": "http://hukumusume.com/douwa/gazou/i_gazou/world/gazou/AC_12ILAV31.jpg",
    "fileName": "test.jpg"
  },
  "3okuen": {
    "intro": "2017年7月21日午前9時20分頃―\n東芝府中工場のボーナス約３億円を積んだ日本信託銀行の現金輸送車が、府中刑務所横で偽装した白バイ警察官に止められた・・・。\n\n「コノ車ニ、ダイナマイトガ仕掛ケテアル・・・」\n\nこれが日本の犯罪史上類を見ないミステリーの幕が開いた瞬間だった―。\n偽白バイ警察官は車の下にもぐり込んだ後、叫び声が響いた。\n\n「爆発スルゾ！」\n発炎筒を焚いた犯人は、銀行員４人に対して車外へ避難するよう促すと、運転席に乗り込み３億円を積んだ車ごと走り去った。\n\nわずか３分間の犯行・・・。\n\nこのとき銀行員は危険を顧みず、爆発物を遠ざけてくれた勇敢な警察官だと思い、ただ走り去るのを見守っていた。\n乗り捨てられた白バイが偽モノであることに気付いたのは、それからしばらく経ってからである。だが、すでに犯人の姿は煙のごとく消えていた。\n\n警察は重要参考人である３人を呼び出して尋問した。",
    "target": "%(me.name)sは言いました。「%(target.name)sがお金を奪って逃げていったんだ！」",
    "together": "%(me.name)sは言いました。「私はその日、%(target.name)sと仕事をしていました。」",
    "ending": "犯人は誰でしょうか。",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Nissan_Cedric_Custom_H31.jpg/440px-Nissan_Cedric_Custom_H31.jpg",
    "fileName": "test.jpg"
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
    let charaIds = Array.from(Array(charaNum).keys());
    // random sort
    charaIds = charaIds.map(a => (
      {
        "weight": Math.random(),
        "value": a
      })).sort((a, b) => a.weight - b.weight)
      .map(a => a.value);
    if (i === answerId) {
      do {
        target = charaIds.pop();
      } while (target == i);
      charas[i] = new Character(i, tempNames.pop(), true, "target", target)
    } else {
      let commentType = commentTypes[Math.floor(Math.random() * commentTypes.length)];
      switch (commentType) {
        case "target":
          charas[i] = new Character(i, tempNames.pop(), false, commentType, answerId);
          break;
        case "together":
          do {
            target = charaIds.pop();
          } while (target === i || target === answerId);
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
    // send an image
    const msg = new builder.Message(session)
      .addAttachment({
        contentUrl: storyText[story].image,
        contentType: 'image/jpg',
        name: storyText[story].fileName
      });
    session.send(msg);

    session.send(storyText[story].intro);
    let i = 0;
    for (i; i < charas.length; i++) {
      let me = charas[i];
      let target = charas.filter(chara => chara.id === me.refId)[0];
      session.send(sprintf(storyText[story][me.commentType], {me: me, target: target}));
    }
    builder.Prompts.choice(session, storyText[story].ending, charaNames, builder.ListStyle.button);
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
