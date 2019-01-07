const { Command } = require('aghanim')

module.exports = new Command('playing',{
  category : 'Owner', help : 'Establece el mensaje de Jugando a', args : '<mensaje>',
  ownerOnly : true},
  function(msg, args, command){
    if(args.length < 2){
      return this.components.Bot.setStatus(0,null,this.config.playing,null,true).then(() => this.notifier.bot(`Playing to default **${this.config.playing}**`)).catch(err => msg.addReactionFail())
    }else{
      const playing = args.from(1)
      if(!playing){return};
      return this.components.Bot.setStatus(0,null,playing,null,true).then(() => this.notifier.bot(`Playing: **${playing}**`)).catch(err => msg.addReactionFail())
    }
  })
