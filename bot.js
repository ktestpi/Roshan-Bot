const Aghanim = require('aghanim')
const Eris = require('eris')
const path = require('path')
const { Color } = require('erisjs-utils')
const firebase = require('firebase-admin');
const Locale = require('./classes/locale.js')
// const { cmdLocalString } = require('../../helpers/localestrings')

// Extends Eris Guild Structure
// Eris.Guild.prototype.membersWithRole = function(roleName){
//   const role = this.roles.find(r => r.name === roleName)
//   return role ? this.members.filter(m => m.roles.includes(role.id)) : []
// }
//

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
  databaseURL: "https://roshan-bot.firebaseio.com"
});

//Initialize Bot with Aghanim Command Client
const bot = new Aghanim(TOKEN,CONFIG.setup)

//Add keys to bot
bot.config = CONFIG
bot.config.colors.palette = {default : CONFIG.color}
bot.envprod = ENVPROD
bot.firebase = firebase;
bot.db = firebase.database().ref();

//Load events (not neccesary activate through command)
bot.addEventDir(path.join(__dirname,'events'))
//
bot.addExtensionDir(path.join(__dirname,'extensions'))

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
bot.addCommandDir(path.join(__dirname,'commands/card'))
bot.addCommandDir(path.join(__dirname,'commands/artifact'))

bot.locale = new Locale(path.join(__dirname,'locale'),{},{defaultLanguage : 'en', devLanguage : 'en'})
// bot.db.child('profiles').once('value').then(snap => {
//   if(!snap.exists()){return}
//   snap = snap.val()
//   // console.log(snap);
//   let profiles = Object.keys(snap).map(profile => Object.assign({},snap[profile],{_id : profile}))
//   profiles.forEach(profile => {
//     bot.db.child(`profiles/${profile._id}/profile`).update({dota : profile.profile.dotabuff})
//   })
// })

function filterCommands(cmd,query,owner){
  if(query === 'owner'){
    return owner
  }
  return !cmd.hide
}

bot.addCommand(new Aghanim.Command('help',{},function(msg,args,command){
  const categories = this.categories.map(c => c.name.toLowerCase())
  const query = args.from(1).toLowerCase();
  const lang = this.locale.getUserStrings(msg)
  const owner = msg.author.id === bot.owner.id
  if(query === 'owner' && !owner){return}
  let helpMessage = lang.helpMessage +'\n\n'
  if(categories.includes(query)){
    const cmds = this.getCommandsFromCategories(query)
    const prefix = this.defaultPrefix
    if(!cmds){helpMessage += this.categories.filter(c => !c.hide).map(c => `**${c.name}** \`${this.defaultPrefix}help ${c.name.toLowerCase()}\` - ${this.locale.getCat(c.name,msg)}`).join('\n') + '\n\n' + lang.helpMessageAfterCategories}//// TODO:
    else{
      helpMessage += cmds.filter(c => filterCommands(c,query,owner)).map(c => {
        const langCmd = this.locale.getCmd(c.name,msg)
        return `\`${prefix}${c.name}${langCmd.args ? ' ' + langCmd.args : ''}\` - ${langCmd.help || c.help}${c.subcommands.length ? '\n' + c.subcommands.filter(s => filterCommands(s,query,owner)).map(s => {
          const langCmd = this.locale.getCmd(c.name + '_' + s.name,msg)
          return `  · \`${s.name}${langCmd.args ? ' ' + langCmd.args : ''}\` - ${langCmd.help}`}).join('\n') : ''}`
      }).join('\n')
    }
  }else{
    helpMessage += this.categories.filter(c => !c.hide).map(c => `**${c.name}** \`${this.defaultPrefix}help ${c.name.toLowerCase()}\` - ${this.locale.getCat(c.name,msg)}`).join('\n') + '\n\n' + lang.helpMessageAfterCategories
  }
  if(!this.setup.helpDM){
    msg.reply(helpMessage)
  }else{
    msg.replyDM(helpMessage)
  }
}))

bot.on('aghanim:messageCreate:error',function(ev,error,msg){
  console.log(ev.name,'tuvo un error!',error)
})

bot.connect();
