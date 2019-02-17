const Aghanim = require('aghanim')
// const Eris = require('aghanim/node_modules/eris')
const { Eris } = require('aghanim')
const path = require('path')
const { Color } = require('erisjs-utils')
const firebase = require('firebase-admin');
const Locale = require('./classes/locale.js')
const { ErrorManager } = require('./classes/errormanager.js')
const Notifier = require('./classes/notifier.js')
const EmbedBuilder = require('./classes/embed-builder.js')

let TOKEN, ENVPROD = false;
const firebaseConfig = {
  "type": "service_account",
  // "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  // "client_email": process.env.CLIENT_EMAIL,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
};

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
CONFIG.color = Color.convert(CONFIG.color,'hex-int');
for(cat in CONFIG.colors){
  if(typeof CONFIG.colors[cat] == 'string'){CONFIG.colors[cat] = Color.convert(CONFIG.colors[cat],'hex-int');continue}
  for(c in CONFIG.colors[cat]){
    CONFIG.colors[cat][c] = Color.convert(CONFIG.colors[cat][c],'hex-int');
  }
}

//Initialize Firebase
firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL: "https://roshan-bot.firebaseio.com",
  storageBucket: "roshan-bot.appspot.com"
});

//Initialize Bot with Aghanim Command Client
const bot = new Aghanim(TOKEN,CONFIG.setup)

bot.commandArgsMiddleware = function(args,msg){
  args.user = {}
  args.user.supporter = bot.components.Users.isSupporter(msg.author.id)
  args.user.betatester = bot.components.Users.isBetatester(msg.author.id)
  args.user.lang = bot.locale.getUserStrings(msg)
  args.user.langstring = key => args.user.lang[key] || ''
  args.user.locale = (langString,replacements) => args.replacer(args.user.lang[langString] || langString, replacements) 
  args.user.langFlag = bot.locale.getUserLang(msg)
  args.replacer = bot.locale.replacer.bind(bot.locale)
}

//Add keys to bot
bot.config = CONFIG
bot.config.colors.palette = {default : CONFIG.color}
bot.envprod = ENVPROD
bot.firebase = firebase;
bot.storage = firebase.storage().bucket()
bot.db = firebase.database().ref()
bot.errorManager = new ErrorManager(bot, bot.config.console)
bot.notifier = new Notifier(bot, bot.config.notifier)

//Define categories for commands
bot.addCategory('General','Ayuda de general')
bot.addCategory('Dota 2','Ayuda de Dota 2')
bot.addCategory('Account','Ayuda para la gestión de la cuenta en Roshan')
bot.addCategory('Server','Ayuda para comandos de servidor')
bot.addCategory('Owner','Ayuda para comandos de propietario')
bot.addCategory('Fun','Ayuda para comandos de emojis y memes')
bot.addCategory('Artifact','Ayuda los comandos de Artifact')

//Load commands
bot.addCommandDir(path.join(__dirname,'commands/opendota'))
bot.addCommandDir(path.join(__dirname,'commands/account'))
bot.addCommandDir(path.join(__dirname,'commands/server'))
bot.addCommandDir(path.join(__dirname,'commands/general'))
bot.addCommandDir(path.join(__dirname,'commands/fun'))
bot.addCommandDir(path.join(__dirname,'commands/owner'))
bot.addCommandDir(path.join(__dirname,'commands/dota2'))
bot.addCommandDir(path.join(__dirname,'commands/playercard'))
bot.addCommandDir(path.join(__dirname,'commands/artifact'))

// bot.locale = new Locale(path.join(__dirname,'locale'),{},{defaultLanguage : 'en', devLanguage : 'en'})
// bot.db.child('profiles').once('value').then(snap => {
//   if(!snap.exists()){return}
//   snap = snap.val()
//   // console.log(snap);
//   let profiles = Object.keys(snap).map(profile => Object.assign({},snap[profile],{_id : profile}))
//   profiles.forEach(profile => {
//     bot.db.child(`profiles/${profile._id}/profile`).update({dota : profile.profile.dotabuff})
//   })
// })

bot.addComponentDir(path.join(__dirname, 'components'))

function filterCommands(cmd,query,owner){
  if(query === 'owner'){
    return owner
  }
  return !cmd.hide
}

bot.addCommand(new Aghanim.Command('help',{}, async function(msg,args,client){
  const categories = client.categories.map(c => c.name.toLowerCase())
  const query = args.from(1).toLowerCase();
  const lang = client.locale.getUserStrings(msg)
  const owner = msg.author.id === bot.owner.id
  if(query === 'owner' && !owner){return}
  let helpMessage = lang['help.message'] +'\n\n'
  if(categories.includes(query)){
    const cmds = client.getCommandsFromCategories(query).sort((a, b) => a.name > b.name ? 1 : -1)
    const prefix = client.defaultPrefix
    if(!cmds){helpMessage += client.categories.filter(c => !c.hide).map(c => `**${c.name}** \`${client.defaultPrefix}help ${c.name.toLowerCase()}\` - ${client.locale.getCat(c.name,msg)}`).join('\n') + '\n\n' + lang['help.messageaftercategories']}//// TODO:
    else{
      helpMessage += cmds.filter(c => filterCommands(c,query,owner)).map(c => {
        const langCmd = client.locale.getCmd(c.name,msg)
        return `\`${prefix}${c.name}${langCmd.args ? ' ' + langCmd.args : ''}\` - ${langCmd.help || c.help}${c.subcommands.length ? '\n' + c.subcommands.filter(s => filterCommands(s,query,owner)).map(s => {
          const langCmd = client.locale.getCmd(c.name + '_' + s.name,msg)
          return `  · \`${s.name}${langCmd.args ? ' ' + langCmd.args : ''}\` - ${langCmd.help}`}).join('\n') : ''}`
      }).join('\n')
    }
  }else{
    helpMessage += client.categories.filter(c => !c.hide).map(c => `**${c.name}** \`${client.defaultPrefix}help ${c.name.toLowerCase()}\` - ${client.locale.getCat(c.name,msg)}`).join('\n') + '\n\n' + lang['help.messageaftercategories']
  }
  if(!client.setup.helpDM){
    return msg.reply(helpMessage)
  }else{
    return msg.replyDM(helpMessage)
  }
}))

