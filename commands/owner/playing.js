const { Command } = require('aghanim')

module.exports = new Command('playing',{
  category : 'Owner', help : 'Establece el mensaje de Jugando a', args : '<mensaje>',
  ownerOnly : true},
  async function(msg, args, client){
    if(args.length < 2){
      return client.components.Bot.setStatus(0,null,client.config.playing,null,true).then(() => client.notifier.bot(`Playing to default **${client.config.playing}**`)).catch(err => msg.addReactionFail())
    }else{
      const playing = args.from(1)
      if(!playing){return};
      return client.components.Bot.setStatus(0,null,playing,null,true).then(() => client.notifier.bot(`Playing: **${playing}**`)).catch(err => msg.addReactionFail())
    }
  })
