const { Command } = require('aghanim')

const max = 1024
module.exports = new Command('gameinfo',{
  category : 'General', help : 'Información sobre el juego', args : '<dota/artifact>'},
  async function(msg, args, client){
    if(args[1] === 'artifact'){
      return client.components.Artifact.gameInfo()
        .then(info => msg.reply('game.currentplayers', { count: info.currentplayers, game :'Artifact'}))
    }else{
      return client.components.Dota.gameInfo().then(info => msg.reply('game.currentplayers', { count: info.currentplayers, game: 'Dota 2' }))
    }
  })

