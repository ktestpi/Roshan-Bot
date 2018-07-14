const Aghanim = require('aghanim')
const Eris = require('eris')
const path = require('path')
const util = require('erisjs-utils')
const lang = require('./lang.json')
const firebase = require('firebase-admin');
const FirebaseCache = require('./helpers/class/cache.js')
const FireListenCache = require('./helpers/class/firelistencache.js')
const FireSetCache = require('./helpers/class/firesetcache')
const package = require('./package.json')
const opendota = require('./helpers/opendota')
const { sortTourneys, updateAccountSchema } = require('./helpers/basic')

Eris.Guild.prototype.membersWithRole = function(roleName){
  const role = this.roles.find(r => r.name === roleName)
  return role ? this.members.filter(m => m.roles.includes(role.id)) : []
}

// Eris.Message.prototype.replyDM = function(content,file){
//   return new Promise((resolve,reject) => {
//     this.author.getDMChannel().then(channel => channel.createMessage(content,file)).then(m => resolve(m)).catch(err => reject(err))
//   })
// }

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
  const env = require('./env.json');
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

const bot = new Aghanim(TOKEN,CONFIG.setup)
bot.config = CONFIG
bot.config.colors.palette = {default : CONFIG.color}
bot.envprod = ENVPROD
bot.cache = {}

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
bot.addCommandDir(path.join(__dirname,'card'))

bot.addWatcherDir(path.join(__dirname,'watchers'))

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

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

bot.on('postready',() => {
  bot.beam = {}
  bot.server = bot.guilds.find(g => g.id === bot.config.guild.id)
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
    channel_bugs : "<#" + bot.config.guild.bugs + ">",
    channel_biblioteca : "<#" + bot.config.guild.biblioteca + ">",
    channel_foso : "<#" + bot.config.guild.id + ">",
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
    }else if(!bot.envprod && process.argv[2] === '--dbu'){
      bot.config.switches.backupdb = true;
      bot.config.switches.leaderboardUpdate = true;
      console.log('DEV - DB active - UPDATE Leaderboard');
    }else if(!bot.envprod){
      console.log('FAKE DB');
      bot.cache.profiles = new FirebaseCache(bot.db.child('profiles'),{"189996884322942976" : {card : {bg : '0', pos : 'all', heroes : '1,2,3'}, profile : {dota : '112840925', steam : '76561198073106653', twitch : '', twitter : ''}}});
      bot.cache.betatesters = new FireSetCache(bot.db.child('betatesters'),[bot.owner.id,...bot.server.membersWithRole(bot.config.roles.betatester).map(m => m.id)])
      bot.cache.supporters = new FireSetCache(bot.db.child('supporters'),[...bot.server.membersWithRole(bot.config.roles.supporter).map(m => m.id)])
    }
    bot.config.playing = snap.playing;
    bot.config.status = snap.status;
    bot.config.status_act = snap.status_act;
    bot.config.status_url = snap.status_url
    bot.config.status_msg = snap.status_msg
    bot.emit('afterload')
  }).catch(err => {console.log('FAIL to load bot',err);bot.emit('afterload')})
})

bot.setStatus = function(type,status,msg,url,update){
  let self = this
  return new Promise((resolve,reject) => {
    // 0 => playing
    // 1 => streaming
    self.config.status = status !== null ? status : self.config.status
    self.config.status_act = type !== null ? type : self.config.status_act
    self.config.status_msg = msg !== null ? msg : self.config.status_msg
    self.config.status_url = url !== null ? url : self.config.status_url
    let promises = []
    if(update){
      promises.push(bot.db.child('bot').update({status : self.config.status, status_act : self.config.status_act, status_msg : self.config.status_msg, status_url : self.config.status_url}))
    }
    promises.push(self.editStatus(self.config.status, {name : self.config.status_msg, type : self.config.status_act, url : self.config.status_url}))
    Promise.all(promises).then(resolve).catch(reject)
  })
}

