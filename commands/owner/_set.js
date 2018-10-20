const { Command } = require('aghanim')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')

module.exports = new Command('set',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Testing', args : '', cooldownMessage : function(msg,args,command,cooldown){return `Quedan ${cooldown} seconds`},
  ownerOnly : true, hide : true, cooldown : 10},
  function(msg, args, command){
      // this.dislog.send('memberin',`Nuevo usuario: **${msg.author.username}**`,`Hola **${msg.author.username}**`,'Descripción del error',msg.author)
      // this.dislog.send('memberin',{title : 'Hola',description : msg.author.username},`Hola **${msg.author.username}**`,'Descripción del error',msg.author)
      // this.discordLog.send('guildnew',null,'Name Guild',null,msg.author)
      // console.log(this.cache.profiles.find(p => p._id === msg.author.id))
      // this.cache.servers.modify(msg.channel.guild.id,{lang : 'es'})

      // console.log(Promise.reject());
      command.client.owner.send('hola')
      return command.error('Hola como estás')
      msg.replyError('funciona?!')
      // command.error()
      return new Promise((res,rej) => {
        setTimeout(() => {res(4)},2000)
      })
      // console.log(this.logg.bucket,this.logg.overview());
      // setTimeout(() => msg.reply(this.logg.overview()),2000)
  })