// bot.on('aghanim:command:error', function (error) {
//   console.log('Aghanim COMMAND ERROR from Bot', error)
//   // bot.emit('roshan:errorManager', error)

// })

// bot.on('aghanim:error', function(error){
//   console.log('Aghanim ERROR from Bot',error)
//   // bot.emit('roshan:errorManager', error)
// })

// bot.on('error',function(error){
//   console.log('ERROR from Bot', error)
//   // bot.emit('roshan:errorManager', error)
// })


process.on('unhandledRejection', (reason, p) => {
  Promise.resolve(p).then((val) => {
    bot.emit('error', new Error(`Unhandled Rejection at: ${val}\n${reason}`))
  }).catch((err) => {
    bot.emit('error', new Error(`Unhandled Rejection Rejected at: ${err.stack}\n${reason}`))
  })
  // application specific logging, throwing an error, or other logic here
})

process.on('unhandledRejection', r => console.log(r))

Eris.Guild.prototype.membersWithRole = function (roleName) {
  const role = this.roles.find(r => r.name === roleName)
  return role ? this.members.filter(m => m.roles.includes(role.id)) : []
}

Eris.Message.prototype.addReactionSuccess = function () {
  return this.addReaction(this._client.config.emojis.default.accept)
}

Eris.Message.prototype.addReactionFail = function () {
  return this.addReaction(this._client.config.emojis.default.error)
}

Eris.Message.prototype.addReactionSending = function () {
  return this.addReaction(this._client.config.emojis.default.envelopeIncoming)
}

Object.defineProperty(Eris.User.prototype, 'account', {
  get : function(){
    const account = bot.cache.profiles.get(this.id) || bot.components.Account.schema()
    return account
  }
})

Object.defineProperty(Eris.User.prototype, 'registered', {
  get: function () {
    return bot.cache.profiles.has(this.id) 
  },
  enumerable : true
})

Object.defineProperty(Eris.User.prototype, 'supporter', {
  get: function () {
    return bot.components.Users.isSupporter(this.id)
  },
  enumerable : true
})

Object.defineProperty(Eris.User.prototype, 'betatester', {
  get: function () {
    return bot.components.Users.isBetatester(this.id)
  },
  enumerable : true
})

Object.defineProperty(Eris.User.prototype, 'profile', {
  get: function () {
    return {
      account : this.account,
      supporter : this.supporter,
      betatester : this.betatester,
      registered : this.registered
    }
  },
  enumerable: true
})

Object.defineProperty(Eris.Guild.prototype, 'account', {
  get: function () {
    const account = bot.cache.servers.get(this.id) || bot.components.Account.schema()
    return account
  }
})

Object.defineProperty(Eris.Guild.prototype, 'registered', {
  get: function () {
    return bot.cache.servers.has(this.id)
  },
  enumerable: true
})

// Object.defineProperty(Eris.User.prototype.account, 'log', {
//   get: function () {
//     // const account = bot.cache.profiles.get(this.id)
//     console.log(this)
//     // return account
//   }
// })

// Eris.Message.prototype.reply = function (content, file) {
//   return new Promise((resolve, reject) => {
//     this.channel.createMessage(content, file)
//       .then(m => resolve(m))
//       .catch(err => reject(err))
//   })
// }

// Eris.Message.prototype.replyDM = function (content, file) {
//   return new Promise((resolve, reject) => {
//     this.author.getDMChannel()
//       .then(channel => channel.createMessage(content, file))
//       .then(m => resolve(m))
//       .catch(err => reject(err))
//   })
// }

Eris.Message.prototype.reply = function (content, replacements, file) {
  return new Promise((resolve, reject) => {
    this.channel.createMessage(parseContent(content, replacements, this), file)
      .then(m => resolve(m))
      .catch(err => reject(err))
  })
}

Eris.Message.prototype.replyDM = function (content, replacements, file) {
  return new Promise((resolve, reject) => {
    this.author.getDMChannel()
      .then(channel => channel.createMessage(parseContent(content, replacements, this), file))
      .then(m => resolve(m))
      .catch(err => reject(err))
  })
}

function parseContent(content, replacements, msg){
  if(typeof content === 'string'){
    const lang = msg._client.locale.getUserStrings(msg)
    return bot.locale.replacer(lang[content] || content, replacements)
  }else if(content instanceof EmbedBuilder){
    return content.build(msg._client, msg._client.locale.getUserLang(msg), replacements)
  }
  return content
}

bot.connect();


// bot.addGame = function (game) {
//   if (!this.games) { this.games = {} }
//   this.games[game.name.toLowerCase()] = game
//   this.addCategory(game.category, '')
//   game.commands.forEach(cmd => { cmd.game = game; cmd.category = game.category; this.addCommand(cmd) })
//   game.events.forEach(ev => { ev.game = game; ev.category = game.category; this.addEvent(ev) })
//   // this.events.forEach(ev => bot.addEvent(ev))
//   game.client = this
// }