bot.on('afterload', function(){
  bot.setStatus(bot.config.status_act,bot.config.status,bot.config.status_msg,bot.config.status_url,false).then(() => console.log('DONE StATuS'))

  if(bot.config.switches.backupdb){ //config.switches.backupdb
    util.firebase.backupDBfile(bot.db,bot,bot.config.guild.backup,{filenameprefix : 'roshan_db_', messageprefix : '**Roshan Backup DB**'}).then(snap => {
      console.log(snap.profiles['189996884322942976']);
      bot.cache.profiles = new FirebaseCache(bot.db.child('profiles'),Object.keys(snap.profiles).map(profile => [profile,snap.profiles[profile]]));
      bot.cache.servers = new FirebaseCache(bot.db.child('servers'),snap.servers);
      if(bot.config.switches.leaderboardUpdate){updateLeaderboard(bot,snap.profiles)};

      const data_public = {discord_invite : bot.config.invite, discord_server : bot.config.server, users : Object.keys(snap.profiles).length, version : package.version}
      bot.db.child('public').update(data_public).then(() => console.log('Update public Info'))

      // Update accounts schema
      // Object.keys(snap.profiles).map(p => ({_id : p, data : snap.profiles[p]})).forEach(p => {
      //   p.data.card.pos = 'all'
      //   p.data.card.bg = '0'
      //   bot.db.child('profiles/'+p._id).update(updateAccountSchema(p.data))
      // })
      bot.cache.profiles.getid = function(id){
        const {dota,steam,twitch,twitter} = this.get(id);
        if(![dota,steam,twitch,twitter].some(el => el === undefined)){
            return {dota,steam,twitch,twitter}
        }
        return undefined
      }

      bot.cache.betatesters = new FireSetCache(bot.db.child('betatesters'),[bot.owner.id,...bot.server.membersWithRole(bot.config.roles.betatester).map(m => m.id),...snap.betatesters ? Object.keys(snap.betatesters).filter(b => snap.betatesters[b]) : []])
      bot.cache.supporters = new FireSetCache(bot.db.child('supporters'),[...bot.server.membersWithRole(bot.config.roles.supporter).map(m => m.id),...snap.supporters ? Object.keys(snap.supporters).filter(b => snap.betatesters[b]) : []])

      bot.cache.feeds = new FireListenCache(bot.db.child('feeds'))
      bot.cache.feeds.order = function(){
        return this.bucket.sort(function(a,b){
          a = parseInt(a._id)
          b = parseInt(b._id)
          return b-a
        })
      }

      bot.cache.tourneys = new FireListenCache(bot.db.child('tourneys'))
      bot.cache.tourneys.order = function(){
        const now = util.date()
        return this.bucket.sort(sortTourneys)
      }
      bot.cache.tourneys.getPlaying = function(){
        const now = util.date()
        return this.bucket.filter(t => t.start < now && now < t.finish)
      }
      bot.cache.tourneys.getNext = function(){
        const now = util.date()
        return this.bucket.filter(t => (t.until && now < t.until) || (t.start && now < t.start))
      }
      console.log('CACHE LOADED');
    })
  }
})

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
  players.forEach(player => {
    if(!player.dota_id){console.log('THIS PROFILE',player.discord_id);}
    urls.push('https://api.opendota.com/api/players/' + player.dota_id)
  })
  util.request.multipleJSON(urls,null,1,(results) => {
    let update = {updated : util.date(), ranking : {}}
    for (let i = 0; i < results.length; i++) {
      if(!results){continue}
      const rank = opendota.util.getMedal(results[i],'raw',bot.replace);
      update.ranking[players[i].discord_id] = {username : players[i].username || results[i].profile.personaname, nick : results[i].profile.personaname || '', avatar : players[i].avatar || results[i].profile.avatarmedium, rank : rank.rank, leaderboard : rank.leaderboard};
    }
    bot.db.child('leaderboard').set(update).then(() => console.log('Ranking Updated'))
  })
  // util.request.getJSONMulti(urls).then((results) => {
  //   let update = {updated : util.date(),ranking : {}};
  //   for (let i = 0; i < results.length; i++) {
  //     if(!results){continue}
  //     const rank = opendota.util.getMedal(results[i],'raw',bot.replace);
  //     update.ranking[players[i].discord_id] = {username : players[i].username || results[i].profile.personaname, nick : results[i].profile.personaname || '', avatar : players[i].avatar || results[i].profile.avatarmedium, rank : rank.rank, leaderboard : rank.leaderboard};
  //   }
  //   bot.db.child('leaderboard').set(update)
  // }).catch(err => console.log(err))
}

bot.connect();
