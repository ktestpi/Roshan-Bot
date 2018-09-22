const Aghanim = require('aghanim')
const Eris = require('eris')
const path = require('path')
const { Color } = require('erisjs-utils')
const firebase = require('firebase-admin');

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
bot.addCategory('Fun','Ayuda los comandos de emojis y memes')
bot.addCategory('Artifact','Ayuda los comandos de Artifact')

//Load commands
bot.addCommandDir(path.join(__dirname,'opendota'))
bot.addCommandDir(path.join(__dirname,'account'))
bot.addCommandDir(path.join(__dirname,'server'))
bot.addCommandDir(path.join(__dirname,'general'))
bot.addCommandDir(path.join(__dirname,'fun'))
bot.addCommandDir(path.join(__dirname,'bot'))
bot.addCommandDir(path.join(__dirname,'dota2'))
bot.addCommandDir(path.join(__dirname,'card'))
bot.addCommandDir(path.join(__dirname,'artifact'))


// bot.db.child('profiles').once('value').then(snap => {
//   if(!snap.exists()){return}
//   snap = snap.val()
//   // console.log(snap);
//   let profiles = Object.keys(snap).map(profile => Object.assign({},snap[profile],{_id : profile}))
//   profiles.forEach(profile => {
//     bot.db.child(`profiles/${profile._id}/profile`).update({dota : profile.profile.dotabuff})
//   })
// })

bot.connect();
