const Drow = require('drow')
const path = require('path')
const util = require('../erisjs-utils')
const lang = require('./lang.json')
const firebase = require('firebase-admin');
const FirebaseCache = require('./helpers/cache.js')
const package = require('./package.json')
const opendota = require('./helpers/opendota')

let TOKEN;
const firebaseConfig = {
  "type": "service_account",
  // "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  // "client_email": process.env.CLIENT_EMAIL,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
};
let ENVPROD = false;
try{
  TOKEN = process.env.BOT_TOKEN;
  firebaseConfig.private_key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
  firebaseConfig.client_email = process.env.CLIENT_EMAIL;
  ENVPROD = true
}catch(err){
  const env = require('./.env');
  TOKEN = env.BOT_TOKEN;
  firebaseConfig.private_key = env.PRIVATE_KEY.replace(/\\n/g, '\n');
  firebaseConfig.client_email = env.CLIENT_EMAIL
}

let CONFIG = require('./config.json')
CONFIG.color = util.color.convert(CONFIG.color,'hex-int');
for(cat in CONFIG.colors){
  if(typeof CONFIG.colors[cat] == 'string'){CONFIG.colors[cat] = util.color.convert(CONFIG.colors[cat],'hex-int');continue}
  for(c in CONFIG.colors[cat]){
    CONFIG.colors[cat][c] = util.color.convert(CONFIG.colors[cat][c],'hex-int');
  }
}

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL: "https://roshan-bot.firebaseio.com"
});

const bot = new Drow(Object.assign({token : TOKEN},CONFIG.setup))
bot.config = CONFIG
bot.config.colors.palette = {default : CONFIG.color}
bot.envprod = ENVPROD
bot.cache = {}
// bot.helpers = require('./helpers/account.js')
// bot.helpers = {}
// for (var h in bot.helpers) {
//   bot.helpers[h] = bot.helpers[h].bind(bot)
// }
bot.defineCategories([{name : 'General', help : 'Ayuda de general'},
{name : 'Dota 2', help : 'Ayuda de Dota 2'},
{name : 'Cuenta', help : 'Ayuda para la gestión de la cuenta en Roshan'},
{name : 'Aegis', help : 'Ayuda para comandos de admin'},
{name : 'Owner', help : 'Ayuda para comandos de propietario'},
{name : 'Fun', help : 'Ayuda los comandos de emojis y memes'}
])

bot.addCommandDir(path.join(__dirname,'opendota'))
bot.addCommandDir(path.join(__dirname,'account'))
bot.addCommandDir(path.join(__dirname,'aegis'))
bot.addCommandDir(path.join(__dirname,'general'))
bot.addCommandDir(path.join(__dirname,'fun'))
bot.addCommandDir(path.join(__dirname,'bot'))
bot.addCommandDir(path.join(__dirname,'dota2'))

bot.addWatcherDir(path.join(__dirname,'watchers'))
// bot.addCommandDir(path.join(__dirname, 'subcommands'))

bot.messageAllGuilds = function(msg,all,mode){
  if(!this.config.switches.msgGuilds){return}
  const message = mode !== 'feeds' ? msg.content : `${this.config.emojis.default.feeds} **${msg.author.username}**:\n${msg.content}`;
  const servers = this.cache.servers.getall()
  if(!servers){return};
  if(msg.attachments.length < 1){
    servers.forEach(server => {
      if(!all && !server[mode].enable){return};
      this.createMessage(server[mode].channel,{content: message, embed : msg.embeds.length > 0 ? msg.embeds[0] : {},disableEveryone:false});
    })
  }else{
    util.msg.sendImage(msg.attachments[0].url).then(buffer => {
      this.createMessage(server[channel].channel,{content: message, embed : msg.embeds.length > 0 ? msg.embeds[0] : {},disableEveryone:false},{file : results, name : msg.attachments[0].filename})
    })
  }
  // if(!notAll){config.logger.add(mode,message,true)}else{config.logger.add('shout',message,true);}
}

