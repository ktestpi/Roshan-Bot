const { Command } = require('aghanim')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('sugar',{
  category : 'Diretide', help : 'Attack to Roshan when he is SugarRush mode', args : '', cooldown : 5*60,
  cooldownMessage : function(msg,args,command,cooldown){return `${command.game.actions.secondsToHms(cooldown)} remaining`}},
  function(msg, args, command){
    const game = command.game
    const user = game.actions.getCacheUserFromMsg(msg)
    if(!user){return game.actions.retryCommand(this,msg,args,command)}//Save profile

    const RoshanMode = game.status.getStatus().mode
    if(RoshanMode !== 1){
      game.reply(msg,game.status.embed({description : 'Roshan isn\'t in SugarRush mode. Try it when he does'}))
      return commnad.error()
    }
    if(!game.actions.reqUserCheck(user,game.config.setup.sugar.require)){game.reply(msg,game.actions.reqUserShow(game.config.setup.sugar.require));return command.error()} //show requirements
    const calc = game.actions.calcReqRew(user,game.config.setup.sugar.require,game.config.events.sugarrush.rewards)
    calc.total.stats.sugar += calc.rewards.candies
    const description = `${game.config.events.sugarrush.emoji} **${msg.author.username}** sugarrushed to Roshan **${game.actions.showRewards(calc.rewards)}**`

    return Promise.all([
      game.cache.users.save(user._id,calc.total)
    ]).then(() => {
      const embed = game.actions.userEmbed(user,{description})
      return Promise.all([
        game.reply(msg,embed),
        game.log(embed)
      ])
    })
  })
