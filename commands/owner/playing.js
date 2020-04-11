module.exports = {
  name:'playing',
  category : 'Owner',
  help : 'Establece el mensaje de Jugando a',
  args : '<mensaje>',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    if(args.length < 2){
      return client.components.Bot.setStatus(0,null,client.config.playing,null,true).then(() => client.logger.info(`Playing to default **${client.config.playing}**`))
    }else{
      const playing = args.from(1)
      if(!playing){return}
      return client.components.Bot.setStatus(0,null,playing,null,true).then(() => client.logger.info(`Playing: **${playing}**`))
    }
  }
}