bot.on('postready',() => {
  bot.beam = {}
  bot.config.emojis.bot = util.guild.loadEmojis(bot.guilds.get(bot.config.guild.id));
  // console.log(bot.owner);
  bot.replace = new util.string.ReplaceWithDictionaryAndLang([{
    bot_name : bot.user.username,
    bot_icon : bot.user.avatarURL,
    author_name : bot.owner.username,
    author_id : bot.owner.id,
    // role_admin : config.roles.admin,
    // role_pin : config.roles.pin,
    // role_aegis : config.roles.aegis,
    // channel_bugs : "<#" + config.guild.bugs + ">",
    // channel_biblioteca : "<#" + config.guild.biblioteca + ">",
    // channel_foso : "<#" + config.guild.id + ">",
    server : bot.config.server,
    version : package.version,
    update : bot.config.update
  },bot.config.emojis.bot],true,lang);

  bot.logger = new util.helper.Logger(
    bot.guilds.get(bot.config.guild.id).channels.get(bot.config.guild.notifications),
    Object.assign({},{name : 'Roshan', title : 'Notificaciones', color : bot.config.color},{events : CONFIG.logger}), 10);
  // bot.logger.log('memberin','Hi')
  // bot.logger.log('oderror','Bye')
  // bot.logger.log('oderror','Bye')
  // bot.logger.log('memberin','Hi')
  bot.db.child('bot').once('value').then(snap => {
    if(!snap.exists()){return}else{snap = snap.val()}
    bot.config.switches = snap.switches
    if(!bot.envprod){
      bot.config.switches.leaderboardUpdate = false;
      bot.config.switches.backupdb = false;
    }
    // console.log('ENV',bot.envprod,process.argv[2]);
    if(!bot.envprod && process.argv[2] === '--db'){
      bot.config.switches.backupdb = true;
      console.log('DEV - DB active');
    }
    bot.config.playing = snap.playing;
    bot.emit('afterload')
  }).catch(err => {console.log('FAIL to load bot',err);bot.emit('afterload')})
  // console.log(bot.replace);
})

bot.on('afterload', function(){
  bot.editStatus("online", {name : bot.config.playing, type : 0});
  // console.log('CONFIG',bot.config);
  // console.log(bot.config.switches);
  if(bot.config.switches.backupdb){ //config.switches.backupdb
    util.firebase.backupDBfile(bot.db,bot,bot.config.guild.backup,{filenameprefix : 'roshan_db_', messageprefix : '**Roshan Backup DB**'}).then(snap => {
      // console.log('DB',bot.db);
      bot.cache.servers = new FirebaseCache(bot.db.child('servers'),snap.servers);
      // console.log('CACHE DONE');
      // bot.cache.servers.modify('327603106257043456',{feeds : {enable : false}}).then((el) => console.log('MODIFIED',el))
      if(bot.config.switches.leaderboardUpdate){updateLeaderboard(bot,snap.profiles)};
      // return;
      bot.cache.profiles = new FirebaseCache(bot.db.child('profiles'),Object.keys(snap.profiles).map(profile => [profile,snap.profiles[profile].profile]),'profile');

      // bot.cache.profiles.modify('189996884322942976',{test : 'test'})
      bot.cache.profiles.getid = function(id){
        const {dota,steam,twitch,twitter} = this.get(id);
        if(![dota,steam,twitch,twitter].some(el => el === undefined)){
            return {dota,steam,twitch,twitter}
        }
        return undefined};
      console.log('CACHE LOADED');
    })
  }
})
// console.log(bot.commands);

// var profiles = firebase.database().ref('profiles');
bot.firebase = firebase;
bot.db = firebase.database().ref();

// bot.db.child('profiles').once('value').then(snap => {
//   if(!snap.exists()){return}
//   snap = snap.val()
//   // console.log(snap);
//   let profiles = Object.keys(snap).map(profile => Object.assign({},snap[profile],{_id : profile}))
//   profiles.forEach(profile => {
//     bot.db.child(`profiles/${profile._id}/profile`).update({dota : profile.profile.dotabuff})
//   })
// })

updateLeaderboard = function(bot,snap){
  let urls = [];
  let players = Object.keys(snap).map(p => {return {discord_id : p, dota_id : snap[p].profile.dota}})//.filter(p => bot.guilds.find(g => g.members.get(p.discord_id)));
  for (var i = 0; i < players.length; i++) {
    let guild = bot.guilds.find(g => g.members.get(players[i].discord_id)), member;
    if(guild){
      member = guild.members.get(players[i].discord_id)
    }
    players[i].username = member ? member.username : false;
    players[i].avatar = member ? member.avatarURL : false;
  }
  players.forEach(player => urls.push('https://api.opendota.com/api/players/' + player.dota_id))
  util.request.getJSONMulti(urls).then((results) => {
    let update = {updated : util.date(),ranking : {}};
    for (let i = 0; i < results.length; i++) {
      if(!results){continue}
      const rank = opendota.util.getMedal(results[i],'raw',bot.replace);
      update.ranking[players[i].discord_id] = {username : players[i].username || results[i].profile.personaname, nick : results[i].profile.personaname || '', avatar : players[i].avatar || results[i].profile.avatarmedium, rank : rank.rank, leaderboard : rank.leaderboard};
    }
    bot.db.child('leaderboard').set(update)
  }).catch(err => console.log(err))
}

bot.connect();
