const { Command } = require('aghanim')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('bag',{
  category : 'Diretide', help : 'See your bag and stats', args : ''},
  function(msg, args, command){
    const game = command.game
    const user = game.actions.getCacheUserFromMsg(msg)
    if(!user){return game.actions.retryCommand(this,msg,args,command)}

    return game.reply(msg,game.actions.userEmbed(user,{
      author :  {name : `${msg.author.username}'s bag`, icon_url : msg.author.avatarURL},
      fields : [
        {name : 'Bag', value : `${game.config.emojis.candies}: ${user.candies}\n${game.config.emojis.essence}: ${user.essence}`, inline : true},
        {name : 'Stats', value : `${game.config.setup.defense.emoji}: ${user.stats.defense} ${game.config.setup.farm.emoji}: ${user.stats.farm} ${game.config.setup.send.emoji}: ${user.stats.send}\n${game.config.setup.steal.emoji}: ${user.stats.steal} ${game.config.setup.sugar.emoji}: ${user.stats.sugar}`, inline : true},
        {name : 'XP', value : `${game.config.emojis.xp}: ${user.xp}`, inline : true}
      ],
      footer : {text : game.name}
    }))
  })
