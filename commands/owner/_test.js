const { Command } = require('aghanim')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')

module.exports = new Command('tes',{
  category : 'Owner', help : 'Testing', args : '', cooldownMessage :'Quedan **<cd>**s',
  ownerOnly : true, hide : true},
  function(msg, args, command){
      // this.dislog.send('memberin',`Nuevo usuario: **${msg.author.username}**`,`Hola **${msg.author.username}**`,'Descripción del error',msg.author)
      // this.dislog.send('memberin',{title : 'Hola',description : msg.author.username},`Hola **${msg.author.username}**`,'Descripción del error',msg.author)
      // this.discordLog.send('guildnew',null,'Name Guild',null,msg.author)
      // console.log(this.cache.profiles.find(p => p._id === msg.author.id))
      // msg.sendDM('setId',null,{user : msg.author.username},true)
      // msg.reply(`:flag_gb: Hi, I am a **Dota 2** and **Artifact** bot in Spanish. Read the **server guide**: use \`r!getstarted-en\`\n\n:flag_es: Hola, soy un bot en español para **Dota 2** y **Artifact**. Lee la guía del servidor: usa \`r!getstarted-es\``)
      const lang = this.locale.getUserStrings(msg)
      console.log(lang);
      // return msg.replyLocale('profileRegistered',undefined,{username : msg.author.username})
      // console.log(this.logg.bucket,this.logg.overview());
      // setTimeout(() => msg.reply(this.logg.overview()),2000)
  })
