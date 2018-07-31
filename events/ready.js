const { Event } = require('aghanim')
const util = require('erisjs-utils')
const Eris = require('eris')
const FirebaseCache = require('../helpers/classes/firebasecache.js')
const FireListenCache = require('../helpers/classes/firelistencache.js')
const FireSetCache = require('../helpers/classes/firesetcache')
const DiscordLogger = require('../helpers/classes/logger')
const lang = require('../lang.json')
const { sortTourneys, updateAccountSchema } = require('../helpers/basic')
const package = require('../package.json')
const opendota = require('../helpers/opendota')

module.exports = new Event('','ready',{}, function(){
  //Create containers
  this.cache = {}
  this.scripts = {}
  this.scriptsUpdate()

  //Save guild dev
  this.server = this.guilds.get(this.config.guild.id)

  this.config.emojis.bot = util.guild.loadEmojis(this.server);

  this.replace = new util.string.ReplaceWithDictionaryAndLang([{ //Create a replacer with bot info + emojis + lang
    bot_name : this.user.username,
    bot_icon : this.user.avatarURL,
    author_name : this.owner.username,
    author_id : this.owner.id,
    // role_admin : config.roles.admin,
    // role_pin : config.roles.pin,
    // role_aegis : config.roles.aegis,
    channel_bugs : "<#" + this.config.guild.bugs + ">",
    channel_biblioteca : "<#" + this.config.guild.biblioteca + ">",
    channel_foso : "<#" + this.config.guild.id + ">",
    server : this.config.server,
    version : package.version,
    update : this.config.update
  },this.config.emojis.bot],true,lang);
  this.discordLog = new DiscordLogger(this.server.channels.get(this.config.guild.notifications),this.config.logger)

  process.on('unhandledRejection', (reason, p) => {
    this.discordLog.send('error','Unhandled Rejection at: '+p, null ,reason);
    // application specific logging, throwing an error, or other logic here
  });

  this.db.child('bot').once('value').then(snap => {
    if(!snap.exists()){return}else{snap = snap.val()}
    this.config.switches = snap.switches
    if(!this.envprod){
      this.discordLog.log('info','Creating a fake DB...');
      this.config.switches.leaderboardUpdate = false;
      this.config.switches.backupdb = false;
      this.cache.profiles = new FirebaseCache(this.db.child('profiles'),{"189996884322942976" : {card : {bg : '0', pos : 'all', heroes : '1,2,3'}, profile : {dota : '112840925', steam : '76561198073106653', twitch : '', twitter : ''}}});
      this.cache.betatesters = new FireSetCache(this.db.child('betatesters'),[this.owner.id,...this.server.membersWithRole(this.config.roles.betatester).map(m => m.id)])
      this.cache.supporters = new FireSetCache(this.db.child('supporters'),[...this.server.membersWithRole(this.config.roles.supporter).map(m => m.id)])
    }

    //flags DEVMODE
    if(!this.envprod && process.argv[2] === '--db'){
      this.config.switches.backupdb = true;
      this.discordLog.log('info','DEV - DB active')
    }else if(!this.envprod && process.argv[2] === '--dbu'){
      this.config.switches.backupdb = true;
      this.config.switches.leaderboardUpdate = true;
      this.discordLog.log('info','DEV - DB active - UPDATE Leaderboard')
    }
    this.config.playing = snap.playing;
    this.config.status = snap.status;
    this.config.status_act = snap.status_act;
    this.config.status_url = snap.status_url
    this.config.status_msg = snap.status_msg
    this.setStatus(this.config.status_act,this.config.status,this.config.status_msg,this.config.status_url,false).then(() => this.discordLog.log('info','Status setted'))
    this.emit('postready')
  }).catch(err => {console.log(err);this.emit('postready')})

  this.on('postready',function(){
    if(this.config.switches.backupdb){ //config.switches.backupdb
      util.firebase.backupDBfile(this.db,this,this.config.guild.backup,{filenameprefix : 'roshan_db_', messageprefix : '**Roshan Backup DB**'}).then(snap => {
        //Create cache maps for Profiles and Servers (Firebase)
        this.discordLog.log('info','Backup done!')
        this.cache.profiles = new FirebaseCache(this.db.child('profiles'),Object.keys(snap.profiles).map(profile => [profile,snap.profiles[profile]]));
        this.cache.servers = new FirebaseCache(this.db.child('servers'),snap.servers);

        //Update leaderboard (Firebase)
        if(this.config.switches.leaderboardUpdate){updateLeaderboard(this,snap.profiles)};

        //Update public (Firebase)
        const data_public = {discord_invite : this.config.invite, discord_server : this.config.server, users : Object.keys(snap.profiles).length, version : package.version}
        this.db.child('public').update(data_public).then(() => this.discordLog.log('info','Update public Info'))

        // Update accounts schema
        // Object.keys(snap.profiles).map(p => ({_id : p, data : snap.profiles[p]})).forEach(p => {
        //   p.data.card.pos = 'all'
        //   p.data.card.bg = '0'
        //   this.db.child('profiles/'+p._id).update(updateAccountSchema(p.data))
        // })

        this.cache.betatesters = new FireSetCache(this.db.child('betatesters'),[this.owner.id,...this.server.membersWithRole(this.config.roles.betatester).map(m => m.id),...snap.betatesters ? Object.keys(snap.betatesters).filter(b => snap.betatesters[b]) : []])
        this.cache.supporters = new FireSetCache(this.db.child('supporters'),[...this.server.membersWithRole(this.config.roles.supporter).map(m => m.id),...snap.supporters ? Object.keys(snap.supporters).filter(b => snap.betatesters[b]) : []])

        this.cache.feeds = new FireListenCache(this.db.child('feeds'))
        this.cache.feeds.order = function(){
          return this.bucket.sort(function(a,b){
            a = parseInt(a._id)
            b = parseInt(b._id)
            return b-a
          })
        }

        this.cache.tourneys = new FireListenCache(this.db.child('tourneys'))
        this.cache.tourneys.order = function(){
          const now = util.date()
          return this.bucket.sort(sortTourneys)
        }
        this.cache.tourneys.getPlaying = function(){
          const now = util.date()
          return this.bucket.filter(t => t.start < now && now < t.finish)
        }
        this.cache.tourneys.getNext = function(){
          const now = util.date()
          return this.bucket.filter(t => (t.until && now < t.until) || (t.start && now < t.start))
        }
        this.discordLog.log('info','Cache loaded');
      })
    }
  })

})


const updateLeaderboard = function(bot,snap){
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
    bot.db.child('leaderboard').set(update).then(() => bot.discordLog.log('info','Ranking Updated'))
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
