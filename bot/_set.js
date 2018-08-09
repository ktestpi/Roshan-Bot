const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const util = require('erisjs-utils')
const enumHeroes = require('../helpers/enums/heroes')

module.exports = new Command('set',{
  category : 'Owner', help : 'Testing', args : '', cooldownMessage :'Quedan **<cd>**s',
  ownerOnly : true, hide : true},
  function(msg, args, command){
      // this.dislog.send('memberin',`Nuevo usuario: **${msg.author.username}**`,`Hola **${msg.author.username}**`,'Descripción del error',msg.author)
      // this.dislog.send('memberin',{title : 'Hola',description : msg.author.username},`Hola **${msg.author.username}**`,'Descripción del error',msg.author)
      // this.discordLog.send('guildnew',null,'Name Guild',null,msg.author)
      // console.log(this.cache.profiles.find(p => p._id === msg.author.id))
      this.cache.servers.modify(msg.channel.guild.id,{lang : 'es'})
      // console.log(this.logg.bucket,this.logg.overview());
      // setTimeout(() => msg.reply(this.logg.overview()),2000)
  })
